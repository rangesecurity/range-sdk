import { ISubEvent } from '../../types/IEvent';
import { ITickProcessor } from '../../utils/processor';
import { dayjs } from '../../utils/dayjs';
import { skipTick } from '../../utils/skip-tick';
import { OnTickHelper } from './OnTickHelper';

interface IBooleanStateWatcherCache {
  lastNotified: string | null;
  previousState: boolean;
}

const DEFAULT_NOTIFY_INTERVAL = 6 * 60; // in minutes

export interface IBooleanStateWatcherParams {
  ticker: number;
  notifyInterval?: number; // in minutes
}

/**
 * Base class for boolean alert state watchers for grafana style alerts
 */
export abstract class BooleanStateWatcher extends OnTickHelper {
  abstract getAlertState({
    rule,
    timestamp,
  }: ITickProcessor<IBooleanStateWatcherParams>): Promise<boolean>;

  abstract getPositiveEvent({
    rule,
    timestamp,
  }: ITickProcessor<IBooleanStateWatcherParams>): ISubEvent;

  abstract getNegativeEvent({
    rule,
    timestamp,
  }: ITickProcessor<IBooleanStateWatcherParams>): ISubEvent;

  async callback({
    rule,
    timestamp,
  }: ITickProcessor<IBooleanStateWatcherParams>): Promise<ISubEvent[]> {
    const params = rule.parameters;

    if (
      skipTick({
        ticker: params.ticker,
        timestamp,
        salt: rule.id,
      })
    ) {
      return [];
    }

    const cache = await this.loadCache<IBooleanStateWatcherCache>(rule);
    const alertState = await this.getAlertState({ rule, timestamp });

    const events: ISubEvent[] = [];

    if (alertState) {
      if (
        !cache.lastNotified ||
        dayjs(timestamp).diff(dayjs(cache.lastNotified), 'minutes') >=
          (params.notifyInterval || DEFAULT_NOTIFY_INTERVAL)
      ) {
        cache.lastNotified = timestamp;
        cache.previousState = true;
        await this.saveCache(rule, cache);
        events.push(this.getPositiveEvent({ rule, timestamp }));
      }
    } else if (cache.previousState) {
      cache.lastNotified = null;
      cache.previousState = false;
      await this.saveCache(rule, cache);
      events.push(this.getNegativeEvent({ rule, timestamp }));
    }

    this.iterationCache = {};
    return events;
  }
}
