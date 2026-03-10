export const SOL_MINT = `So11111111111111111111111111111111111111112`;

// SPL Token Program IDs
export const SPL_TOKEN_PROGRAM_ID =
  'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA';
export const SPL_TOKEN_2022_PROGRAM_ID =
  'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb';
export const SPL_TOKEN_PROGRAMS = [
  SPL_TOKEN_PROGRAM_ID,
  SPL_TOKEN_2022_PROGRAM_ID,
];

export const BPF_LOADER_PROGRAM_ID =
  'BPFLoaderUpgradeab1e11111111111111111111111';

export const JITO_TIP_ACCOUNTS = [
  '96gYZGLnJYVFmbjzopPSU6QiEV5fGqZNyN9nmNhvrZU5',
  'HFqU5x63VTqvQss8hp11i4wVV8bD44PvwucfZ2bU7gRe',
  'Cw8CFyM9FkoMi7K7Crf6HNQqf4uEMzpKw6QNghXLvLkY',
  'ADaUMid9yfUytqMBgopwjb2DTLSokTSzL1zt6iGPaS49',
  'DfXygSm4jCyNCybVYYK6DwvWqjKee8pbDmJGcLWNDXjh',
  'ADuUkR4vqLUMWXxW9gh6D6L8pMSawimctcNZ5pGwDcEt',
  'DttWaMuVvTiduZRnguLF7jNxTgiMBZ1hyAumKUiL2KRL',
  '3AVi9Tg9Uo68tJfuvoKvqKNWKkC5wPdSSdeBnizKZ6jT',
];

export const SQUADS_V3_META = 'SMPL5bz5ERMdweouWrXtk3jmb6FnjZkWf7pHDsE6Zwz';
export const SQUADS_V3 = 'SMPLecH534NA9acpos4G6x7uf3LWbCAwZQE9e8ZekMu';

export const SQUADS_V4 = 'SQDS4ep65T869zMMBKyuUq6aD6EgTu8psMjkvj52pCf';

// Helper to check if a string is potentially a Solana address (base58, 32-44 chars)
function isSolanaAddress(str: any): boolean {
  const base58Regex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
  return typeof str === 'string' && base58Regex.test(str);
}

export function getAddresses(info: any): string[] {
  if (typeof info === 'string') {
    return isSolanaAddress(info) ? [info] : [];
  }
  if (Array.isArray(info)) {
    return info.flatMap(getAddresses);
  }
  if (info !== null && typeof info === 'object') {
    return Object.values(info).flatMap(getAddresses);
  }
  return [];
}
