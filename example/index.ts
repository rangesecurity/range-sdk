import { range } from '../sdk'
import { IRangeNetwork } from '../sdk/types/INetwork'
import { IRangeBlock } from '../sdk/types/IRangeBlock'
import { IRangeEvent } from '../sdk/types/IRangeEvent'

async function main () {
  await range.init({
    onBlock: { callback: onBlock, filter: { networks: ['osmosis-1', 'cosmoshub-4'] } },
    // onMessage: {}
    // onTransaction: {}
  })
}

async function onBlock (block: IRangeBlock, network: IRangeNetwork): Promise<IRangeEvent[]> {
  console.log(block, network)
  return []
}

/*async function onTransaction () {

}

async function onMessage () {

}*/

void main()
