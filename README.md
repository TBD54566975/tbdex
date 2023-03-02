# tbDEX Protocol

## Introduction

The central aim of this repo is to act as a playground that is set up for us to easily test the ideas we come up with as we iterate our way to what we hope is a robust protocol. Specifically, this repo is focused on fleshing out:
  - tbDEX message schemas/formats
    - What types of messages do Alice and a PFI send to one another?
    - What do these messages contain?
    - What does the state machine look like for a thread of tbDEX messages?
  - A mock PFI implementation that works with DIDs and "web5"


## Getting Started

See the protocol readme (protocol/README.md) for more information on how to get started.

Read the paper: https://tbdex.io/whitepaper.pdf


## Roadmap

1. ✅ Establish a first draft of the protocol
2. Implement a webhook emitter that works with DWN-aggregators and DIDs to receive asks
3. Implement a mock PFI that responds to asks with conditional offers
4. Wrap it all up into a "TBDEX SDK" that can be used by PFIs (that may not be in this repo, however)

## Existing implementations of requirements

Some of the concepts needed by TBDex can be found in the following implementations

* [DWN reference implementation](https://github.com/TBD54566975/dwn-sdk-js)
* [Self Soverign Identity SDK](https://github.com/TBD54566975/ssi-sdk)
* [SSI Service](https://github.com/TBD54566975/ssi-service)
* [DWN Aggregator](https://github.com/TBD54566975/dwn-aggregator)
