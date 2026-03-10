import { ISubEvent } from '../../types/IEvent';
import { ITickProcessor } from '../../utils/processor';
import { skipTick } from '../../utils/skip-tick';
import { OnTickHelper } from './OnTickHelper';
import { validGreaterThan } from '../../utils/validParam';

interface INumericStateWatcherCache {
  previousValue: number | null;
}

export interface INumericStateWatcherParams {
  ticker: number;
  numericChange?: number;
  percChange?: number;
  notifyDirection?: 'positive' | 'negative';
}

function validDirection(
  direction: string,
  notifyDirection: string | undefined
) {
  if (!notifyDirection) return true;
  return direction === notifyDirection;
}

export abstract class NumericStateWatcher extends OnTickHelper {
  abstract fetchNumericValue({
    rule,
    timestamp,
  }: ITickProcessor<INumericStateWatcherParams>): Promise<number>;

  abstract getPositiveEvent({
    rule,
    timestamp,
  }: ITickProcessor<INumericStateWatcherParams>): ISubEvent;

  async callback({
    rule,
    timestamp,
  }: ITickProcessor<INumericStateWatcherParams>): Promise<ISubEvent[]> {
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

    const cache = await this.loadCache<INumericStateWatcherCache>(rule);
    const currentValue = await this.fetchNumericValue({ rule, timestamp });

    const events: ISubEvent[] = [];
    const previousValue = cache.previousValue ?? currentValue;
    const delta = Math.abs(currentValue - previousValue);
    const direction = currentValue > previousValue ? 'positive' : 'negative';
    const percChange = previousValue !== 0 ? (delta / previousValue) * 100 : 0;

    const shouldNotify =
      validGreaterThan(delta, params.numericChange) &&
      validGreaterThan(percChange, params.percChange) &&
      validDirection(direction, params.notifyDirection);

    this.iterationCache = {
      previousValue: cache.previousValue,
      currentValue,
      delta,
      percChange,
      direction,
    };

    if (shouldNotify) {
      cache.previousValue = currentValue;
      await this.saveCache(rule, cache);

      events.push(this.getPositiveEvent({ rule, timestamp }));
    } else {
      cache.previousValue = currentValue;
      await this.saveCache(rule, cache);
    }

    this.iterationCache = {};
    return events;
  }
}
