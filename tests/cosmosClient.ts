import { CosmosClient } from '../src/cosmos/CosmosClient';

async function main() {
  const rpcEndpoint = '';
  const client = new CosmosClient(rpcEndpoint);

  console.assert(
    await client.balance(
      'osmo1ql5dgyyeqnvljg0l8xl986j5zxwjaskg24nztq',
      'uosmo',
    ),
  );

  console.assert(
    await client.validator(
      'osmovaloper1clpqr4nrk4khgkxj78fcwwh6dl3uw4ep88n0y4',
    ),
  );

  console.assert(await client.supply('uosmo'));

  console.assert(
    await client.contractInfo(
      'osmo1mypljhatv0prfr9cjzzvamxdf2ctg34xkt50sudxads9zhqnyneqjuvy26',
    ),
  );

  console.assert(
    await client.fetchContractQuery(
      'osmo1lqyn9ncwkcqj8e0pnugu72tyyfehe2tre98c5qfzjg4d3vdw7n5q5a0x37',
      {
        list_proposals: {},
      },
    ),
  );
  console.assert(await client.fetchLatestHeight());

  console.assert(await client.getValidators());
}
main();
