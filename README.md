# Range SDK

Range SDK is a powerful Typescript library that simplifies the development of security rules and anomaly detectors for Cosmos blockchains. With the Range SDK, developers can easily extend the security of their protocols, monitoring in real-time the validity of invariants, risk scenarios, phishing attacks, spam, and much more.

## Table of Contents

- [Range SDK](#range-sdk)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Features](#features)
  - [Documentation](#documentation)
  - [How To Contribute](#how-to-contribute)
  - [Reporting bugs](#reporting-bugs)
  - [License](#license)
  - [Credits](#credits)

## Installation

```bash
yarn add @rangesecurity/range-sdk
```

## Usage

Here's a basic example to get you started:

```typescript
// Range Implementation of `new-contract-code-stored` alert rule
import { RangeSDK } from '@rangesecurity/range-sdk';

// Define your OnBlock handler
const myOnBlock: OnBlock = {
  callback: async (
    block: IRangeBlock,
    rule: IRangeAlertRule,
  ): Promise<ISubEvent[]> => {
    const allMessages = block.transactions.flatMap((tx) => tx.messages);
    const targetMessages = allMessages.filter((m) => {
      return m.type === 'cosmwasm.wasm.v1.MsgStoreCode';
    });

    const results = targetMessages.map((m) => ({
      details: {
        message: `New CW contract code stored by ${m.value.sender}`,
      },
      txHash: m.hash,
      addressesInvolved: m.addresses,
    }));

    return results;
  },
};

// Defining the RangeSDK instance
const range = new RangeSDK({
  token: env.RANGE_TOKEN,
  onBlock: myOnBlock,
});

// Running the RangeSDK instance
range.init();
```

For more examples and use-cases, see the open-source rule repositories of several Cosmos chains:

- [Osmosis Range Rules](https://github.com/rangesecurity/osmosis-range-rules)
- [Cosmos Hub Range Rules](https://github.com/rangesecurity/cosmos-range-rules)

## Features

- Simple and intuitive API
- Advanced security rule building in Typescript
- Easy integration testing with real block data
- Powerful anomaly detection examples
- Integration with most Cosmos chains
- Extensive documentation

## Documentation

Complete documentation can be found at our official documentation site.

## How To Contribute

We welcome contributions from the community! To get started:

1. Fork the repository.
2. Clone your forked repository and install dependencies:

```bash
git clone https://github.com/your-username/range-sdk.git
cd range-sdk
npm install
```

3. Make your changes, add tests, and ensure tests pass.
4. Commit your changes and push to your fork.
5. Create a pull request with a detailed explanation of your changes.

Before contributing, please read our [CONTRIBUTING.md](link).

## Reporting bugs

If you encounter any bugs or issues, please [open an issue on GitHub](link). When reporting a bug, please provide as much context as possible, including error messages, logs, and steps to reproduce the bug.

## License

This project is licensed under the MIT License. See the [LICENSE](link) file for details.

## Credits

Thank you to all the contributors who have helped make Range SDK what it is today!
