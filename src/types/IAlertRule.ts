import { INetwork } from './INetwork';

export interface IAlertRule<Parameters = any> {
  id: string;
  ruleType: string;
  workspaceId?: string | null;
  network: INetwork;
  parameters: Parameters;
  createdAt: string;
  deletedAt?: Date | null;
  severity?: string;
  triggerMode: 'BLOCK' | 'TICK';
}
