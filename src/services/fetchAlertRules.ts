import { IRangeAlertRule } from "../types/IRangeAlertRule"
import { knex } from "./knex"

export async function fetchAlertRules(ruleGroupId: string): Promise<IRangeAlertRule[]> {
    return knex('AlertRule')
        .select()
        .where({ ruleGroupId })
}

