# Range SDK

Range SDK is a powerful Typescript library that simplifies the development of security rules and anomaly detectors for Cosmos blockchains. With the Range SDK, developers can easily extend the security of their protocols, monitoring in real-time the validity of invariants, risk scenarios, phishing attacks, spam, and much more.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Documentation](#documentation)
- [How to Contribute](#how-to-contribute)
- [Reporting Bugs](#reporting-bugs)
- [License](#license)
- [Credits](#credits)

## Installation

```bash
yarn add range-sdk
```

## Usage

Here's a basic example to get you started:

```typescript
import { SecurityRule, AnomalyDetector } from 'range-sdk';

const rule = new SecurityRule('Your Rule Configuration');
const detector = new AnomalyDetector('Your Detector Configuration');

// Use the rule and detector...
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







