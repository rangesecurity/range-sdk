export type StringParam = string | string[] | undefined;

export function validParam(input: any, ruleParam: StringParam): boolean {
  if (!ruleParam) return true;

  if (Array.isArray(ruleParam) && !Array.isArray(input)) {
    if (ruleParam.length === 0) return true;
    return ruleParam.includes(input);
  }

  if (Array.isArray(ruleParam) && Array.isArray(input)) {
    if (ruleParam.length === 0) return true;
    return ruleParam.some((param) => input.includes(param));
  }

  if (!Array.isArray(ruleParam) && Array.isArray(input)) {
    return input.includes(ruleParam);
  }

  return input === ruleParam;
}

export function invalidParam(a: any, b: any) {
  return !validParam(a, b);
}

export type NumberParam = number | undefined;

export function validGreaterThan(input: any, threshold: any) {
  if (!threshold) return true;

  return Number(input) > Number(threshold);
}

export function invalidGreaterThan(input: any, threshold: any) {
  return !validGreaterThan(input, threshold);
}

export function validSubString(input: any, param: any) {
  if (!param) return true;

  return input.includes(param);
}

export function isSmallerThan(input: any, threshold: any) {
  if (!threshold) return true;

  return Number(input) < Number(threshold);
}

export function isNotSmallerThan(input: any, threshold: any) {
  return !isSmallerThan(input, threshold);
}

export const isGreaterThan = validGreaterThan;
export const isNotGreaterThan = invalidGreaterThan;
