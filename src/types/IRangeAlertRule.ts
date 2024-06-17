export interface IRangeAlertRule {
  id: string;
  ruleType: string;
  workspaceId?: string | null;
  ruleGroupId: string;
  network: string;
  parameters: Record<string, unknown> | null;
  createdAt: Date;
  deletedAt?: Date | null;
}
