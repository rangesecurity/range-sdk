import { SPL_TOKEN_PROGRAMS } from './programs';

export function extractSplActions(ixList: any[], ixType: string) {
  return ixList
    .filter((ix) => SPL_TOKEN_PROGRAMS.includes(ix.programId))
    .filter((e) => e.parsed?.info.type === ixType);
}
