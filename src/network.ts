import { ZodLiteral, z } from 'zod';

export const networkIds = {
  osmosis_1: 'osmosis-1',
  osmo_test_5: 'osmo-test-5',
  cosmoshub_4: 'cosmoshub-4',
  mocha_3: 'mocha-3',
} as const;

export const NetworkValidator = z.union(
  Object.values(networkIds).map((networkId) => z.literal(networkId)) as [
    ZodLiteral<'osmosis-1'>,
    ZodLiteral<'osmo-test-5'>,
    ZodLiteral<'cosmoshub-4'>,
    ZodLiteral<'mocha-3'>,
  ],
);

export type Network = z.infer<typeof NetworkValidator>;

export const networkArray = Object.values(networkIds) as Network[];

export const validateNetwork = (network: Network) => {
  if (!networkArray.includes(network)) {
    throw new Error(
      `The network ${network} is not supported. Supporter networks are: ${Object.values(
        networkIds,
      ).join(', ')}`,
    );
  }
};
