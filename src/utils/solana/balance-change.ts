import { SOL_MINT } from './programs';

export interface ISolanaBalanceChange {
  amount: number;
  mint: string;
  sign: '' | '-';
}

export function getBalanceChangeMap(tx: any) {
  const { preBalances, postBalances, preTokenBalances, postTokenBalances } =
    tx.meta;
  const keys = tx.transaction.message.accountKeys.map((e: any) => e.pubkey);

  const solBalanceChange: Record<string, ISolanaBalanceChange> = {};

  for (let i = 0; i < preBalances.length; i++) {
    const preBalance = preBalances[i];
    const postBalance = postBalances[i];
    const account = keys[i];
    const diff = Math.abs(postBalance - preBalance);

    if (diff > 0) {
      solBalanceChange[account] = {
        amount: diff,
        mint: SOL_MINT,
        sign: postBalance > preBalance ? '' : '-',
      };
    }
  }

  // Map to track token owners
  const ownerByTokenAccount: Record<string, string> = {};

  // Track balance changes by authority (owner) instead of token account
  const tokenBalanceChange: Record<
    string,
    Record<string, ISolanaBalanceChange>
  > = {};

  // First, build a map of token accounts to their owners
  preTokenBalances.forEach((pre: any) => {
    const account = keys[pre.accountIndex];
    const owner = pre.owner;
    ownerByTokenAccount[account] = owner;
  });

  postTokenBalances.forEach((post: any) => {
    const account = keys[post.accountIndex];
    const owner = post.owner;
    ownerByTokenAccount[account] = owner;
  });

  const preTokenBalancesMap = Object.fromEntries(
    preTokenBalances.map((e: any) => {
      return [e.accountIndex, e];
    })
  );

  // Process all post token balances
  postTokenBalances.forEach((post: any) => {
    const pre = preTokenBalancesMap[post.accountIndex];
    const owner = post.owner;
    const mint = post.mint;

    // If the account doesn't exist in preTokenBalances, consider it as zero
    const preRawAmount = pre ? Number(pre.uiTokenAmount.amount) : 0;
    const postRawAmount = Number(post.uiTokenAmount.amount);
    const diff = pre ? postRawAmount - preRawAmount : postRawAmount;

    if (diff !== 0) {
      if (!tokenBalanceChange[owner]) tokenBalanceChange[owner] = {};

      // For newly created accounts in a receive operation, the sign should be positive
      const sign = pre
        ? post.uiTokenAmount.uiAmount > preRawAmount
          ? ''
          : '-'
        : '';

      tokenBalanceChange[owner][mint] = {
        amount: diff,
        mint,
        sign,
      };
    }
  });

  // Process pre token balances that don't appear in post (fully spent/closed accounts)
  preTokenBalances.forEach((pre: any) => {
    const post = postTokenBalances.find(
      (p: any) => p.accountIndex === pre.accountIndex
    );

    // Skip if we already processed this account
    if (post) return;

    const owner = pre.owner;
    const mint = pre.mint;
    const preRawAmount = 0;
    const postRawAmount = Number(pre.uiTokenAmount.amount);
    const rawDiff = postRawAmount - preRawAmount;
    const diff = Math.abs(rawDiff);

    if (diff !== 0) {
      if (!tokenBalanceChange[owner]) tokenBalanceChange[owner] = {};
      tokenBalanceChange[owner][mint] = {
        amount: diff,
        mint,
        sign: '-', // Always negative since the account was closed/emptied
      };
    }
  });

  return { solBalanceChange, tokenBalanceChange };
}
