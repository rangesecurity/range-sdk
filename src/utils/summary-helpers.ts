/**
 * Shared helpers for formatting summary custom attributes and grouped titles.
 * Used by both V3 and V4 Squads trackers and the proposal service.
 */

const DUST_PATTERN = /^\d+ lamports\(\$~0\)/;

function isComputeBudget(summary: string): boolean {
  return summary === 'Set Compute Budget';
}

function isDust(summary: string): boolean {
  return DUST_PATTERN.test(summary);
}

function isNoisySummary(summary: string): boolean {
  return isComputeBudget(summary) || isDust(summary);
}

/**
 * Extract an action-type label from a summary string.
 */
function getActionType(summary: string): string {
  if (/^Transfer /i.test(summary) || / sent /i.test(summary)) {
    return 'Transfer';
  }
  if (
    /^Update reserve config/i.test(summary) ||
    /^Reserve config update/i.test(summary) ||
    /^Tighten /i.test(summary) ||
    /^Raise /i.test(summary) ||
    /^Update (price feed|scope chain|TWAP|token name|max liquidation|liquidation (fee|threshold)|protocol (take rate|liquidation))/i.test(
      summary
    ) ||
    /^Update protocol /i.test(summary) ||
    /^Update custody config/i.test(summary)
  ) {
    return 'Config Update';
  }
  if (/^Created a new reserve/i.test(summary)) return 'Init Reserve';
  if (/^Close token account/i.test(summary)) return 'Close Account';
  if (/^Program .+ upgraded/i.test(summary)) return 'Upgrade';
  if (/^Create new token account/i.test(summary)) return 'Token Account';
  if (/^(Remove|Add) member/i.test(summary) || /^(Remove|Add) /i.test(summary))
    return 'Member Change';
  if (/^Change threshold/i.test(summary)) return 'Threshold';
  if (/^Allocate /i.test(summary)) return 'Allocate';
  return 'Action';
}

interface SummaryEntry {
  summary: string;
  [key: string]: any;
}

export interface CustomAttribute {
  label: string;
  value: string;
  url?: string;
  isHash?: boolean;
}

/**
 * Build custom attributes from a summary list.
 * Filters noise (ComputeBudget, dust), collapses identical summaries,
 * and uses action-type labels instead of "Ix N".
 */
export function buildSummaryCustomAttributes(
  summaryList: SummaryEntry[],
  inspectorUrl?: string,
  isBatch = false
): CustomAttribute[] {
  // Filter out noise
  const filtered = summaryList.filter((e) => !isNoisySummary(e.summary));

  if (filtered.length === 0 && inspectorUrl) {
    return [{ label: 'Inspector', value: 'URL', url: inspectorUrl }];
  }

  // Group consecutive identical summaries
  const groups: { summary: string; count: number; actionType: string }[] = [];
  for (const entry of filtered) {
    const last = groups[groups.length - 1];
    if (last && last.summary === entry.summary) {
      last.count++;
    } else {
      groups.push({
        summary: entry.summary,
        count: 1,
        actionType: getActionType(entry.summary),
      });
    }
  }

  const attrList: CustomAttribute[] = [];

  if (isBatch) {
    // For batch transactions, use "Tx N" labels on the filtered list
    let txIndex = 1;
    for (const entry of filtered) {
      attrList.push({
        label: `Tx ${txIndex}`,
        value: entry.summary,
      });
      txIndex++;
    }
  } else {
    // Use action-type labels with collapse
    const typeCounters: Record<string, number> = {};
    // Count how many groups per action type to decide if we need numbering
    const typeTotals: Record<string, number> = {};
    for (const g of groups) {
      typeTotals[g.actionType] = (typeTotals[g.actionType] || 0) + 1;
    }

    for (const group of groups) {
      typeCounters[group.actionType] =
        (typeCounters[group.actionType] || 0) + 1;
      const needsNumber = typeTotals[group.actionType] > 1;
      const label = needsNumber
        ? `${group.actionType} ${typeCounters[group.actionType]}`
        : group.actionType;

      if (group.count > 1) {
        attrList.push({
          label,
          value: `${group.count} ${group.actionType.toLowerCase()}s`,
        });
      } else {
        attrList.push({
          label,
          value: group.summary,
        });
      }
    }
  }

  if (inspectorUrl) {
    attrList.push({
      label: 'Inspector',
      value: 'URL',
      url: inspectorUrl,
    });
  }

  return attrList;
}

/**
 * Build a grouped title string from a summary list.
 * Filters noise, groups by action type, and produces a concise title.
 */
export function buildGroupedTitle(summaryList: SummaryEntry[]): string {
  const filtered = summaryList.filter((e) => !isNoisySummary(e.summary));

  if (filtered.length === 0) {
    // Fall back to original join if filtering removed everything
    return summaryList.map((e) => e.summary).join(', ');
  }

  // Group by action type
  const typeGroups: Record<string, { summaries: string[]; type: string }> = {};
  const typeOrder: string[] = [];
  for (const entry of filtered) {
    const type = getActionType(entry.summary);
    if (!typeGroups[type]) {
      typeGroups[type] = { summaries: [], type };
      typeOrder.push(type);
    }
    typeGroups[type].summaries.push(entry.summary);
  }

  // If single group with single entry, use summary directly
  if (typeOrder.length === 1) {
    const group = typeGroups[typeOrder[0]];
    if (group.summaries.length === 1) {
      return group.summaries[0];
    }
    return `${group.summaries.length} ${group.type.toLowerCase()}s`;
  }

  // Multiple groups: join with counts
  return typeOrder
    .map((type) => {
      const group = typeGroups[type];
      if (group.summaries.length === 1) {
        return `1 ${type.toLowerCase()}`;
      }
      return `${group.summaries.length} ${type.toLowerCase()}s`;
    })
    .join(', ');
}
