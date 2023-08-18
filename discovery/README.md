# Discovery of PFIs

Paritipating Financial Institutions (PFIs) will likely wish to make their presence known to the public.

This part of the protocol shows how this can be done in a decentralized fashion. 

## Service Endpoints

For a PFI to be discoverable, it must publish a DID Document with a service endpoint of type "PFI" at a minimum (from serviceEndpoints section of DID Document):

```json
      {
        id:'pfi',
        type: 'PFI',
        serviceEndpoint: 'https://pfi.mic4.com',
      }
```      

### Optional currency pair declaration

To help clients find the right PFI for their needs, a PFI may also declare what currency pairs they are able to offer:

```json
      {
        id:'pfi',
        'type': 'PFI',
        'serviceEndpoint': 'https://pfi.mic4.com AUD-USD,AUD-TZN,USD-BTC',
      },
```

This is a comma seperated list of source-target currency pairs which a client may choose to use to display following the serviceEndpoint. The PFI has a formal offer protocol but this can be used to accelerate the discovery process.

# Examples

To test out the example code included here, you will need to install the dependencies:

```bash
npm install @decentralized-identity/ion-tools
```


## Sample usage

```node discover.js```

This will provide a list of PFIs. This uses a did:ion type of `1669` (16=P, 6=F, 9=I) to find all PFIs (and check they have a PFI type serviceEndpoint)



```node create-and-anchor.js```

This will create a new DID and anchor it permanently to the bitcoin blockchain via sidetree and ION. The DID (including private key) will be saved in a json file in the same directory.




