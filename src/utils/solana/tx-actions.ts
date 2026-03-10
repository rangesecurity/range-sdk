import { ISolanaTransaction } from '../../types/ISolanaBlock';
import { JITO_TIP_ACCOUNTS, SOL_MINT, SQUADS_V3, SQUADS_V4 } from './programs';
import { formatAmountToUsd } from '../../services/AssetManager';

export const isSquads = (p: string) => [SQUADS_V3, SQUADS_V4].includes(p);

// Determine if log contains deployment and return program address
export function filterLogs(logs: any, prefix: string): string[] {
  const programDeploymentLogs = logs.filter((l: string) =>
    l.startsWith(prefix)
  );
  const newProgramIdList = programDeploymentLogs.map((l: string) => {
    return l.split(' ').pop();
  });
  return newProgramIdList;
}

// Determine if log contains set authority and return program address
export function extractSetAuthorityFromLog(logs: any): string | null {
  const setAuthorityLog = logs.find((log: string) =>
    log.includes('New authority')
  );

  if (!setAuthorityLog) {
    return null;
  }

  // Extract the new authority from the log message
  const parts = setAuthorityLog.split(' ');
  return parts[parts.length - 1];
}

// Determine if log contains deployment and return program address
export function extractProgramUpgradedFromLog(logs: any): string | null {
  const upgradeLog = logs.find((log: string) =>
    log.includes('Upgraded program')
  );

  if (!upgradeLog) {
    return null;
  }

  // Extract the program address from the log message
  const parts = upgradeLog.split(' ');
  return parts[parts.length - 1];
}

export function getErrorFromLog(logs: string[]) {
  const errorList: any = logs
    .map((l) => {
      if (l.includes('Program') && l.includes('failed:')) {
        const parts = l.split(/Program | failed:/);
        const errorId = String(
          parseInt(parts[2].split(' custom program error: ')[1])
        );
        return {
          programId: parts[1],
          errorId,
        };
      }
    })
    .filter(Boolean);

  return errorList;
}

export function parseTxData(tx: ISolanaTransaction) {
  const outer = tx.transaction.message.instructions || [];
  const inner = tx.meta.innerInstructions || [];
  const accounts = tx.transaction.message.accountKeys.map((e) => e.pubkey);
  const signers = tx.transaction.message.accountKeys
    .filter((e) => e.signer)
    .map((e) => e.pubkey);
  const txHash = tx.transaction.signatures[0];

  return { inner, outer, accounts, txHash, signers };
}

// Raw transfer data — amounts are unscaled (lamports for SOL, raw token amounts for SPL)
export interface IRawTransfer {
  from: string;
  to: string;
  amount: number;
  mint: string;
  id: string;
}

// Enriched transfer with USD conversion and symbol
export interface ITransfer extends IRawTransfer {
  symbol: string;
  usd: number;
  tokenUsdString: string;
}

export function getTokenOwners(tx: any) {
  const accountKeys: Record<string, string> = Object.fromEntries(
    tx.transaction.message.accountKeys.map((e: any, i: any) => {
      return [i, e.pubkey];
    })
  );

  const ownerMap: Record<string, string> = {};

  for (const tokenBalance of tx.meta.preTokenBalances) {
    const tokenAccount = accountKeys[tokenBalance.accountIndex];
    ownerMap[tokenAccount] = tokenBalance.owner;
  }

  for (const tokenBalance of tx.meta.postTokenBalances) {
    const tokenAccount = accountKeys[tokenBalance.accountIndex];
    ownerMap[tokenAccount] = tokenBalance.owner;
  }

  return ownerMap;
}

export function getTransfers(tx: any): IRawTransfer[] {
  const transfers: IRawTransfer[] = [];

  // Process outer instructions
  const ownerMap = getTokenOwners(tx);

  for (let i = 0; i < tx.transaction.message.instructions.length; i++) {
    const ix = tx.transaction.message.instructions[i];
    const obs = processTransferInstruction(ix, ownerMap);
    transfers.push(
      ...obs.map((e) => {
        return { ...e, id: String(i + 1) };
      })
    );
  }

  // Process inner instructions
  for (let j = 0; j < tx.meta.innerInstructions.length; j++) {
    const ixObj = tx.meta.innerInstructions[j];
    for (let k = 0; k < ixObj.instructions.length; k++) {
      const ix = ixObj.instructions[k];
      const obs = processTransferInstruction(ix, ownerMap);
      transfers.push(
        ...obs.map((e) => {
          return { ...e, id: `${j + 1}.${k + 1}` };
        })
      );

      if (
        ix.program === 'bpf-upgradeable-loader' &&
        ix.parsed.type === 'upgrade'
      ) {
        const { bufferAccount, spillAccount } = ix.parsed.info;

        const spillAccIndex = tx.transaction.message.accountKeys.findIndex(
          (e: any) => e.pubkey === spillAccount
        );

        const spillAmount =
          tx.meta.postBalances[spillAccIndex] -
          tx.meta.preBalances[spillAccIndex];

        transfers.push({
          from: bufferAccount,
          to: spillAccount,
          amount: spillAmount,
          id: `${j + 1}.${k + 1}`,
          mint: SOL_MINT,
        });
      }
    }
  }

  return transfers;
}

// Helper function to process a single instruction and extract raw transfer data
function processTransferInstruction(
  ix: any,
  ownerMap: Record<string, string>
): Omit<IRawTransfer, 'id'>[] {
  const observations: Omit<IRawTransfer, 'id'>[] = [];

  // Handle regular transfers
  if (ix.parsed?.type === 'transfer') {
    const parsed = ix.parsed?.info;

    if (parsed.tokenAmount) {
      const sender = parsed.authority || parsed.owner || parsed.source;
      const receiverTokenAccount = parsed.destination;
      const receiverOwner = ownerMap[receiverTokenAccount];

      // SPL token transfer
      observations.push({
        from: sender,
        to: receiverOwner || receiverTokenAccount,
        amount: parsed.tokenAmount.amount,
        mint: parsed.tokenAmount.mint,
      });
    } else if (parsed.lamports) {
      // SOL transfer
      observations.push({
        from: parsed.source,
        to: parsed.destination,
        amount: parsed.lamports,
        mint: SOL_MINT,
      });
    }
  }

  // Handle transferChecked
  else if (ix.parsed?.type === 'transferChecked') {
    const parsed = ix.parsed.info;

    if (parsed.tokenAmount) {
      const sender = parsed.authority || parsed.source;
      const receiverTokenAccount = parsed.destination;
      const receiverOwner = ownerMap[receiverTokenAccount];
      // SPL token transfer (transferChecked)
      observations.push({
        from: sender,
        to: receiverOwner || receiverTokenAccount,
        amount: parsed.tokenAmount.amount,
        mint: parsed.mint,
      });
    }
  }

  return observations;
}

// Enrich raw transfers with USD values and symbol via the AssetManager cache
export function enrichTransfers(transfers: IRawTransfer[]): ITransfer[] {
  return transfers.map((t) => {
    const { symbol, usd, tokenUsdString } = formatAmountToUsd({
      amount: t.amount,
      mint: t.mint,
    });
    return { ...t, symbol, usd, tokenUsdString };
  });
}

export function separateDust(transfers: ITransfer[]) {
  const dust: ITransfer[] = [];
  const nonDust: ITransfer[] = [];
  const jitoTip: ITransfer[] = [];

  for (const transfer of transfers) {
    if (JITO_TIP_ACCOUNTS.includes(transfer.to)) {
      jitoTip.push(transfer);
    } else if (transfer.usd < 1) {
      dust.push(transfer);
    } else {
      nonDust.push(transfer);
    }
  }

  return { dust, nonDust, jitoTip };
}
