import { writeFileSync } from 'fs';
import { IRangeBlock } from '../types/chain/IRangeBlock';
import { IRangeAlertRule } from '../types/IRangeAlertRule';
import { ISubEvent } from '../types/IRangeEvent';

// // Custom replacer to convert functions to strings
// const customReplacer = (key: string, value: unknown) => {
//   if (typeof value === 'function') {
//     return value.toString(); // Serialize functions as strings
//   }
//   return value;
// };

export async function initOnBlockWorkerMethods(processors: {
  [k: string]: (
    block: IRangeBlock,
    rule: IRangeAlertRule,
  ) => Promise<ISubEvent[]>;
}) {
  const filepath = `${__dirname}/onBlockWorker.js`;

  let worker = `const workerpool = require('workerpool');
const { deserialize } = require('v8');`;

  for (const key of Object.keys(processors)) {
    worker += `\n
async function ${key}Threaded(blockBuffer, rule) {
    const uint8Array = new Uint8Array(blockBuffer);
    const block = deserialize(uint8Array);

    const ${key} = ${processors[key].toString()}
    return ${key}(block, rule);
}
    `;
  }

  worker += `\n
workerpool.worker({
  ${Object.keys(processors)
    .map((x) => `${x}Threaded`)
    .join(',\n')}
});`;

  writeFileSync(filepath, worker);
}
