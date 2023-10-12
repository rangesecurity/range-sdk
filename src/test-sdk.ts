import { IRangeSDK, RangeSDKInitOptions, RangeSDKOptions } from './sdk';
import { getLogger } from './logger';
import { constants } from './constants';
import { fetchBlock } from './services/fetchBlock';
import { IRangeAlertRule } from './types/IRangeAlertRule';
import { IRangeBlock } from './types/chain/IRangeBlock';

const logger = getLogger({ name: 'testRangeSDK' });

class TestRangeSDK implements IRangeSDK {
  private opts: RangeSDKOptions;
  public runnerId?: string;
  private initOpts?: RangeSDKInitOptions;

  constructor(opts: RangeSDKOptions) {
    this.opts = opts;
    const [runnerId] = this.opts.token.split('.');
    this.runnerId = runnerId;

    logger.info(
      `Initiating rangeSDK in TEST MODE for runnerID: ${runnerId}, manager: ${constants.MANAGER_SERVICE.DOMAIN}`,
    );
  }

  async init(initOpts: RangeSDKInitOptions): Promise<void> {
    /**
     * Fetch config from the manager and setup task queues
     */
    this.initOpts = initOpts;
  }

  async getNetworkBlock(args: { network: string; height: string }) {
    return fetchBlock({
      token: this.opts.token,
      height: args.height,
      network: args.network,
    });
  }

  async assertRule(
    blockInfo: { network: string; height: string },
    rule: IRangeAlertRule,
  ) {
    if (!this.initOpts) {
      throw new Error(
        'TestRangeSDK not Init, please provide with the onBlock Method to run block and rule against',
      );
    }

    const block = await this.getNetworkBlock(blockInfo);
    if (!block) {
      throw new Error(
        `Block not available for network: ${blockInfo.network} and height: ${blockInfo.height}`,
      );
    }

    return this.initOpts.onBlock.callback(block, rule);
  }

  async assertRuleWithBlock(block: IRangeBlock, rule: IRangeAlertRule) {
    if (!this.initOpts) {
      throw new Error(
        'TestRangeSDK not Init, please provide with the onBlock Method to run block and rule against',
      );
    }

    return this.initOpts.onBlock.callback(block, rule);
  }

  async gracefulCleanup(): Promise<void> {
    // no-op
  }
}

export { TestRangeSDK };
