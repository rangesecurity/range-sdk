export interface SolanaTrxMeta {
  err?: {
    InstructionError: (
      | {
          Custom: number;
        }
      | number
      | string
    )[][];
  } | null;
  fee: number;
  status: {
    Ok?: null;
    Err?: {
      InstructionError: (
        | {
            Custom: number;
          }
        | number
        | string
      )[][];
    };
  };
  rewards?: unknown | null;
  returnData?: {
    data: string[];
    programId: string;
  };
  logMessages: string[];
  preBalances: number[];
  postBalances: number[];
  preTokenBalances: {
    mint: string;
    owner: string;
    programId: string;
    accountIndex: number;
    uiTokenAmount: {
      amount: string;
      decimals: number;
      uiAmount?: number;
      uiAmountString: string;
    };
  }[];
  innerInstructions: {
    index: number;
    instructions:
      | {
          parsed: {
            info: {
              amount: string;
              source: string;
              authority?: string;
              destination?: string;
              owner?: string;
              delegate?: string;
            };
            type: string;
          };
          program: string;
          programId: string;
          stackHeight: number;
        }
      | {
          data: string;
          accounts: string[];
          programId: string;
          stackHeight: number;
        }[];
  }[];
  postTokenBalances: {
    mint: string;
    owner: string;
    programId: string;
    accountIndex: number;
    uiTokenAmount: {
      amount: string;
      decimals: number;
      uiAmount?: any;
      uiAmountString: string;
    };
  }[];
  computeUnitsConsumed: number;
}

export interface SolanaTrxTrx {
  message: {
    accountKeys: {
      pubkey: string;
      signer: boolean;
      source: string;
      writable: boolean;
    }[];
    instructions: (
      | {
          programId: string;
        }
      | {
          programId: string;
          accounts: string[];
          data: string;
        }
      | {
          programId: string;
          stackHeight: any;
          parsed:
            | {
                info: {
                  source: string;
                  lamports: number;
                  destination: string;
                };
                type: string;
              }
            | string;
          program: string;
        }
    )[];
  };
  signatures: string[];
}

export interface SolanaTrx {
  meta: SolanaTrxMeta;
  transaction: SolanaTrxTrx;
}
