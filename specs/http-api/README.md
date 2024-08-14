# tbDEX HTTP API <!-- omit in toc -->

# Introduction <!-- omit in toc -->
This specification defines a REST API that can be hosted by an individual PFI that wants to provide liquidity via tbDEX

# Status <!-- omit in toc -->
Version: Draft

> [!NOTE]
> 
> This specification will continue to be in a **Draft** state until there are two separate PFIs deployed and providing liquidity to individuals or other institutions

# Table of Contents <!-- omit in toc -->
- [Discoverability](#discoverability)
  - [Example](#example)
- [Error Responses](#error-responses)
  - [Error response structure](#error-response-structure)
  - [ErrorDetail structure](#errordetail-structure)
  - [Example](#example-1)
- [Query Params](#query-params)
  - [Pagination](#pagination)
    - [Example](#example-2)
- [Idempotency](#idempotency)
- [Callbacks](#callbacks)
- [Protected Endpoints](#protected-endpoints)
  - [Authentication](#authentication)
    - [Token Generation](#token-generation)
      - [Header](#header)
      - [Claims Set](#claims-set)
  - [Token Verification](#token-verification)
- [Offerings](#offerings)
  - [List Offerings](#list-offerings)
    - [Description](#description)
    - [Endpoint](#endpoint)
    - [Protected](#protected)
    - [Response](#response)
- [Exchanges](#exchanges)
  - [Create Exchange](#create-exchange)
    - [Description](#description-1)
    - [Endpoint](#endpoint-1)
    - [Protected](#protected-1)
    - [Request Body](#request-body)
      - [`CreateExchangeRequest`](#createexchangerequest)
    - [Response](#response-1)
    - [Errors](#errors)
  - [Submit Order/Cancel](#submit-ordercancel)
    - [Description](#description-2)
    - [Endpoint](#endpoint-2)
    - [Protected](#protected-2)
    - [Request Body](#request-body-1)
    - [Response](#response-2)
    - [Errors](#errors-1)
  - [Get Exchange](#get-exchange)
    - [Description](#description-3)
    - [Endpoint](#endpoint-3)
    - [Protected](#protected-3)
    - [Response](#response-3)
  - [List Exchanges](#list-exchanges)
    - [Description](#description-4)
    - [Endpoint](#endpoint-4)
    - [Protected](#protected-4)
    - [Response](#response-4)
  - [List Balances](#list-balances)
    - [Description](#description-5)
    - [Protected](#protected-5)
    - [Endpoint](#endpoint-5)
    - [Response](#response-5)
- [References](#references)

# Discoverability
PFIs can become publicly discoverable by advertising their API endpoint as a [Service](https://www.w3.org/TR/did-core/#services) within their DID Document. In order to increase the likelihood of being discovered The `service` entry **SHOULD** include the following properties:

| Property          | Value                                                         |
| ----------------- | ------------------------------------------------------------- |
| `id`              | see [DID-CORE spec](https://www.w3.org/TR/did-core/#services) |
| `type`            | `PFI`                                                         |
| `serviceEndpoint` | PFI's publicly addressable API endpoint                       |

The ID can be chosen at the discretion of the PFI, but the service entry should be of type `PFI`.

## Example
```json
{
  "id": "did:example:pfi",
  "service": [{
    "id":"my-pfi",
    "type": "PFI",
    "serviceEndpoint": "https://pfi.organization.com"
  }]
}
```

> [!NOTE]
>
> _Decentralized_ discoverability is dependent upon whether the underlying [verifiable registry](https://www.w3.org/TR/did-core/#dfn-verifiable-data-registry) of the selected [DID Method](https://www.w3.org/TR/did-core/#methods) is crawlable

# Error Responses
* An error response is one whose status code is `>= 400`.
* If present, the body of an error response will conform to the following:

## Error response structure
| Field     | Type          | Required | Description                                                              |
| --------- | ------------- | -------- | ------------------------------------------------------------------------ |
| `message` | String        | Y        | A human-readable explanation specific to this occurrence of the problem. |
| `details` | ErrorDetail[] | N        | Optional array of `ErrorDetail` objects                                  |

## ErrorDetail structure
| Field     | Type   | Required | Description                                                                            |
| --------- | ------ | -------- | -------------------------------------------------------------------------------------- |
| `id`      | String | N        | Optional server-generated request-specific ID, useful for diagnosing unexpected errors |
| `message` | String | N        | A human-readable explanation specific to this occurrence of the problem.               |
| `path`    | String | N        | Path where validation failed (i.e. JSON schema path)                                   |

---

## Example
```json
{
  "message": "Missing field: payin.amount",
  "details": [{ 
    "id": "9af2bf88-e4f4-4f81-8ba9-55eaeeb718e2",
    "message": "Payin amount must be present.",
    "path": "$.payin.amount" 
  }]
}
```

# Query Params
Query parameters, also known as query strings, are a way to send additional information to the server as part of a URL. They allow clients to provide specific input or customize the server's response. Query parameters typically follow the main URL and start with a `?` character. They consist of key-value pairs, and multiple pairs can be separated by `&` characters

Query params are supported by many of the `GET /${resource}` endpoints in the following ways

* Simple Example: `?field=foo`
* Same Field; Multiple Values: `field=bar&field=baz`

## Pagination
Pagination is supported using the following query params:

| Param          | Description                                                                 | Default |
| -------------- | --------------------------------------------------------------------------- | ------- |
| `page[offset]` | Specifies the starting position from where the records should be retrieved. | `0`     |
| `page[limit]`  | Specifies the maximum number of records to be retrieved.                    | `10`    |

### Example
`/?page[offset]=0&page[limit]=10`

---

# Idempotency
The IDs of individual tbDEX messages are used as idempotency keys. For example, in a tbDEX Order message:

```json
{
  "metadata": {
    "from": "did:key:z6MkvUm6mZxpDsqvyPnpkeWS4fmXD2jJA3TDKq4fDkmR5BD7",
    "to": "did:ex:pfi",
    "exchangeId": "rfq_01ha83pkgnfxfv41gpa44ckkpz",
    "kind": "order",
    "id": "order_01ha83pkgsfk6t1kxg7q42s48j",
    "createdAt": "2023-09-13T20:28:40.345Z",
    "protocol": "1.0"
  },
  "data": {},
  "signature": "eyJhbGciOiJFZERTQSIsImtpZCI6ImRpZDprZXk6ejZNa3ZVbTZtWnhwRHNxdnlQbnBrZVdTNGZtWEQyakpBM1RES3E0ZkRrbVI1QkQ3I3o2TWt2VW02bVp4cERzcXZ5UG5wa2VXUzRmbVhEMmpKQTNUREtxNGZEa21SNUJENyJ9..tWyGAiuUXFuVvq318Kdz-EJJgCPCWEMO9xVMZD9amjdwPS0p12fkaLwu1PSLxHoXPKSyIbPQnGGZayI_v7tPCA"
}
```

The `ID` here that serves as idempotency key is `order_01ha83pkgsfk6t1kxg7q42s48j`. Each tbDEX message's idempotency key can be accessed via `message.metadata.id` like so:

```kotlin
val order = Order.create(...)
val orderId = order.metadata.id
```

---

# Callbacks
Callbacks are implemented via the `replyTo` property on the [request to create an exchange](#create-exchange).

`replyTo` is a fully qualified URI which could either be a DID or a URL.

If `replyTo` is present, a PFI will send any/all new messages for a given exchange to the supplied URI. This makes the URI scoped to each exchange, allowing the caller to specify a different URI per exchange if they so wish. 

If `replyTo` is _not_ present, the caller will have to poll the PFI for the exchange in question to receive new messages.

---

# Protected Endpoints

A  **_protected endpoint_** is defined as one that requires the requester to be _authenticated_.  These endpoints respond with resources specific to the authenticated DID e.g. 
* Messages sent by or intended for the requester only
* Balances 

> [!NOTE] 
> Each individual endpoint section in this specification will include `Protected: true/false` to indicate whether it is protected

## Authentication

When accessing a protected endpoint, a tbdex http client MUST set the HTTP [Authorization Header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization) in order to be authenticated. 

The value of the header MUST use the Bearer Authentication Scheme as defined in [RFC 6750](https://datatracker.ietf.org/doc/html/rfc6750#section-2.1), and the access token MUST be a JWT.

### Token Generation

The bearer token is a [JSON Web Token (JWT)](https://datatracker.ietf.org/doc/html/rfc7519) generated by the requester. It must consist of JWT header and Claims Set containing the below fields, and signed using the verification method published as the authentication verification relationship in the requester's DID document.

#### Header

| Key                                                                  | Description                                                                                                                                                                                     |
| -------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`typ`](https://datatracker.ietf.org/doc/html/rfc7519#section-5.1)   | JWT. Setting `typ` to `JWT` as recommended by the JWT spec provides a means to disambiguate among different types of signatures and tokens.                                                     |
| [`kid`](https://datatracker.ietf.org/doc/html/rfc7515#section-4.1.4) | Fully qualified [VerificationMethod ID](https://www.w3.org/TR/did-core/#verification-methods). Used to locate the DID Document verification method utilized to verify the integrity of the JWT. |
| [`alg`](https://datatracker.ietf.org/doc/html/rfc7515#section-4.1.1) | Cryptographic algorithm used to compute the JWT signature.                                                                                                                                      |


#### Claims Set

| Key                                                                  | Description                                                                                                                                                                 |
| -------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`aud`](https://datatracker.ietf.org/doc/html/rfc7519#section-4.1.3) | The intended PFI's DID. Incorporating the `aud` claim limits the risk to just one PFI in case a request token is compromised, thereby reducing the surface area for misuse. |
| [`iss`](https://datatracker.ietf.org/doc/html/rfc7519#section-4.1.1) | The requester's DID. Included to be informative, though it is technically duplicative as the `kid` also includes the requester's DID.                                       |
| [`exp`](https://datatracker.ietf.org/doc/html/rfc7519#section-4.1.4) | Expiration timestamp. Limits the amount of time a compromised request token can be used.                                                                                    |
| [`iat`](https://datatracker.ietf.org/doc/html/rfc7519#section-4.1.6) | Indicates when the JWT was created. Included to be informative.                                                                                                             |
| [`jti`](https://datatracker.ietf.org/doc/html/rfc7519#section-4.1.7) | Used as a nonce to prevent replay attacks. The specification text should include more detail on how to prevent these attacks.                                               |

> [!NOTE]
> This bearer token is sufficient for authentication as it proves that the requester controls the private key associated to the DID that the requester is identifying as. 


## Token Verification

The receiver of the token must evaluate it to ensure its validity. A bearer token is valid if these conditions are met:

- `exp` timestamp is not in the past
- `aud` is the DID of the receiving PFI's DID
- `kid` is resolved to be a valid DID whose DID Document verification method is used to verify the integrity of the JWT
- `jti` is not a nonce that was previously used by the same requester

---

# Offerings

The [`Offering`](../protocol/README.md#offering) resource is used to convey the currency pairs a PFI is _offering_. It includes information about payment methods and associated fees.

## List Offerings

### Description
Used to fetch offerings from a PFI


### Endpoint
`GET /offerings`

### Protected
False

### Response
| Status             | Body                   |
| ------------------ | ---------------------- |
| `200: OK`          | `{ data: Offering[] }` |
| `400: Bad Request` | `{ errors: Error[] }`  |

---

# Exchanges
An exchange is a series of linked tbDEX messages between Alice and a PFI for a single exchange. An exchange can be created by submitting an RFQ.

## Create Exchange

### Description
Submits an RFQ (Request For Quote). Alice is asking the PFI to provide a Quote so she can evaluate it.

### Endpoint
`POST /exchanges`

### Protected
False

### Request Body

#### `CreateExchangeRequest`
| field     | data type | required | description                                                                  |
| --------- | --------- | -------- | ---------------------------------------------------------------------------- |
| `message` | object    | Y        | The request for quote (RFQ) tbDEX message                                    |
| `replyTo` | string    | N        | A string containing a valid URI where new messages from the PFI will be sent |

> [!IMPORTANT]
> See RFQ structure [here](../protocol/README.md#rfq-request-for-quote)

```json
{
  "message": {
    {
      "metadata": {
        "from": "did:key:z6Mks4N5XdrE6VieJsgH8SMSRavmTox74RqoroW7bZzBLQBi",
        "to": "did:ex:pfi",
        "kind": "rfq",
        "id": "rfq_01ha835rhefwmagsknrrhvaa0k",
        "exchangeId": "rfq_01ha835rhefwmagsknrrhvaa0k",
        "createdAt": "2023-09-13T20:19:28.430Z",
        "protocol": "1.0"
      },
      "data": {
        "offeringId": "abcd123",
        "payinMethod": {
          "kind": "DEBIT_CARD",
          "paymentDetails": "<HASH_PRIVATE_PAYIN_METHOD_PAYMENT_DETAILS>"
        },
        // ...
      }
    }
  },
  "replyTo": "https://alice.wallet.com/events"
}
```

### Response
| Status                       | Body                  |
| ---------------------------- | --------------------- |
| `202: Accepted`              | N/A                   |
| `400: Bad Request`           | `{ errors: Error[] }` |
| `500: Internal Server Error` | `{ errors: Error[] }` |

### Errors
| Status | Description             |
| ------ | ----------------------- |
| 400    | Validation error(s)     |
| 400    | Failed Signature Check  |
| 409    | Exchange already exists |

## Submit Order/Cancel

### Description
This endpoint can receive either an Order or a Cancel message.
Alice can submit an Order, which indicates that she wants the PFI to execute on the Quote she received.
Alice can submit a Cancel, which indicates that Alice is no longer interested in continuing with the exchange.

### Endpoint
`PUT /exchanges/:exchange_id`

### Protected
False

### Request Body
> [!IMPORTANT]
> See Order structure [here](../protocol/README.md#order). See Cancel structure [here](../protocol/README.md#cancel)

```javascript
{
  "message": { } // order or cancel message
}
```

### Response
| Status                       | Body                  |
| ---------------------------- | --------------------- |
| `202: Accepted`              | N/A                   |
| `400: Bad Request`           | `{ errors: Error[] }` |
| `500: Internal Server Error` | `{ errors: Error[] }` |


### Errors
| Status | Description                 |
| ------ | --------------------------- |
| 400    | Failed Signature Check      |
| 404    | Exchange not found          |
| 409    | Order or Cancel not allowed |

---

## Get Exchange

### Description
Retrieves all messages associated to a specific exchange

### Endpoint
`GET /exchanges/:exchange_id`

### Protected
True. See [Authentication](#authentication) section for more details.

### Response

| Status                       | Body                       |
| ---------------------------- | -------------------------- |
| `200: OK`                    | `{ data: TbdexMessage[] }` |
| `400: Bad Request`           | `{ errors: Error[] }`      |
| `401: Unauthorized`          | `{ errors: Error[] }`      |
| `404: Not Found`             | N/A                        |
| `500: Internal Server Error` | `{ errors: Error[] }`      |

---

## List Exchanges

### Description
Returns a list of exchange IDs 

### Endpoint
`GET /exchanges`

### Protected
True. See [Authentication](#authentication) section for more details.

### Response
| Status                       | Body                                           |
| ---------------------------- | ---------------------------------------------- |
| `200: OK`                    | List of exchangeIds, i.e. `{ data: string[] }` |
| `400: Bad Request`           | `{ errors: Error[] }`                          |
| `401: Unauthorized`          | `{ errors: Error[] }`                          |
| `404: Not Found`             | N/A                                            |
| `500: Internal Server Error` | `{ errors: Error[] }`                          |

---

## List Balances
This endpoint is *OPTIONAL*. It is only relevant for PFIs which expose a stored balance functionality either for institutional or retail customers.

### Description
Returns an array of balance resources for each currency held by the caller.  

### Protected
True. See [Authentication](#authentication) section for more details.

### Endpoint
`GET /balances`

### Response
| Status                       | Body                                                                                                                           |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `200: OK`                    | `{ data: Balance[] }` See [Balance structure](https://github.com/TBD54566975/tbdex/blob/main/specs/protocol/README.md#balance) |
| `400: Bad Request`           | `{ errors: Error[] }`                                                                                                          |
| `401: Unauthorized`          | `{ errors: Error[] }`                                                                                                          |
| `404: Not Found`             | N/A                                                                                                                            |
| `500: Internal Server Error` | `{ errors: Error[] }`                                                                                                          |

# References
* JSON:API spec: https://jsonapi.org/format/
