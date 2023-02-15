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

1. IN PROGRESS: Establish a first draft of the protocol
2. Implement a webhook emitter that works with DWN-aggregators and DIDs to receive asks
3. Implement a mock PFI that responds to asks with conditional offers


## Existing implementations of requirements

Some of the concepts needed by TBDex can be found in the following implementations

* DWN reference implementation
* Self Soverign Identity reference implementation
* SSI Service 
* DWN Aggregator