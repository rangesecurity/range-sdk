import { FieldTypeToTSType, IRule } from '../types/IRule';
import * as fs from 'fs';

export function updateRuleParamsInterface(rule: IRule) {
  const name = getInterfaceName(rule.type);
  const fields = rule.parameters.map(getTypeDefinition);
  const content = `export interface ${name} {\n${fields.map((f) => `  ${f}\n`).join('')}}\n`;
  const path = `${__dirname}/../../src/types/rules/${name}.ts`;
  try {
    const old = fs.readFileSync(path, 'utf8');
    if (old !== content) {
      throw new Error('Different content');
    }
  } catch (_e) {
    fs.writeFileSync(path, content);
  }
}

function getInterfaceName(ruleType: string) {
  return `I${ruleType.charAt(0).toUpperCase()}${ruleType.slice(1).replace(/[^A-Za-z0-9]/g, '')}Params`;
}

function getTypeDefinition(param: IRule['parameters'][0]): string {
  return `${param.field}${param.optional ? '?' : ''}: ${FieldTypeToTSType[param.fieldType]};`;
}
