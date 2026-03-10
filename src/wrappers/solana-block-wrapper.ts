import * as flatbuffers from 'flatbuffers';
import { SolanaBlock } from '../flatbuffers/solana/block/solana-block';
import { SolanaBlockT } from '../flatbuffers/solana/block/solana-block';
import { Message } from '../flatbuffers/solana/block/message';
import { SolanaTransactionT } from '../flatbuffers/solana/block/solana-transaction';
import {
  TransactionT,
  Transaction,
} from '../flatbuffers/solana/block/transaction';
import {
  TransactionMetaT,
  TransactionMeta,
} from '../flatbuffers/solana/block/transaction-meta';
import { MessageT } from '../flatbuffers/solana/block/message';
import {
  InstructionT,
  Instruction,
} from '../flatbuffers/solana/block/instruction';
import { InnerInstructionT } from '../flatbuffers/solana/block/inner-instruction';
import { TokenBalanceT } from '../flatbuffers/solana/block/token-balance';
import { UiTokenAmountT } from '../flatbuffers/solana/block/ui-token-amount';
import { AccountKeyT } from '../flatbuffers/solana/block/account-key';
import { BlockDataT } from '../flatbuffers/solana/block/block-data';

export class SolanaBlockWrapper {
  private block: SolanaBlock;

  constructor(buffer: Uint8Array) {
    const bb = new flatbuffers.ByteBuffer(buffer);
    this.block = SolanaBlock.getRootAsSolanaBlock(bb);
  }

  get height(): number {
    return Number(this.block.height() || 0);
  }
  get network(): string {
    return this.block.network() || '';
  }

  get timestamp(): number {
    return Number(this.block.timestamp() || 0);
  }

  get hash(): number {
    return Number(this.block.hash || 0);
  }

  get block_data() {
    const bd = this.block.blockData();
    if (!bd) return null;

    return {
      slot: bd.slot() || '',
      parentSlot: bd.parentSlot() || '',
      previousBlockhash: bd.previousBlockhash() || '',
      maliciousAddresses: this.getStringArray(
        bd.maliciousAddressesLength(),
        (i) => bd.maliciousAddresses(i)
      ),
      sanctionedAddresses: this.getStringArray(
        bd.sanctionedAddressesLength(),
        (i) => bd.sanctionedAddresses(i)
      ),
      blacklistedAddresses: this.getStringArray(
        bd.blacklistedAddressesLength(),
        (i) => bd.blacklistedAddresses(i)
      ),
    };
  }

  get transactions() {
    const txs: any[] = [];
    for (let i = 0; i < this.block.transactionsLength(); i++) {
      const solanaTx = this.block.transactions(i)!;
      const tx = solanaTx.transaction()!;
      const msg = tx.message()!;
      const meta = solanaTx.meta()!;

      txs.push({
        transaction: {
          signatures: this.getStringArray(tx.signaturesLength(), (i) =>
            tx.signatures(i)
          ),
          message: {
            accountKeys: this.getAccountKeys(msg),
            instructions: this.getInstructions(msg),
          },
        },
        meta: {
          fee: Number(meta.fee()),
          computeUnitsConsumed: Number(meta.computeUnitsConsumed()),
          logMessages: this.getStringArray(meta.logMessagesLength(), (i) =>
            meta.logMessages(i)
          ),
          preTokenBalances: this.getTokenBalances(
            meta.preTokenBalancesLength(),
            (i) => meta.preTokenBalances(i)
          ),
          postTokenBalances: this.getTokenBalances(
            meta.postTokenBalancesLength(),
            (i) => meta.postTokenBalances(i)
          ),
          preBalances: this.getBalances(meta.preBalancesLength(), (i) =>
            meta.preBalances(i)
          ),
          postBalances: this.getBalances(meta.postBalancesLength(), (i) =>
            meta.postBalances(i)
          ),
          innerInstructions: this.getInnerInstructions(meta),
        },
      });
    }
    return txs;
  }

  private getAccountKeys(msg: Message) {
    const keys: any[] = [];
    for (let i = 0; i < msg.accountKeysLength(); i++) {
      const key = msg.accountKeys(i)!;
      keys.push({
        pubkey: key.pubkey() || '',
        signer: key.signer(),
        writable: key.writable(),
        source: key.source() || '',
      });
    }
    return keys;
  }

  private getInstructions(msg: Message) {
    const insts: any[] = [];
    for (let i = 0; i < msg.instructionsLength(); i++) {
      const inst = msg.instructions(i)!;
      insts.push({
        programId: inst.programId() || '',
        program: inst.program() || '',
        data: inst.data() || '',
        parsed: this.safeParse(inst.parsed()),
        accounts: this.getStringArray(inst.accountsLength(), (j) =>
          inst.accounts(j)
        ),
      });
    }
    return insts;
  }

  private getStringArray(
    len: number,
    getter: (i: number) => string | null
  ): string[] {
    const result: string[] = [];
    for (let i = 0; i < len; i++) {
      result.push(getter(i) || '');
    }
    return result;
  }

  private getTokenBalances(
    len: number,
    getter: (i: number) => any | null
  ): any[] {
    const result: any[] = [];
    for (let i = 0; i < len; i++) {
      const tokenBalance = getter(i);
      if (tokenBalance) {
        result.push({
          accountIndex: tokenBalance.accountIndex(),
          mint: tokenBalance.mint() || '',
          owner: tokenBalance.owner() || '',
          programId: tokenBalance.programId() || '',
          uiTokenAmount: {
            amount: tokenBalance.uiTokenAmount()?.amount() || '0',
            decimals: tokenBalance.uiTokenAmount()?.decimals() || 0,
            uiAmount: tokenBalance.uiTokenAmount()?.uiAmount() || 0,
            uiAmountString:
              tokenBalance.uiTokenAmount()?.uiAmountString() || '0',
          },
        });
      }
    }
    return result;
  }

  private getBalances(
    len: number,
    getter: (i: number) => bigint | null
  ): number[] {
    const result: number[] = [];
    for (let i = 0; i < len; i++) {
      const balance = getter(i);
      result.push(balance ? Number(balance) : 0);
    }
    return result;
  }

  private getInnerInstructions(meta: any): any[] {
    const result: any[] = [];
    for (let i = 0; i < meta.innerInstructionsLength(); i++) {
      const innerIx = meta.innerInstructions(i);
      if (innerIx) {
        const instructions: any[] = [];
        for (let j = 0; j < innerIx.instructionsLength(); j++) {
          const inst = innerIx.instructions(j);
          if (inst) {
            instructions.push({
              programId: inst.programId() || '',
              program: inst.program() || '',
              data: inst.data() || '',
              parsed: this.safeParse(inst.parsed()),
              accounts: this.getStringArray(inst.accountsLength(), (k) =>
                inst.accounts(k)
              ),
            });
          }
        }
        result.push({
          index: innerIx.index(),
          instructions,
        });
      }
    }
    return result;
  }

  private safeParse(json?: string | null) {
    if (!json) return null;
    try {
      return JSON.parse(json);
    } catch {
      return null;
    }
  }
}

function convertJsonTokenBalanceToT(tb: any): TokenBalanceT {
  const tokenBalanceT = new TokenBalanceT();
  tokenBalanceT.accountIndex = tb.accountIndex ?? 0;
  tokenBalanceT.mint = tb.mint || '';
  tokenBalanceT.owner = tb.owner || '';
  tokenBalanceT.programId = tb.programId || '';
  if (tb.uiTokenAmount) {
    const uiT = new UiTokenAmountT();
    uiT.amount = tb.uiTokenAmount.amount || '0';
    uiT.decimals = tb.uiTokenAmount.decimals || 0;
    uiT.uiAmount = tb.uiTokenAmount.uiAmount || 0;
    uiT.uiAmountString = tb.uiTokenAmount.uiAmountString || '0';
    tokenBalanceT.uiTokenAmount = uiT;
  }
  return tokenBalanceT;
}

function convertJsonTransactionToT(jsonTx: any): SolanaTransactionT {
  // Create TransactionT with custom pack method to handle string arrays properly
  const transactionT = new TransactionT();
  if (jsonTx.transaction?.signatures) {
    transactionT.signatures = jsonTx.transaction.signatures;
  }

  // Override the pack method to handle string arrays correctly
  transactionT.pack = function (
    builder: flatbuffers.Builder
  ): flatbuffers.Offset {
    const message = this.message !== null ? this.message!.pack(builder) : 0;
    // Create string offsets for signatures array
    const signatureOffsets = this.signatures.map((sig: string) =>
      builder.createString(sig)
    );
    const signatures = Transaction.createSignaturesVector(
      builder,
      signatureOffsets
    );
    return Transaction.createTransaction(builder, message, signatures);
  };

  // Create MessageT with instructions
  if (jsonTx.transaction?.message) {
    const messageT = new MessageT();

    // Convert instructions
    if (jsonTx.transaction.message.instructions) {
      messageT.instructions = jsonTx.transaction.message.instructions.map(
        (ix: any) => {
          const instructionT = new InstructionT();
          instructionT.programId = ix.programId || '';
          instructionT.program = ix.program || ix.programId || '';
          instructionT.data = ix.data || '';
          instructionT.parsed = ix.parsed ? JSON.stringify(ix.parsed) : '';
          instructionT.accounts = ix.accounts || [];
          instructionT.stackHeight = ix.stackHeight || 0;

          // Override pack method for instruction to handle accounts string array
          instructionT.pack = function (
            builder: flatbuffers.Builder
          ): flatbuffers.Offset {
            const parsed =
              this.parsed !== null ? builder.createString(this.parsed!) : 0;
            const programId =
              this.programId !== null
                ? builder.createString(this.programId!)
                : 0;
            const program =
              this.program !== null ? builder.createString(this.program!) : 0;
            // Create string offsets for accounts array
            const accountOffsets = this.accounts.map((acc: string) =>
              builder.createString(acc)
            );
            const accounts = Instruction.createAccountsVector(
              builder,
              accountOffsets
            );
            const data =
              this.data !== null ? builder.createString(this.data!) : 0;

            return Instruction.createInstruction(
              builder,
              parsed,
              programId,
              program,
              accounts,
              data,
              this.stackHeight
            );
          };

          return instructionT;
        }
      );
    }

    // Convert account keys
    if (jsonTx.transaction.message.accountKeys) {
      messageT.accountKeys = jsonTx.transaction.message.accountKeys.map(
        (key: any) => {
          const accountKeyT = new AccountKeyT();
          accountKeyT.pubkey = key.pubkey || '';
          accountKeyT.signer = key.signer || false;
          accountKeyT.writable = key.writable || false;
          accountKeyT.source = key.source || '';
          return accountKeyT;
        }
      );
    }

    transactionT.message = messageT;
  }

  // Create TransactionMetaT with custom pack method
  const metaT = new TransactionMetaT();
  if (jsonTx.meta?.fee) {
    metaT.fee = BigInt(jsonTx.meta.fee);
  }
  if (jsonTx.meta?.computeUnitsConsumed) {
    metaT.computeUnitsConsumed = BigInt(jsonTx.meta.computeUnitsConsumed);
  }
  if (jsonTx.meta?.logMessages) {
    metaT.logMessages = jsonTx.meta.logMessages;
  }
  if (jsonTx.meta?.err) {
    metaT.err = JSON.stringify(jsonTx.meta.err);
  }
  if (jsonTx.meta?.preBalances) {
    metaT.preBalances = jsonTx.meta.preBalances.map((b: any) => BigInt(b));
  }
  if (jsonTx.meta?.postBalances) {
    metaT.postBalances = jsonTx.meta.postBalances.map((b: any) => BigInt(b));
  }
  if (jsonTx.meta?.preTokenBalances) {
    metaT.preTokenBalances = jsonTx.meta.preTokenBalances.map((tb: any) =>
      convertJsonTokenBalanceToT(tb)
    );
  }
  if (jsonTx.meta?.postTokenBalances) {
    metaT.postTokenBalances = jsonTx.meta.postTokenBalances.map((tb: any) =>
      convertJsonTokenBalanceToT(tb)
    );
  }
  if (jsonTx.meta?.innerInstructions) {
    metaT.innerInstructions = jsonTx.meta.innerInstructions.map(
      (group: any) => {
        const innerT = new InnerInstructionT();
        innerT.index = group.index ?? 0;
        innerT.instructions = (group.instructions || []).map((ix: any) => {
          const instructionT = new InstructionT();
          instructionT.programId = ix.programId || '';
          instructionT.program = ix.program || ix.programId || '';
          instructionT.data = ix.data || '';
          instructionT.parsed = ix.parsed ? JSON.stringify(ix.parsed) : '';
          instructionT.accounts = ix.accounts || [];
          instructionT.stackHeight = ix.stackHeight || 0;

          // Override pack method for instruction to handle accounts string array
          instructionT.pack = function (
            builder: flatbuffers.Builder
          ): flatbuffers.Offset {
            const parsed =
              this.parsed !== null ? builder.createString(this.parsed!) : 0;
            const programId =
              this.programId !== null
                ? builder.createString(this.programId!)
                : 0;
            const program =
              this.program !== null ? builder.createString(this.program!) : 0;
            const accountOffsets = this.accounts.map((acc: string) =>
              builder.createString(acc)
            );
            const accounts = Instruction.createAccountsVector(
              builder,
              accountOffsets
            );
            const data =
              this.data !== null ? builder.createString(this.data!) : 0;

            return Instruction.createInstruction(
              builder,
              parsed,
              programId,
              program,
              accounts,
              data,
              this.stackHeight
            );
          };

          return instructionT;
        });
        return innerT;
      }
    );
  }

  // Override pack method to handle logMessages string array
  metaT.pack = function (builder: flatbuffers.Builder): flatbuffers.Offset {
    const err = this.err !== null ? builder.createString(this.err!) : 0;
    const innerInstructions = TransactionMeta.createInnerInstructionsVector(
      builder,
      builder.createObjectOffsetList(this.innerInstructions)
    );
    // Create string offsets for logMessages array
    const logMessageOffsets = this.logMessages.map((msg: string) =>
      builder.createString(msg)
    );
    const logMessages = TransactionMeta.createLogMessagesVector(
      builder,
      logMessageOffsets
    );
    const preBalances = TransactionMeta.createPreBalancesVector(
      builder,
      this.preBalances
    );
    const postBalances = TransactionMeta.createPostBalancesVector(
      builder,
      this.postBalances
    );
    const preTokenBalances = TransactionMeta.createPreTokenBalancesVector(
      builder,
      builder.createObjectOffsetList(this.preTokenBalances)
    );
    const postTokenBalances = TransactionMeta.createPostTokenBalancesVector(
      builder,
      builder.createObjectOffsetList(this.postTokenBalances)
    );

    return TransactionMeta.createTransactionMeta(
      builder,
      this.computeUnitsConsumed,
      err,
      this.fee,
      innerInstructions,
      logMessages,
      preBalances,
      postBalances,
      preTokenBalances,
      postTokenBalances
    );
  };

  // Create SolanaTransactionT
  return new SolanaTransactionT(transactionT, metaT);
}

export function createSolanaBlockFromJson(jsonData: any): Uint8Array {
  const blockT = new SolanaBlockT();

  // Manually populate SolanaBlockT from JSON data
  if (jsonData.height) blockT.height = jsonData.height;
  if (jsonData.hash) blockT.hash = jsonData.hash;
  if (jsonData.timestamp) blockT.timestamp = jsonData.timestamp;
  if (jsonData.network) blockT.network = jsonData.network;

  // Handle blockData
  if (jsonData.blockData) {
    const blockDataT = new BlockDataT();
    blockDataT.slot = jsonData.blockData.slot || '';
    blockDataT.parentSlot = jsonData.blockData.parentSlot || '';
    blockDataT.previousBlockhash = jsonData.blockData.previousBlockhash || '';
    blockDataT.maliciousAddresses = jsonData.blockData.maliciousAddresses || [];
    blockDataT.sanctionedAddresses =
      jsonData.blockData.sanctionedAddresses || [];
    blockDataT.blacklistedAddresses =
      jsonData.blockData.blacklistedAddresses || [];
    blockT.blockData = blockDataT;
  }

  if (jsonData.transactions) {
    blockT.transactions = jsonData.transactions.map(convertJsonTransactionToT);
  }

  // Estimate buffer size more accurately to reduce allocations
  // Base size + estimated size per transaction
  const estimatedSize = Math.max(
    1024, // Minimum size
    Math.min(
      100 * 1024 * 1024, // Maximum 100MB
      1024 + (jsonData.transactions?.length || 0) * 2048 // 2KB per transaction estimate
    )
  );

  // Create FlatBuffer builder with estimated size
  const builder = new flatbuffers.Builder(estimatedSize);

  // Pack the object into FlatBuffer
  const blockOffset = blockT.pack(builder);

  // Finish the buffer
  builder.finish(blockOffset);

  // Return the buffer as Uint8Array
  return builder.asUint8Array();
}

export const convertSolanaBlockJsonToBuffer = createSolanaBlockFromJson;
