# Discovery of PFIs

Paritipating Financial Institutions (PFIs) will likely wish to make their presence known to the public.

This part of the protocol shows how this can be done in a decentralized fashion. 

## Service Endpoints

In general it is recommended for a PFI to be discoverable, it SHOULD publish a DID Document with a service endpoint of type "PFI" at a minimum (from serviceEndpoints section of DID Document):

```json
      {
        id:'pfi',
        type: 'PFI',
        serviceEndpoint: 'https://pfi.mic4.com',
      }
```    

This will expose a REST API at the serviceEndpoint which can be used to discover the PFI's capabilities and offers, make RFQs and tranact.

### Service Endpoint options

If it possible to use a did URI as the serviceEndpoint itself, for example:

```json
      {
        id:'pfi',
        type: 'PFI',
        serviceEndpoint: 'did:web:pfi.mic.com',
      }
```   

In this case, resolving the serviceEndpoint DID should return a DID Document with a serviceEndpoint with an id of "PFI" as above. This could allow registration of one did method to allow discovery (via ION) via another did method (say web) hosted by the PFI.

   
# Discovery with ION DID method

One of the uses of the ION DID method can be to allow discovery of types of DIDs, in particular: PFIs.
Using a did:ion type of `1669` (this number because: 16=P, 6=F, 9=I) means that all PFIs can advertise themselves in a permissionless and decentralized and uncensorable way using the ION did method.

This does not require that the PFI runs or uses an ION node, or a did:ion method exclusively, as described above the PFI can register a did:ion which has a serviceEndpoint of did:web and then use that to advertise its PFI serviceEndpoint via .well-known/did.json on their website (ie just register their precence with ION once).


## Discovering PFIs

```node discover.mjs```

This will provide a list of PFIs. This uses a did:ion type of `1669` (this number because: 16=P, 6=F, 9=I) to find all PFIs (and check they have a PFI type serviceEndpoint)

This is example code in javascript which can run in any environment, but could be implemented in any language. This would typically be used by an app looking for PFIs to transact with.



## Registering a PFI with the ION network

*Note*: this is a WIP and not yet fully functional, this code is made available as an example.

To test out the example code below, you will need to install the dependencies:

```bash
npm install @decentralized-identity/ion-tools
```


### Registering a PFI

```node create-and-anchor.mjs```

A PFI will create a did (at least once) and may choose to anchor it. This is example code to show how to do that but it is not required to do it with this library. 

This will create a new DID and anchor it permanently to the bitcoin blockchain via sidetree and ION. The DID (including private key) will be saved in a json file in the same directory.

### Registering a PFI that uses did:web

You don't have to use ION with your PFI to register its availability, you can instead use this script and register your PFI with a did:web method which is hosted on your website.

```node create-and-anchor-web.mjs```

Similar to the above, but uses a did:web as the serviceEndpoint, which is allowed as did:web is itself a URI.


