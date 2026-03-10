# Range SDK

Build real-time security rules and anomaly detectors for any blockchain.

Range SDK is a TypeScript framework for writing alert rules that run against live blockchain data. Define rules with decorators, process blocks or time-based ticks, and emit events — the SDK handles multi-threaded execution, Redis streaming, and rule lifecycle management.

## Table of Contents

- [Highlights](#highlights)
- [Quick Start](#quick-start)
- [Rule Anatomy](#rule-anatomy)
- [Requirements](#requirements)
- [Supported Networks](#supported-networks)
- [How To Contribute](#how-to-contribute)
- [Reporting Bugs](#reporting-bugs)
- [License](#license)
- [Credits](#credits)

## Highlights

- **Decorator-based rules** — Define rules with `@Rule()`, typed parameters, and clean async callbacks. No boilerplate.
- **Two trigger modes** — `BlockProcessor` runs on every new block. `TickProcessor` runs on a time interval. Use whichever fits your use case.
- **Multi-chain** — One SDK for Solana, Ethereum, Arbitrum, BNB Chain, Polygon, Osmosis, Cosmos Hub, Noble, dYdX, ZigChain, and [more](https://app.range.org).

### Built-in Services

- **Real-Time Block Streaming** — Consume live blocks as they're produced. Your alert logic runs on every new block across any supported chain.
- **Multi-Chain RPC** — Connect to EVM, Cosmos, and Solana through a single unified interface. No need to manage RPC endpoints yourself.
- **Risk Scoring & Address Labels** — Look up wallet labels and get risk scores for any address. Know if a counterparty is sanctioned or suspicious before it's too late.
- **Solana Tx Simulation** — Simulate Solana transactions before they execute. See expected state changes and human-readable summaries.

## Quick Start

```bash
yarn add @range-security/range-sdk
```

See the [`example/`](./example) directory for a complete working project with two sample rules:
- **`large-transfer`** — alerts when a SOL transfer exceeds a threshold
- **`tx-surge`** — alerts when a block's transaction count spikes above the rolling average

## Rule Anatomy

Every rule is a class decorated with `@Rule()`:

| Field | Description |
|-------|-------------|
| `type` | Unique identifier for this rule type (kebab-case) |
| `label` | Human-readable name shown in the Range App |
| `description` | What the rule does |
| `networks` | Array of network IDs this rule runs on (e.g. `['osmosis-1', 'eth']`) |
| `parameters` | Configurable inputs for the rule |
| `tags` | Categories for filtering (`security`, `governance`, `dex`, `stablecoin`, etc.) |
| `severity` | Alert level: `info`, `low`, `medium`, `high`, `critical` |

The callback receives:

- **BlockProcessor**: `{ block, rule }` — the decoded block data and the rule instance with its parameters. Blocks are typed per chain: `IEVMBlock`, `ISolanaBlock`, `ICosmosBlock`.
- **TickProcessor**: `{ timestamp, rule }` — the current tick timestamp and the rule instance

Both return `ISubEvent[]` — an array of events to emit (or empty array for no alert).

### Event Shape

Each event in the returned array has these fields:

| Field | Required | Description |
|-------|----------|-------------|
| `caption` | Yes | Short summary of the alert |
| `details` | Yes | Object with a `message` string and optional extra fields |
| `txHash` | No | Transaction hash related to the alert |
| `addressesInvolved` | No | Array of addresses relevant to the alert |
| `severity` | No | Override the rule-level severity for this specific event |

## Requirements

- Node.js >= 18
- TypeScript >= 5.x

## Supported Networks

| Network | Network ID |
|---------|------------|
| Solana | `solana` |
| Ethereum | `eth` |
| Arbitrum | `arb1` |
| BNB Chain | `bnb` |
| Polygon | `pol` |
| Osmosis | `osmosis-1` |
| Cosmos Hub | `cosmoshub-4` |
| Noble | `noble-1` |
| dYdX | `dydx-mainnet-1` |
| Stride | `stride-1` |
| Celestia | `celestia` |
| Neutron | `neutron-1` |
| Dymension | `dymension_1100-1` |
| Agoric | `agoric-3` |
| Provenance | `pio-mainnet-1` |
| Mantra | `mantra-1` |

More networks are being added regularly. See all supported networks on the [Range App](https://app.range.org).

## How To Contribute

We welcome contributions from the community! To get started:

1. Fork the repository.
2. Clone your forked repository and install dependencies:

```bash
git clone https://github.com/your-username/range-sdk.git
cd range-sdk
yarn install
```

3. Make your changes, add tests, and ensure tests pass.
4. Commit your changes and push to your fork.
5. Create a pull request with a detailed explanation of your changes.

Before contributing, please read our [CONTRIBUTING.md](./CONTRIBUTING.md).

## Reporting Bugs

If you encounter any bugs or issues, please [open an issue on GitHub](https://github.com/rangesecurity/range-sdk/issues). When reporting a bug, please provide as much context as possible, including error messages, logs, and steps to reproduce the bug.

## Links

- [Range App](https://app.range.org)
- [Documentation](https://docs.range.org)
- [Get in Touch](https://range.org/get-in-touch)

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

## Credits

Thank you to all the contributors who have helped make Range SDK what it is today!
