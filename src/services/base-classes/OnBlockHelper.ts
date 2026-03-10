import { ISubEvent } from '../../types/IEvent';
import { BaseHelper } from './BaseHelper';
import { BlockProcessor, IBlockProcessor } from '../../utils/processor';

export abstract class OnBlockHelper extends BlockProcessor {
  protected baseHelper: BaseHelper;
  iterationCache: Record<string, any> = {};

  constructor() {
    super();
    this.baseHelper = new BaseHelper();
  }

  protected async loadCache<T>(rule: any): Promise<T> {
    return this.baseHelper.loadCache(rule);
  }

  protected async saveCache(rule: any, cache: any) {
    return this.baseHelper.saveCache(rule, cache);
  }

  protected async fetchCached<T = any>(fun: () => T, key: string): Promise<T> {
    return this.baseHelper.fetchCached(fun, key);
  }

  abstract callback(processorParams: IBlockProcessor): Promise<ISubEvent[]>;
}
