export interface IRangeAlertRule {
  id: string;
  ruleType: string;
  workspaceId?: string | null;
  ruleGroupId: string;
  network: string;
  parameters: object | null;
  createdAt: Date;
  deletedAt?: Date | null;
}
