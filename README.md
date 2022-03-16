# tbDEX Protocol
## Introduction
The central aim of this repo is to act as a playground that is set up for us to easily test the ideas we come up with as we iterate our way to what we hope is a robust protocol. Specifically, this repo is focused on fleshing out:
  - tbDEX message schemas/formats
    - What types of messages do Alice and a PFI send to one another?
    - What do these messages contain?
    - What does the state machine look like for a thread of tbDEX messages?
  - A mock PFI implementation

This repo currently contains 3 projects:
- [tbDEX Protocol Library](lib/README.md) - Houses the core logic to process tbDEX messages. Can be used by both wallets and PFIs
- [PFI Mock Implementation](pfi-mock-impl/README.md) - A mock implementation of a PFI. Implements message storage and message processors.
- [DID Library](did/README.md) - Houses logic specific to Decentralized Identifiers. Can be used by both wallets and PFIs

Our end-goal is to split these projects out into their own repos. For now, we've elected to keep all of them here to help us iterate as quickly as possible. Each project has been modularized to where moving it to another repo should be as easy as copy/pasting the proect's directory to another repo.

Each project also has its own respective README with info specific to that project.