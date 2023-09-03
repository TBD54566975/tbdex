# tbDEX Protocol <!-- omit in toc -->

Library that can be used to:
* create, parse, verify, and validate the tbDEX Messages and Resources defined in the [protocol specification](../README.md)
* send requests to PFIs
# Table of Contents <!-- omit in toc -->
- [Installation](#installation)
- [Usage](#usage)
  - [Message Creation](#message-creation)
  - [Message Parsing](#message-parsing)
  - [Message Validation](#message-validation)
  - [Integrity Check](#integrity-check)
  - [Sending Requests](#sending-requests)
- [Development](#development)
  - [Prerequisites](#prerequisites)
    - [`node` and `npm`](#node-and-npm)
  - [Running Tests](#running-tests)
  - [`npm` scripts](#npm-scripts)
- [Publishing Releases](#publishing-releases)


# Installation

```bash
npm install @tbd54566975/tbdex
```

# Usage

## Message Creation
There's a concrete class for each [Message Kind](../README.md#message-kinds). These classes can be used to create messages. e.g. 
```typescript
import { DevTools, Rfq } from '@tbd54566975/tbdex'

const rfq = Rfq.create({
  metadata : { from: alice.did, to: 'did:ex:pfi' },
  data     : {
    offeringId  : 'abcd123',
    payinMethod : {
      kind           : 'DEBIT_CARD',
      paymentDetails : {
        'cardNumber'     : '1234567890123456',
        'expiryDate'     : '12/22',
        'cardHolderName' : 'Ephraim Bartholomew Winthrop',
        'cvv'            : '123'
      }
    },
    payoutMethod: {
      kind           : 'BTC_ADDRESS',
      paymentDetails : {
        btcAddress: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'
      }
    },
    quoteAmountSubunits : '20000',
    vcs                 : ''
  }
})

await rfq.sign(alice)

console.log(JSON.stringify(rfq, null, 2))
```

## Message Parsing
All messages can be parsed from json into an instance of the Message Kind's class using the `Message.parse` method. e.g.

```typescript
import { Message } from '@tbd54566975/tbdex'

const jsonMessage = "<SERIALIZED_MESSAGE>"
const message = await Message.parse(jsonMessage)

if (message.isRfq()) {
  // rfq specific logic
}
```

Parsing a message includes format validation and integrity checking

## Message Validation
> [!NOTE]
>
> TODO: Fill Out

## Integrity Check
> [!NOTE]
>
> TODO: Fill Out
## Sending Requests
> [!NOTE]
>
> TODO: Fill Out

# Development

## Prerequisites
### `node` and `npm`
This project is using `node v20.3.0` and `npm v9.6.7`. You can verify your `node` and `npm` installation via the terminal:

```
$ node --version
v20.3.0
$ npm --version
9.6.7
```

If you don't have `node` installed. Feel free to choose whichever approach you feel the most comfortable with. If you don't have a preferred installation method, i'd recommend using `nvm` (aka node version manager). `nvm` allows you to install and use different versions of node. It can be installed by running `brew install nvm` (assuming that you have homebrew)

Once you have installed `nvm`, install the desired node version with `nvm install vX.Y.Z`.

## Running Tests
> [!NOTE]
> 
> Make sure you have all the [prerequisites](#prerequisites)

0. clone the repo and `cd` into the project directory
1. Install all project dependencies by running `npm install`
2. start the test databases using `./scripts/start-databases` (requires Docker)
3. run tests using `npm run test`

## `npm` scripts

| Script                 | Description                                               |
| ---------------------- | --------------------------------------------------------- |
| `npm run clean`        | deletes `dist` dir and compiled tests                     |
| `npm run test:node`    | runs tests in node runtime                                |
| `npm run test:browser` | runs tests in headless browsers (chrome, safari, firefox) |
| `npm run lint`         | runs linter without auto-fixing                           |
| `npm run lint:fix`     | runs linter and applies automatic fixes wherever possible |
| `npm run build`        | builds all distributions and dumps them into `dist`       |

# Publishing Releases

> [!NOTE]
>
> This section is applicable to core maintainers only

> [!IMPORTANT]
>
> be sure to version bump the package in `package.json` _before_ merging a PR

1. After merging the PR, navigate to Github's `tags` section of this repo [here](https://github.com/TBD54566975/tbdex-protocol/tags)
![Tags](./images/github_tags.png)

1. Click on `Releases` button and click `Draft a new release`.

2. Click on `Choose a tag`, then create a new tag with the version number matching from step 3. The release title is also the same version number, i.e. `v0.0.3`
![New release](./images/new_release.png)

1. Click `Generate release notes`. This will auto-populate a list of all PRs merged to main since the last release.
![Generated release notes](./images/generated_release_notes.png)

1. Click `Publish release`, which will kick off the `Release to NPM Registry` action, which you can see [here](https://github.com/TBD54566975/tbdex-protocol/actions/workflows/release-npm.yml)

2.  After the github action is successfully completed, you will have a new version of `@tbd54566975/tbdex` available in the [NPM registry](https://www.npmjs.com/package/@tbd54566975/tbdex).