# [PROPOSED] tbDEX Interop Profile

```
This is a proposed interop profile that is subject to change. Please open issues for questions and additional discussion.
```

# Overview

There’s a lot of complexity in the Decentralized Identity space. Tons of standards and opinions on those standards. To make sense of how we navigate the space, let’s answer the following questions:

- Which standards do we implement, and recommend the implementation of?
- What do we recommend for participants in tbDEX: issuers, verifiers, PFIs, wallets, and others?
- How do we do this in a way that promotes widespread interoperability?

Interoperability profiles are the answer to these questions.

# Interoperability Profiles

Interoperability profiles are a bundle of standards (sometimes even more specific than that) that represent a “line in the sand” to promote interoperability between implementers. The idea is that if you implement the profile you can communicate with one another: between web applications, mobile applications, and web servers for all types of flows involving DIDs and Verifiable Credentials. 

While there are variations in profiles’ breadth and depth, here are the different components we should consider specifying support for:

- **Entity Identifiers** – how participants are identified, and how one can access their cryptographic key material (e.g. DIDs, specific DID methods, x509s, JWKs, etc.).
- **Cryptographic Operations** – which cryptographic keys and algorithms for encryption/decryption, signing/verification, and other operations are supported (e.g. Ed25519/EdDSA, X25519/ECDH, P-256/ECDSA, etc.).
- **Credential Format** – what type of Verifiable Credential(s) to be used (e.g. W3C Verifiable Credentials v1.1, v2.0, Open ID Tokens, SD-JWT/SD-JWT-VC, mDoc/mDL, etc.).
- **User Authentication** – how one *authenticates* with other entities (e.g. DIDAuth, OpenID Connect, SIOPv2, etc.).
- **Credential Application** – how entities apply for and receive Verifiable Credentials (e.g. VC-API, OID4VCI, Credential Manifest, a DWN protocol, etc.).
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

## tbDEX Profile

Our first tbDEX profile does not prevent there from being other profiles, nor does it restrict what types of interactions are permitted on tbDEX. Instead, the profile aims to promote interoperability between implementers that can be built and iterated upon.

With tbDEX we identify three main parties. The parties may overlap (e.g. a tbDEX node can be a credential issuer).

- **Nodes** — run to facilitate tbDEX messages, interacts with end-users through web applications, wallets, etc.
- **Issuers** — responsible for issuing Verifiable Credentials.
- **Agents** — user-centric way to interact with tbDEX, store/manage/use their identities credentials, and other data.

|     | Supported | Who? | Notes |
| --- | --------- | ---- | ----- |
| Entity Identifiers | `did:jwk`, `did:dht`, `did:web` | Nodes, Issuer, Agents | `did:dht` is **recommended** as a default method. |
| Cryptographic Schemes | Ed25519/EdDSA, secp256k1/ES256K, secp256r1 (P-256)/ECDSA, X25519/ECDH | Nodes, Issuer, Agents | Sign/Verify: ed25519 with EdDSA, secp256r1 with ECDSA, secp256k1 with ES256K Encrypt/Decrypt (via Key Agreement): X25519 and secp keys with ECDH |
| Entity AuthN/Z | tbDEX Signed Messages with VCs | Nodes, Issuer, Agents | [As outlined here](https://github.com/TBD54566975/tbdex/tree/main/specs/protocol#signatures). |
| VC Formats | W3C VCDM v1.1 as VC-JWT and VP-JWT | Nodes, Issuer, Agents | Most widely adopted; should be used with VC-JSON-Schema instead of JSON-LD contexts. |
| Credential Issuance | OID4VCI | Issuer, Agents | Will need to pick an implementers draft to implement against. |
| Credential Presentation (Option) | OID4VP using Presentation Exchange v2 | Nodes, Issuer, Agents | Will need to pick an implementers draft to implement against. |
| Credential Status | Status List 2021 | Nodes, Issuer, Agents |  Implemented against [this specification](https://www.w3.org/community/reports/credentials/CG-FINAL-vc-status-list-2021-20230102/#example-example-statuslist2021credential). |
| tbDEX Messages | v1, DIF PEv2 | Nodes, Agents | Yet to be versioned. |

### Profile Detail

#### Entity Identifiers

Our default recommendation is [`did:dht`](https://did-dht.com). It is a highly decentralize, robust, and feature-rich method suitable for most use cases.

We also recommend the usage of [`did:jwk`](https://github.com/quartzjer/did-jwk/blob/main/spec.md) for simple use-cases where features such as service endpoints, multiple keys, or key rotation are not necessary. 

For organizations, we support the usage of [`did:web`](https://w3c-ccg.github.io/did-method-web/) which can be useful in establishing trust between a DID and an existing web domain.

#### Authorization & Authentication

Authorization and Authentication are handled by [tbDEX messages](https://github.com/TBD54566975/tbdex/blob/main/specs/protocol/README.md#messages), a self-contained, authenticated data payload. When additional auth is needed messages can include [Verifiable Credentials](#vc-formats) using [Verifiable Presentations](#vc-formats).

In the case of [Credential Issuance](#credential-issuance) and [Credential Presentation using OID4VP](#presentation-using-oid4vp) additional authorization with [OAuth 2.0](https://www.rfc-editor.org/rfc/rfc6749.txt) is necessary. With [Credential Presentation using OID4VP](#presentation-using-oid4vp), authentication can be accomplished with [SIOPv2](https://openid.github.io/SIOPv2/openid-connect-self-issued-v2-wg-draft.html).

#### Cryptograhpic Schemes

**Signing & Verification**

| Key Type | Algorithm |
| -------- | --------- |
| [Ed25519](https://ed25519.cr.yp.to/) | [EdDSA](https://datatracker.ietf.org/doc/html/rfc8032) |
| [secp256k1](https://en.bitcoin.it/wiki/Secp256k1) | [ECDSA](https://en.bitcoin.it/wiki/Elliptic_Curve_Digital_Signature_Algorithm) |
| [secp256r1/NIST P-256](https://neuromancer.sk/std/secg/secp256r1) | [ECDSA](https://en.wikipedia.org/wiki/Elliptic_Curve_Digital_Signature_Algorithm) |

**Ed25519** is required for use with `did:dht`, among other DID methods. It is highly secure, fast, and widely regarded as one the best key types available. **secp256k1** is prominently used in the Bitcoin and Ethereum blockchains, amongst others, along with the `did:ion` method. The **secp256r1** or **NIST P-256** curve is offered as an option when NIST adherence is a requirement.

**Key Exchange**

Key agreement is done with [X25519](https://cryptography.io/en/latest/hazmat/primitives/asymmetric/x25519/) which uses the same underlying curve as Ed25519 ([Curve25519](https://cr.yp.to/ecdh.html)), when possible. Otherwise, both **secp256k1** and **secp256kr1** can be used for key agreement with the [ECDH](https://cryptobook.nakov.com/asymmetric-key-ciphers/ecdh-key-exchange) algorithm.

**Encryption and Decryption** 

It is recommended to use [XChaCha20-Poly1305](https://en.wikipedia.org/wiki/ChaCha20-Poly1305#XChaCha20-Poly1305_%E2%80%93_extended_nonce_variant) for authenticated encryption and decryption.

#### VC Formats

The [W3C Verifiable Credentials Data Model v1.1](https://www.w3.org/TR/2022/REC-vc-data-model-20220303/) is recommended. Verifiable Credentials are to be represented as [JSON Web Tokens as per the specification](https://www.w3.org/TR/2022/REC-vc-data-model-20220303/#json-web-token-extensions).

The data shape of credentials are recommended to be provided using the [`credentialSchema`](https://www.w3.org/TR/2022/REC-vc-data-model-20220303/#data-schemas) property, and the specification [VC-JSON-Schema](https://www.w3.org/TR/vc-json-schema/). 

[Verifiable Presentations](https://www.w3.org/TR/2022/REC-vc-data-model-20220303/#presentations-0) are also supported using the JWT representation.

#### Credential Issuance

Credential Issuance is a protocol defined by [OID4VCI](https://openid.github.io/OpenID4VCI/openid-4-verifiable-credential-issuance-wg-draft.html). The OID4VCI protocol supports issuing of Verifiable Credentials of multiple formats, including [those this profile supports](#vc-formats). The OID4VC family of specifications leverages the widely supported, secure, and proven deployments of OAuth 2.0 and OpenID Connect (OIDC).

Acess to the API requires support of OAuth 2.0 [RFC6749](https://www.rfc-editor.org/rfc/rfc6749.txt). To quote the spec:

> Access to this API is authorized using OAuth 2.0 [RFC6749](https://www.rfc-editor.org/rfc/rfc6749.txt), i.e., the Wallet uses OAuth 2.0 to obtain authorization to receive Verifiable Credentials. This way the issuance process can benefit from the proven security, simplicity, and flexibility of OAuth 2.0 and existing OAuth 2.0 deployments and OpenID Connect OPs (see [OpenID.Core](http://openid.net/specs/openid-connect-core-1_0.html)) can be extended to become Credential Issuers

#### Credential Presentation

By default, Credential Presentation is done via [tbDEX Messages] using [Presentation Exchange v2](https://identity.foundation/presentation-exchange/spec/v2.0.0/) and [Verifiable Presentations](#vc-formats).

##### Presentation using OID4VP

As an option, Credential Presentation can be done via [OID4VP](https://openid.github.io/OpenID4VP/openid-4-verifiable-presentations-wg-draft.html). The OID4VP protocol supports presentation of Verifiable Credentials of multiple formats using [Presentation Exchange v2](https://identity.foundation/presentation-exchange/spec/v2.0.0/).  The OID4VC family of specifications leverages the widely supported, secure, and proven deployments of OAuth 2.0 and OpenID Connect (OIDC).

The specification is built on top of OAuth 2.0 [RFC6749](https://www.rfc-editor.org/rfc/rfc6749.txt), which is used as a base protocol. To quote the spec:

> OAuth 2.0 [RFC6749] is used as a base protocol as it provides the required rails to build a simple, secure, and developer-friendly Credential presentation layer on top of it. Moreover, implementers can, in a single interface, support Credential presentation and the issuance of Access Tokens for access to APIs based on Verifiable Credentials in the Wallet. OpenID Connect [OpenID.Core](http://openid.net/specs/openid-connect-core-1_0.html) deployments can also extend their implementations using this specification with the ability to transport Verifiable Presentations.

> This specification can also be combined with [SIOPv2](https://openid.github.io/SIOPv2/openid-connect-self-issued-v2-wg-draft.html), if implementers require OpenID Connect features, such as the issuance of Self-Issued ID Tokens [SIOPv2](https://openid.github.io/SIOPv2/openid-connect-self-issued-v2-wg-draft.html).

#### Credential Status

Credential Status is accomplished by utilizing the spec [Status List 2021](https://www.w3.org/community/reports/credentials/CG-FINAL-vc-status-list-2021-20230102/#example-example-statuslist2021credential). **Note:** This spec is under development and is being upgraded under [Bitstring Status List](https://w3c.github.io/vc-bitstring-status-list/), which will be monitored for future adoption.

#### tbDEX Messages

[tbDEX messages](https://github.com/TBD54566975/tbdex/blob/main/specs/protocol/README.md#messages), a self-contained, authenticated data payload that facilitate all interactions on [tbDEX](https://github.com/TBD54566975/tbdex).

## Comparison to Other Profiles

The table below compares compatability with other profiles. Since no other profiles yet support tbDEX messaging, it is excluded from the chart. Support is marked as :heavy_check_mark: if there is overlap (e.g. a profile supports did:web); complete overlap is not a requirement. Support is marked as :x: if there is no overlap. Support is marked as :question: if the profile does not specify a feature.

|                         | DIF | HAIP | EBSI | MSFT | 
| ----------------------- | --- | ---- | ---- | ---- |
| Entity Identifiers      | :heavy_check_mark: (mentions did:web, did:jwk, did:ion) | :heavy_check_mark: | :x: (did:ebsi) | :heavy_check_mark: (mentions did:web, did:jwk, did:ion) |
| Cryptograhpic Schemes   | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: (P-256) | :heavy_check_mark: (Ed25519, secp256k1) |
| Entity AuthZ/N          | :x: | :x:| :x: | :x: |
| VC Formats              | :heavy_check_mark: | :x: (uses [SD-JWT-VC](https://www.ietf.org/archive/id/draft-terbu-oauth-sd-jwt-vc-00.html)) | :heavy_check_mark: (VCDM v1.1 JWT + JSON Schema) | :heavy_check_mark: (VCDM v1.1 JWT) |
| Credential Issuance     | :question: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| Credential Presentation | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| Credential Status       | :heavy_check_mark: | :x: (uses [IETF Status List](https://datatracker.ietf.org/doc/html/draft-looker-oauth-jwt-cwt-status-list-01)) | :heavy_check_mark: | :heavy_check_mark: |
| Misc.                   | [Well Known DID](https://identity.foundation/.well-known/resources/did-configuration/) | - | [Trust](https://ec.europa.eu/digital-building-blocks/wikis/display/EBSIDOC/Issuers+trust+model+-+Accreditation+of+Issuers) | [Well Known DID](https://identity.foundation/.well-known/resources/did-configuration/) |


As you can see our profile is heavily inspired by existing profiles. It gives us fairly good coverage of existing profiles, enabling interoperability with existing stacks. The main area of difference is our auth scheme, which is bespoke (tbDEX messages), as opposed to using OAuth 2.0/OIDC, or another solution.
