# tbDEX Interop Profile

# Overview

There’s a lot of complexity in the Decentralized Identity space. Tons of standards and opinions on those standards. To make sense of how we navigate the space, let’s answer the following questions:

- Which standards do we implement, and recommend the implementation of?
- What do we recommend for participants in tbDEX: issuers, verifiers, PFIs, wallets, and others?
- How do we do this in a way that promotes widespread interoperability?

Interoperability profiles are the answer to these questions.

# Interoperability Profiles

Interoperability profiles are a bundle of standards (sometimes even more specific than that) that represent a “line in the sand” to promote interoperability between implementers. The idea is that if you implement the profile you can communicate with one another: between web applications, mobile applications, and web servers for all types of flows involving DIDs and Verifiable Credentials. 

While there are variations in profiles’ breadth and depth, here are the different components we should consider specifying support for:

- **Entity Identifiers** – how participants are identified, and how one can access their cryptographic key material (e.g. DIDs, specific DID methods, x509s, JWKs, etc.).]
- **Cryptographic Operations** – which cryptographic keys and algorithms for encryption/decryption, signing/verification, and other operations are supported (e.g. Ed25519/EdDSA, X25519/ECDH, P-256/ECDSA, etc.).
- **Credential Format** – what type of Verifiable Credential(s) to be used (e.g. W3C Verifiable Credentials v1.1, v2.0, Open ID Tokens, SD-JWT/SD-JWT-VC, mDoc/mDL, etc.).
- **User Authentication** – how one *authenticates* with other entities (e.g. DIDAuth, OpenID Connect, SIOPv2, etc.).
- ********************************************Credential Application******************************************** – how entities apply for and receive Verifiable Credentials (e.g. VC-API, OID4VCI, Credential Manifest, a DWN protocol, etc.).
    - **Note:** There is a distinction between Credential Application protocols like OID4VCI and Credential Application languages/data models like Credential Manifest.
- **Credential** **Presentation** – how entities request and share presentations of credentials with one another (e.g. VC-API, OID4VP, Presentation Exchange, a DWN protocol, etc.).
    - **Note:** There is a distinction between Credential Presentation protocols like OID4VP and Credential Presentation languages/data models like Presentation Exchange.
- **Credential Status** – how issuers, post-issuance, can represent the status of a Verifiable Credential (e.g. Status List 2021, etc.).
- **tbDEX Messages** – how messages in tbDEX interactions look and are sent (e.g. data model, protocol, transport).

## Existing Profiles

There are a number of profiles in the space, here are are a few prominent ones:

- (DIF) [DIF JWT VC Presentation Profile](https://identity.foundation/jwt-vc-presentation-profile/)
- (HAIP) [OpenID4VC High Assurance Interoperability Profile with SD-JWT VC](https://vcstuff.github.io/oid4vc-haip-sd-jwt-vc/draft-oid4vc-haip-sd-jwt-vc.html)
- (EBSI) [European Blockchain Standards Initiative Interop Profile](https://ec.europa.eu/digital-building-blocks/wikis/display/EBSIDOC/)
- (MSFT) [Microsoft Supported standards](https://learn.microsoft.com/en-us/entra/verified-id/verifiable-credentials-standards)

There have been recent conversations at IIW, in the OIDF, and in DIF about updating and continuing to standardize on these profiles. In the meantime, we need to deliver working software that facilitates interoperability. As such, let’s work on our own profile that leverages the best parts of existing profiles, since none exactly fit all the features we need to support.

## A tbDEX Profile

Our first tbDEX profile does not prevent there from being other profiles, nor does it restrict what types of interactions are permitted on tbDEX. Instead, the profile aims to promote interoperability between implementers that can be built and iterated upon.

With tbDEX we identify three main parties. The parties may overlap (e.g. a tbDEX node can be a credential issuer).

- **tbDEX nodes** — run to facilitate tbDEX messages, interacts with end-users through web applications, wallets, etc.
- **Issuers** — responsible for issuing Verifiable Credentials.
- **Wallets/Applications** — user-centric way to interact with tbDEX, store/manage/use their identities credentials, and other data.

|  | Supported | Who? | Notes |
| --- | --- | --- | --- |
| Entity Identifiers [Required] | did:jwk, did:dht, did:web | tbDEX, Issuer, Wallets | did:dht is recommended when possible |
| Entity Identifiers [Optional] | did:key, did:ion | tbDEX, Issuer, Wallets | -|
| Signature Schemes | Ed25519/EdDSA, secp256k1/ES256K, secp256r1 (P-256)/ECDSA, X25519/ECDH | tbDEX, Issuer, Wallets | Sign/Verify: ed25519 with EdDSA, secp256r1 with ECDSA, secp256k1 with ES256K Encrypt/Decrypt (via Key Agreement): X25519 and secp keys with ECDH Note: worth specifying encryption algs? |
| Entity AuthN/Z | tbDEX Signed Messages with VCs | tbDEX, Issuer, Wallets | [As outlined here](https://github.com/TBD54566975/tbdex/tree/main/specs/protocol#signatures). |
| VC Formats | W3C VCDM v1.1 as VC-JWT | tbDEX, Issuer, Wallets | Most widely adopted; should be used with VC-JSON-Schema instead of JSON-LD contexts. |
| Credential Issuance | OID4VCI | Issuer, Wallets | Will need to pick an implementers draft to implement against. |
| Credential Presentation (Option) | OID4VP using Presentation Exchange v2 | tbDEX, Issuer, Wallets | Will need to pick an implementers draft to implement against. |
| Status | Status List 2021 | tbDEX, Issuer, Wallets | Will implement https://www.w3.org/community/reports/credentials/CG-FINAL-vc-status-list-2021-20230102/#example-example-statuslist2021credential. |
| tbDEX Messages | v1, DIF PEv2 | tbDEX, Wallets | Yet to be versioned. |


## Comparison to Other Profiles

The table below compares compatability with other profiles. Since no other profiles yet support tbDEX messaging, it is excluded from the chart. Support is marked as :heavy_check_mark: if there is overlap (e.g. a profile supports did:web); complete overlap is not a requirement. Support is marked as :x: if there is no overlap. Support is marked as :question: if the profile does not specify a feature.


|                         | DIF | HAIP | EBSI | MSFT | 
| ----------------------- | --- | ---- | ---- | ---- |
| Entity Identifiers      | :heavy_check_mark: (mentions did:web, did:jwk, did:ion) | :heavy_check_mark: | :x: (did:ebsi) | :heavy_check_mark: (mentions did:web, did:jwk, did:ion) |
| Signature Schemes       | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: (P-256) | :heavy_check_mark: (Ed25519, secp256k1) |
| Entity AuthZ/N          | :x: | :x:| :x: | :x: |
| VC Formats              | :heavy_check_mark: | :x: (uses [SD-JWT-VC](https://www.ietf.org/archive/id/draft-terbu-oauth-sd-jwt-vc-00.html)) | :heavy_check_mark: (VCDM v1.1 JWT + JSON Schema) | :heavy_check_mark: (VCDM v1.1 JWT) |
| Credential Issuance     | :question: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| Credential Presentation | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| Credential Status       | :heavy_check_mark: | :x: (uses [IETF Status List](https://datatracker.ietf.org/doc/html/draft-looker-oauth-jwt-cwt-status-list-01)) | :heavy_check_mark: | :heavy_check_mark: |
| Misc.                   | [Well Known DID](https://identity.foundation/.well-known/resources/did-configuration/) | - | [Trust](https://ec.europa.eu/digital-building-blocks/wikis/display/EBSIDOC/Issuers+trust+model+-+Accreditation+of+Issuers) | [Well Known DID](https://identity.foundation/.well-known/resources/did-configuration/) |


As you can see our profile is heavily inspired by existing profiles. It gives us fairly good coverage of existing profiles, enabling interoperability with existing stacks. The few areas of difference are relatively small lifts, should we have requirements for full interoperability with these stacks.