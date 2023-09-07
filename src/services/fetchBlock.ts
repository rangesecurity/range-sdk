import { IRangeBlock } from "../types/chain/IRangeBlock"
import NodeCache from "node-cache";
import { knex } from "./knex";

const blockCache = new NodeCache({
    stdTTL: 3600,
});

export async function fetchBlock(height: string, network: string): Promise<IRangeBlock | null> {
    const cachedBlock = blockCache.get(`${network}-${height}`)
    if (cachedBlock) {
        return cachedBlock as IRangeBlock
    }

    const [block] = await knex('Block').select().where({
        height,
        network,
    })

    if (!block) {
        return null;
    }

    blockCache.set(`${network}-${height}`, block.block)

    // make api request with auth
    return block.block
}
