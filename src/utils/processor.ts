import 'reflect-metadata';
import { ISubEvent } from '../types/IEvent';
import { IRule } from '../types/IRule';
import { IAlertRule } from '../types/IAlertRule';
import { initAssetService } from '../services/AssetManager';

export abstract class BlockProcessor {
  readonly taskType = 'BLOCK' as const;
  abstract callback(processorParams: IBlockProcessor): Promise<ISubEvent[]>;
}

export abstract class TickProcessor {
  readonly taskType = 'TICK' as const;
  abstract callback(processorParams: ITickProcessor): Promise<ISubEvent[]>;
}

export function Processor(rule: IRule) {
  return function (processorClass: new () => BlockProcessor | TickProcessor) {
    ProcessorRegistry.register(rule, processorClass);
  };
}

export interface IBlockProcessor<T = any, B = any> {
  block: B;
  rule: IAlertRule<T>;
}
export interface ITickProcessor<T = any> {
  timestamp: string;
  rule: IAlertRule<T>;
}

export const Rule = <T>(rule: IRule<keyof T>) => {
  return function (processorClass: new () => BlockProcessor | TickProcessor) {
    Reflect.defineMetadata('rule', rule, processorClass);

    const original = processorClass.prototype.callback;
    processorClass.prototype.callback = async function (...args: any[]) {
      await initAssetService();
      return original.apply(this, args);
    };

    ProcessorRegistry.register(rule, processorClass);
  };
};

export interface ProcessorInfo {
  rule: IRule;
  instance: BlockProcessor | TickProcessor;
}

export class ProcessorRegistry {
  private static processorMap = new Map<string, ProcessorInfo>();

  static register(
    rule: IRule,
    processorClass: new () => BlockProcessor | TickProcessor
  ) {
    if (!rule.type?.trim()) {
      throw new Error(
        'ProcessorRegistry: rule.type must be a non-empty string.'
      );
    }

    if (!rule.networks?.length) {
      throw new Error(
        `ProcessorRegistry: rule "${rule.type}" must specify at least one network.`
      );
    }

    if (this.processorMap.has(rule.type)) {
      throw new Error(
        `ProcessorRegistry: duplicate rule type "${rule.type}". Each rule type must be unique.`
      );
    }

    const instance = new processorClass();

    if (
      typeof (instance as any).callback !== 'function' ||
      !('taskType' in instance)
    ) {
      throw new Error(
        `ProcessorRegistry: ${processorClass.name} must extend BlockProcessor or TickProcessor.`
      );
    }

    if (rule.parameters?.length) {
      const fields = rule.parameters.map((p) => p.field);
      const duplicateFields = fields.filter((f, i) => fields.indexOf(f) !== i);
      if (duplicateFields.length > 0) {
        console.warn(
          `ProcessorRegistry: rule "${rule.type}" has duplicate parameter fields: ${[...new Set(duplicateFields)].join(', ')}`
        );
      }
    }

    this.processorMap.set(rule.type, { rule, instance });
  }

  static get(ruleType: string): ProcessorInfo | undefined {
    return this.processorMap.get(ruleType);
  }

  static getAlertTemplates(network?: string): Map<string, IRule> {
    const templates = new Map<string, IRule>();
    this.processorMap.forEach((info, ruleType) => {
      if (network && !info.rule.networks.includes(network)) return;
      const rule = {
        ...info.rule,
        severity: info.rule.severity || 'info',
        trigger: info.instance.taskType,
      };
      if (network) rule.networks = [network];
      templates.set(ruleType, rule);
    });
    return templates;
  }
}
