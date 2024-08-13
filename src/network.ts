import { ZodLiteral, z } from 'zod';

export enum NetworkEnum {
  CosmosHub4 = 'cosmoshub-4',
  Grand1 = 'grand-1',
  Mocha4 = 'mocha-4',
  Neutron1 = 'neutron-1',
  Noble1 = 'noble-1',
  Osmosis1 = 'osmosis-1',
  OsmoTest5 = 'osmo-test-5',
  Stride1 = 'stride-1',
  Celestia = 'celestia',
  DydxMainnet1 = 'dydx-mainnet-1',
  Dymension = 'dymension_1100-1',
  Solana = 'solana',
}

export const NetworkValidator = z.union(
  Object.values(NetworkEnum).map((networkId) => z.literal(networkId)) as [
    ZodLiteral<'cosmoshub-4'>,
    ZodLiteral<'grand-1'>,
    ZodLiteral<'mocha-4'>,
    ZodLiteral<'neutron-1'>,
    ZodLiteral<'noble-1'>,
    ZodLiteral<'osmosis-1'>,
    ZodLiteral<'osmo-test-5'>,
    ZodLiteral<'stride-1'>,
    ZodLiteral<'celestia'>,
    ZodLiteral<'dydx-mainnet-1'>,
    ZodLiteral<'dymension_1100-1'>,
    ZodLiteral<'solana'>,
  ],
);

export type Network = z.infer<typeof NetworkValidator>;

export const networkArray = Object.values(NetworkEnum) as Network[];

export const validateNetwork = (network: Network) => {
  if (!networkArray.includes(network)) {
    throw new Error(
      `The network ${network} is not supported. Supporter networks are: ${Object.values(
        NetworkEnum,
      ).join(', ')}`,
    );
  }
};
