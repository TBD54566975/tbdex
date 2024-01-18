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
  - [Error object](#error-object)
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
    - [Query Params](#query-params-1)
    - [Response](#response)
- [Exchanges](#exchanges)
  - [Create Exchange](#create-exchange)
    - [Description](#description-1)
    - [Endpoint](#endpoint-1)
    - [Protected](#protected-1)
    - [Request Body](#request-body)
    - [Response](#response-1)
    - [Errors](#errors)
  - [Get Quote/Order/OrderStatus](#get-quoteorderorderstatus)
    - [Description](#description-2)
    - [Endpoint](#endpoint-2)
    - [Protected](#protected-2)
    - [Response](#response-2)
    - [Response Body](#response-body)
  - [Submit Order](#submit-order)
    - [Description](#description-3)
    - [Endpoint](#endpoint-3)
    - [Protected](#protected-3)
    - [Order Request Body](#order-request-body)
    - [Response](#response-3)
    - [Errors](#errors-1)
  - [Submit Close](#submit-close)
    - [Description](#description-4)
    - [Endpoint](#endpoint-4)
    - [Protected](#protected-4)
    - [Request Body](#request-body-1)
    - [Response](#response-4)
    - [Errors](#errors-2)
  - [Get Exchange (DESCOPED)](#get-exchange-descoped)
    - [Description](#description-5)
    - [Endpoint](#endpoint-5)
    - [Protected](#protected-5)
    - [Query Params](#query-params-2)
    - [Response](#response-5)
  - [List Exchanges](#list-exchanges)
    - [Description](#description-6)
    - [Endpoint](#endpoint-6)
    - [Protected](#protected-6)
    - [Response](#response-6)
    - [Query Params](#query-params-3)
- [References](#references)

# Discoverability
PFIs can become publicly discoverable by advertising their API endpoint as a [Service](https://www.w3.org/TR/did-core/#services) within their DID Document. In order to increase the likelihood of being discovered The `service` entry **SHOULD** include the following properties:

| Property          | Value                                                                                       |
| ----------------- | ------------------------------------------------------------------------------------------- |
| `id`              | see [DID-CORE spec](https://www.w3.org/TR/did-core/#services)                               |
| `type`            | `PFI`                                                                                       |
| `serviceEndpoint` | PFI's publicly addressable API endpoint or DID which has PFIs publicly addressable endpoint |
If the serviceEndpoint is itself a DID, this did should resolve to a document and then its serviceEndpoints can be examined for the `#pfi` item. 

## Example
```json
{
  "id": "did:example:pfi",
  "service": [{
    "id":"#pfi",
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


| Field    | Required (Y/N) | Description             |
| -------- | -------------- | ----------------------- |
| `errors` | Y              | List of `Error` objects |


## Error object
| Field              | Required (Y/N) | Description                                                                                                                                                                                            |
| ------------------ | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `id`               | N              | A unique identifier for this particular occurrence of the problem.                                                                                                                                     |
| `status`           | N              | The HTTP status code applicable to this problem, expressed as a string value. This SHOULD be provided.                                                                                                 |
| `code`             | N              | An application-specific error code, expressed as a string value.                                                                                                                                       |
| `title`            | N              | A short, human-readable summary of the problem that SHOULD NOT change from occurrence to occurrence of the problem, except for purposes of localization.                                               |
| `detail`           | Y              | A human-readable explanation specific to this occurrence of the problem. Like `title`, this field’s value can be localized.                                                                            |
| `source`           | N              | An object containing references to the primary source of the error. It should include the `pointer`, `parameter`, or `header` members or be omitted.                                                   |
| `source.pointer`   | N              | A JSON Pointer to the value in the request document that caused the error. This MUST point to a value in the request document that exists; if it doesn’t, the client SHOULD simply ignore the pointer. |
| `source.parameter` | N              | A string indicating which URI query parameter caused the error.                                                                                                                                        |
| `source.header`    | N              | A string indicating the name of a single request header which caused the error.                                                                                                                        |
| `meta`             | N              | A meta object containing non-standard meta-information about the error.                                                                                                                                |

---

## Example
```json
{
  "errors": [
    {
      "id": "95e076c3-1589-4535-9a38-dba793d5c181",
      "status": 400,
      "detail": "Offering with id offering_xyz not found",

    }
  ]

}

```
# Query Params
Query parameters, also known as query strings, are a way to send additional information to the server as part of a URL. They allow clients to provide specific input or customize the server's response. Query parameters typically follow the main URL and start with a `?` character. They consist of key-value pairs, and multiple pairs can be separated by `&` characters

Query params are supported by many of the `GET /${resource}` endpoints in the following ways

* Simple Example: `?simple=field`
* Same Field; Multiple Values: `field=value&field=anotherValue`

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
The IDs of individual tbDEX messages are used as idempotency keys

---

# Callbacks
Callbacks are implemented via the `replyTo` property on the [request to create an exchange](#create-exchange). 

`replyTo` is a fully qualified URI which could either be a DID or just a URL.

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

| Key                                                                  | Description                                                                                                                                                                                      |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [`typ`](https://datatracker.ietf.org/doc/html/rfc7519#section-5.1)   | JWT. Setting `typ` to `JWT` as recommended by the JWT spec provides a means to disambiguate among different types of signatures and tokens.                                                      |
| [`kid`](https://datatracker.ietf.org/doc/html/rfc7515#section-4.1.4) | Fully qualified [VerificationMethod ID](https://www.w3.org/TR/did-core/#verification-methods). Used to locate the DID Document verification method utilized to verify the integrity of the JWT. |
| [`alg`](https://datatracker.ietf.org/doc/html/rfc7515#section-4.1.1) | Cryptographic algorithm used to compute the JWT signature.                                                                                                                                       |


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

### Query Params
| Param              | Description                                                                                                                                                        |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `baseCurrency`     | The primary currency listed in a currency pair, representing the unit being traded. **This is the currency that Alice will be _receiving_**                        |
| `quoteCurrency`    | The secondary currency listed in a currency pair, indicating its value in relation to the base currency. **This is the currency that the PFI will be _receiving_** |
| `payinMethodKind`  | The payin method Alice wishes to use to provide quote currency                                                                                                     |
| `payoutMethodKind` | The payout method Alice wishes to use to receive base currency                                                                                                     |
| `id`               | Query for a specific offering                                                                                                                                      |


### Response
| Status             | Body                  |
| ------------------ | --------------------- |
| `200: OK`          | `Offering[]`          |
| `400: Bad Request` | `{ errors: Error[] }` |

---

# Exchanges
An exchange is a series of linked tbDEX messages between Alice and a PFI for a single exchange. An exchange can be created by submitting an RFQ.

## Create Exchange

### Description
Submits an RFQ (Request For Quote). Alice is asking the PFI to provide a Quote so she can evaluate it.

### Endpoint
`POST /exchanges/:exchange_id`

### Authentication
Refer to [Signature Verification Section]() of the tbDEX spec  

### Authorization
No Authorization required to create an exchange

### Protected
False

### Request Body

#### `CreateExchangeRequest`
| field            | data type | required | description                                                                                       |
| ---------------- | --------- | -------- | ------------------------------------------------------------------------------------------------- |
| `rfq`           | object    | Y        | The request for quote                       |
| `replyTo` | string    | N        | A string containing a valid URI where new messages from the PFI will be sent |

> [!IMPORTANT]
> See RFQ structure [here](../protocol/README.md#rfq-request-for-quote)

```json
{
  "rfq": {
    {
      "metadata": {
        "from": "did:key:z6Mks4N5XdrE6VieJsgH8SMSRavmTox74RqoroW7bZzBLQBi",
        "to": "did:ex:pfi",
        "kind": "rfq",
        "id": "rfq_01ha835rhefwmagsknrrhvaa0k",
        "exchangeId": "rfq_01ha835rhefwmagsknrrhvaa0k",
        "createdAt": "2023-09-13T20:19:28.430Z"
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
| Status             | Body                  |
| ------------------ | --------------------- |
| `202: Accepted`    | N/A                   |
| `400: Bad Request` | `{ errors: Error[] }` |

### Errors
| Status | Description                  |
| ------ | -----------------------------|
| 400    | Validation error(s)          |
| 400    | Failed Signature Check       |
| 409    | Exchange already exists      |

## Get Quote/Order/OrderStatus

### Description
Retrieve the desired tbdex message type given an exchangeId.

### Endpoint
`GET /exchanges/:exchange_id/?messageType=quote`

### Protected
True

### Response
| Status             | Body                                                |
| ------------------ | --------------------------------------------------- |
| `200: OK`          | `{ data: TbdexMessage<Quote/Order/OrderStatus>[] }` |
| `400: Bad Request` | `{ errors: Error[] }`                               |

### Response Body
> [!IMPORTANT]
> See Quote structure [here](../protocol/README.md#quote)
> See Order structure [here](../protocol/README.md#order)
> See OrderStatus structure [here](../protocol/README.md#orderstatus)

## Submit Order

### Description
Submits the Order. Alice wants to accept the Quote and execute the transaction.

### Endpoint
`POST /exchanges/:exchange_id/order`

### Protected
False

### Order Request Body
> [!IMPORTANT]
> See Order structure [here](../protocol/README.md#order)


### Response
| Status             | Body                  |
| ------------------ | --------------------- |
| `202: Accepted`    | N/A                   |
| `400: Bad Request` | `{ errors: Error[] }` |

### Errors
| Status | Description                                                               |
| ------ | ------------------------------------------------------------------------- |
| 400    | Failed Signature Check                                                    |
| 404    | Exchange not found                                                        |
| 409    | Order already exists                                                      |
| 409    | Order not allowed (e.g. bc exchange was closed or bc no quote exists yet) |

## Submit Close

### Description
Closes the exchange. Indicates that Alice is no longer interested

### Endpoint
`POST /exchanges/:exchange_id/close`

### Protected
False

### Request Body
> [!IMPORTANT]
> See Close structure [here](../protocol/README.md#close)


### Response
| Status             | Body                  |
| ------------------ | --------------------- |
| `202: Accepted`    | N/A                   |
| `400: Bad Request` | `{ errors: Error[] }` |

### Errors
| Status | Description            |
| ------ | ---------------------- |
| 400    | Failed Signature Check |
| 404    | Exchange not found     |
| 409    | Close not allowed      |

---

## Get Exchange (DESCOPED)

### Description
Retrieves the messages specified by ID and messageType

### Endpoint
`GET /exchanges/:id`

### Protected
True

### Query Params
| Param         | Description                   |
| ------------- | ----------------------------- |
| `messageType` | filters the messages returned |


### Response

| Status             | Body                       |
| ------------------ | -------------------------- |
| `200: OK`          | `{ data: TbdexMessage[] }` |
| `400: Bad Request` | `{ errors: Error[] }`      |
| `404: Not Found`   | N/A                        |
| `403: Forbidden`   | N/A                        |

---

## List Exchanges

### Description
Returns an array of tbdex message arrays (a list of exchanges)

### Endpoint
`GET /exchanges`

### Protected
True

### Response
| Status             | Body                             |
| ------------------ | -------------------------------- |
| `200: OK.`         | `{ data: { TbdexMessage[][] } }` |
| `400: Bad Request` | `{ errors: Error[] }`            |
| `404: Not Found`   | N/A                              |
| `403: Forbidden`   | N/A                              |

### Query Params

| Param | Description              |
| ----- | ------------------------ |
| id    | exchange id(s) to return |

---

# References
* JSON:API spec: https://jsonapi.org/format/