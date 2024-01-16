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
- [Query Params](#query-params)
  - [Pagination](#pagination)
    - [Example](#example-1)
- [Idempotency](#idempotency)
- [Offerings](#offerings)
  - [List Offerings](#list-offerings)
    - [Description](#description)
    - [Endpoint](#endpoint)
    - [Authentication](#authentication)
    - [Authorization](#authorization)
    - [Query Params](#query-params-1)
    - [Response](#response)
- [Exchanges](#exchanges)
  - [Submit RFQ](#submit-rfq)
    - [Endpoint](#endpoint-1)
    - [Authentication](#authentication-1)
    - [Authorization](#authorization-1)
    - [Request Body](#request-body)
    - [Response](#response-1)
    - [Errors](#errors)
  - [Get Quote](#get-quote)
    - [Endpoint](#endpoint-2)
    - [Response](#response-2)
    - [Response Body](#response-body)
  - [Submit Order](#submit-order)
    - [Endpoint](#endpoint-3)
    - [Order Request Body](#order-request-body)
    - [Response](#response-3)
    - [Errors](#errors-1)
  - [Submit Close](#submit-close)
    - [Description](#description-1)
    - [Endpoint](#endpoint-4)
    - [Request Body](#request-body-1)
    - [Response](#response-4)
    - [Errors](#errors-2)
  - [Get Exchange (DESCOPED)](#get-exchange-descoped)
    - [Description](#description-2)
    - [Authentication](#authentication-2)
    - [Endpoint](#endpoint-5)
    - [Query Params](#query-params-2)
    - [Response](#response-5)
  - [List Exchanges](#list-exchanges)
    - [Description](#description-3)
    - [Authentication](#authentication-3)
    - [Endpoint](#endpoint-6)
    - [Response](#response-6)
    - [Query Params](#query-params-3)
  - [List Balances](#list-balances)
    - [Description](#description-4)
    - [Authentication](#authentication-4)
    - [Endpoint](#endpoint-7)
    - [Response](#response-7)
    - [Example](#example-2)
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


| Field              | Required (Y/N) | Description               |
| ------------------ | -------------- | ------------------------- |
| `errors`           |      Y         | List of `Error` objects   |


## Error object
| Field              | Required (Y/N) | Description                                                                                                                                                                                            |
| ------------------ | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `id`               |      N         | A unique identifier for this particular occurrence of the problem.                                                                                                                                     |
| `status`           |      N         | The HTTP status code applicable to this problem, expressed as a string value. This SHOULD be provided.                                                                                                 |
| `code`             |      N         | An application-specific error code, expressed as a string value.                                                                                                                                       |
| `title`            |      N         | A short, human-readable summary of the problem that SHOULD NOT change from occurrence to occurrence of the problem, except for purposes of localization.                                               |
| `detail`           |      Y         | A human-readable explanation specific to this occurrence of the problem. Like `title`, this field’s value can be localized.                                                                            |
| `source`           |      N         | An object containing references to the primary source of the error. It should include the `pointer`, `parameter`, or `header` members or be omitted.                                                   |
| `source.pointer`   |      N         | A JSON Pointer to the value in the request document that caused the error. This MUST point to a value in the request document that exists; if it doesn’t, the client SHOULD simply ignore the pointer. |
| `source.parameter` |      N         | A string indicating which URI query parameter caused the error.                                                                                                                                        |
| `source.header`    |      N         | A string indicating the name of a single request header which caused the error.                                                                                                                        |
| `meta`             |      N         | A meta object containing non-standard meta-information about the error.                                                                                                                                |

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

# Offerings

The [`Offering`](../README.md#offering) resource is used to convey the currency pairs a PFI is _offering_. It includes information about payment methods and associated fees.

## List Offerings

### Description
Used to fetch offerings from a PFI


### Endpoint
`GET /offerings`

### Authentication
No authentication required.

### Authorization
No authorization required. Offerings are publicly accessible

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

## Submit RFQ

### Endpoint
`POST /exchanges/:exchange_id/rfq`

### Authentication
Refer to [Signature Verification Section]() of the tbDEX spec  
### Authorization
No Authorization required to submit an RFQ

### Request Body
> [!IMPORTANT]
> See RFQ structure [here](../README.md#rfq-request-for-quote)

### Response
| Status             | Body                  |
| ------------------ | --------------------- |
| `202: Accepted`    | N/A                   |
| `400: Bad Request` | `{ errors: Error[] }` |

### Errors
| Status | Description             |
| ------ | ----------------------- |
| 400    | Validation error(s)     |
| 400    | Failed Signature Check  |
| 404    | Exchange not found      |
| 409    | RFQ already exists      |
| 409    | Exchange already exists |

## Get Quote
### Endpoint
`GET /exchanges/:exchange_id/?messageType=quote`

### Response
| Status             | Body                              |
| ------------------ | --------------------------------- |
| `200: OK`          | `{ data: TbdexMessage<Quote>[] }` |
| `400: Bad Request` | `{ errors: Error[] }`             |

### Response Body
> [!IMPORTANT]
> See Quote structure [here](../README.md#quote)

## Submit Order

### Endpoint
`POST /exchanges/:exchange_id/order`

### Order Request Body
> [!IMPORTANT]
> See Order structure [here](../README.md#order)


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

### Request Body
> [!IMPORTANT]
> See Close structure [here](../README.md#close)


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

### Authentication
Uses DID authn via Bearer token in header.

### Endpoint
`GET /exchanges/:id`


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
Returns an array of tbdex message arrays

### Authentication
Uses DID authn via Bearer token in header.

### Endpoint
`GET /exchanges`

### Response
| Status             | Body                                   |
| ------------------ | -------------------------------------- |
| `200: OK.     `    | `{ data: { TbdexMessage[][] } }` |
| `400: Bad Request` | `{ errors: Error[] }`                  |
| `404: Not Found`   | N/A                                    |
| `403: Forbidden`   | N/A                                    |

### Query Params

| Param | Description              |
| ----- | ------------------------ |
| id    | exchange id(s) to return |

---

## List Balances
This endpoint is *OPTIONAL*. It is only relevant for PFIs which expose a stored balance functionality either for institutional or retail customers.

### Description
Returns an array of balance amounts for each currency held by the caller.  

### Authentication
Uses DID authn via Bearer token in header.

### Endpoint
`GET /balances`

### Response
| Status             | Body                                   |
| ------------------ | -------------------------------------- |
| `200: OK.     `    | `{ data: { Balance[] } }` |
| `400: Bad Request` | `{ errors: Error[] }`                  |
| `404: Not Found`   | N/A                                    |
| `403: Forbidden`   | N/A                                    |

#### Example

```json
{
  "data": [
    {
      /** ISO 4217 currency code or widely adopted cryptocurrency code as string */
      "currency": "USD", 
      /** same format used to represent currency values across messages */
      "available": "400.00",
    }
  ]
}

```

# References
* JSON:API spec: https://jsonapi.org/format/