import { IRangeAlertRule } from './IRangeAlertRule';
import { IRangeEvent } from './IRangeEvent';

export interface IRangeMultiPhaseRule extends IRangeAlertRule {
  dependencyRegistry: IRangeAlertRule[];
  isTriggered: boolean;
  lifetime: number;
  aggregatedEvents: IRangeEvent[];
}
// Alert rule ID
// Fetch from api with events from the past 6hr
// Normal tick base rules but with a tick based api for other rules
// Multi rate limits:
  /*
  - fetch a single alert id and we can see how much its been hit in the past 
  - we can create this api
  - go into the DB and run a sql query
  - we are already indexing the events
  - 


  */
