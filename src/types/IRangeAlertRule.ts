export interface IRangeAlertRule {
  id: string;
  ruleType: string;
  workspaceId?: string | null;
  parameters: Record<string, unknown> | null;
  createdAt: Date;
  deletedAt?: Date | null;
}
