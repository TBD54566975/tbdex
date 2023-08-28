* consider replacing all `createdAt` with `timestamp`
* consider removing `Resource.metadata.updatedAt`. `updatedAt` is signed over so, not sure if we want it to change all the time
* implement [`pfi-rest-client`](./src/pfi-rest-client.ts) methods
* write [Usage]('./README.md#usage') section
* implement method in `Rfq` class that validates the rfq against the provided `Offering | OfferingModel`
  * I think this is where we can do pex eval
* add PSub to rfq returned by `DevTools.createRfq`
* update [README](../README.md) for `offering.vcRequirements` now just a PDef object. not jwt-wrapped
* update [README](../README.md) for `rfq.vcs` now just a PSub object. not jwt-wrapped
* implement `DevTools.createIdentity` function that returns an object containing:
  * did
  * signing key
  * vc that satisfies PDef in offering returned by `DevTools.createOffering`
    * implement method to create VC
* update [README](../README.md) to state that `Ed25519` and `secp256k1` should be supported by all implementations
* cherry-pick good stuff from output of running `npx typedoc --plugin typedoc-plugin-markdown --out docs src/main.ts` to write API Reference