import { FieldTypeToTSType, IRule } from '../types/IRule';

function getType(value: any) {
  if (typeof value === 'number') {
    return 'number';
  } else if (
    Array.isArray(value) &&
    value.every((item) => typeof item === 'number')
  ) {
    return 'number[]';
  } else if (typeof value === 'string') {
    return 'string';
  } else if (
    Array.isArray(value) &&
    value.every((item) => typeof item === 'string')
  ) {
    return 'string[]';
  } else if (typeof value === 'boolean') {
    return 'boolean';
  } else {
    return 'unknown'; // for cases that don't match
  }
}

/**
 * Validates and ensures rule parameters match their defined types from Alert Template documentation
 * @recommended "Strongly recommended for new rules"
 */
function ensureRuleParams<T>(params: any, cb: any): T {
  const result = {} as any;
  const rule = (cb as any).__rule as IRule;

  if (!rule) {
    throw new Error(`No rule annotation found for ${cb.constructor.name}`);
  }

  for (const definition of rule.parameters) {
    const value = params[definition.field];

    if (definition.optional && value === undefined) {
      continue;
    }
    if (value === undefined) {
      throw new Error(`Missing required field ${definition.field}`);
    }
    if (getType(value) !== FieldTypeToTSType[definition.fieldType]) {
      console.error(
        `invalid param field data for ${typeof value} ${value} for ${definition.field}!`
      );
      continue;
    }

    result[definition.field] = value;
  }
  return result;
}

import 'reflect-metadata';

export function ValidateParameters() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const rule = args[0]?.rule;
      if (!rule) {
        throw new Error('Rule is required');
      }

      // Assuming the first argument is the context object containing rule
      const params = ensureRuleParams(rule.parameters, this);

      // Add params to the context or modify args as needed
      args[0].params = params;

      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}
