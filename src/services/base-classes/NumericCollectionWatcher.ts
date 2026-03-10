import { ISubEvent } from '../../types/IEvent';
import { ITickProcessor } from '../../utils/processor';
import { skipTick } from '../../utils/skip-tick';
import { OnTickHelper } from './OnTickHelper';
import { validGreaterThan } from '../../utils/validParam';

interface INumericCollectionWatcherCache {
  previousValues: Record<string, number | null>;
}

export interface INumericCollectionWatcherParams {
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

export abstract class NumericCollectionWatcher extends OnTickHelper {
  abstract fetchNumericValues({
    rule,
    timestamp,
  }: ITickProcessor<INumericCollectionWatcherParams>): Promise<
    Record<string, number>
  >;

  abstract getPositiveEvent({
    rule,
    timestamp,
    key,
    changes,
  }: {
    rule: any;
    timestamp: string;
    key: string;
    changes: any;
  }): ISubEvent;

  async callback({
    rule,
    timestamp,
  }: ITickProcessor<INumericCollectionWatcherParams>): Promise<ISubEvent[]> {
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

    const cache = await this.loadCache<INumericCollectionWatcherCache>(rule);
    const currentValues = await this.fetchNumericValues({ rule, timestamp });

    const events: ISubEvent[] = [];

    // Initialize cache if empty
    if (!cache.previousValues) {
      cache.previousValues = {};
    }

    // Check each key in the map
    for (const [key, currentValue] of Object.entries(currentValues)) {
      const previousValue = cache.previousValues[key] ?? currentValue;
      const delta = Math.abs(currentValue - previousValue);
      const direction = currentValue > previousValue ? 'positive' : 'negative';
      const percChange =
        previousValue !== 0 ? (delta / previousValue) * 100 : 0;

      const shouldNotify =
        validGreaterThan(delta, params.numericChange) &&
        validGreaterThan(percChange, params.percChange) &&
        validDirection(direction, params.notifyDirection);

      this.iterationCache = {
        key,
        previousValue: cache.previousValues[key],
        currentValue,
        delta,
        percChange,
        direction,
      };

      if (shouldNotify) {
        cache.previousValues[key] = currentValue;
        events.push(
          this.getPositiveEvent({
            rule,
            timestamp,
            key,
            changes: this.iterationCache,
          })
        );
      } else {
        cache.previousValues[key] = currentValue;
      }
    }

    await this.saveCache(rule, cache);
    this.iterationCache = {};
    return events;
  }
}
