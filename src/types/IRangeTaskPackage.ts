export interface BlockRuleGroupTaskPackage {
  block: {
    network: string;
    height: string;
  };
  ruleGroupId: string;
  runnerId: string;
}

export interface ErrorBlockRuleTaskPackage {
  network: string;
  blockNumber: string;
  ruleGroupId: string;
  ruleId: string;
  errorId: string;
  error: string;
  retryCount: number;
}

export interface TickRuleGroupTaskPackage {
  timestamp: string;
  ruleGroupId: string;
  runnerId: string;
}
