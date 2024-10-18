import { IRangeNetwork } from './IRangeNetwork';

export interface IRangeAlertRule {
  id: string;
  ruleType: string;
  workspaceId?: string | null;
  ruleGroupId: string;
  network: IRangeNetwork;
  parameters: object | null;
  createdAt: Date;
  deletedAt?: Date | null;
}
