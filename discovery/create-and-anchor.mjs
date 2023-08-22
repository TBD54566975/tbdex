
import { anchor, DID, generateKeyPair } from '@decentralized-identity/ion-tools';
// import { anchor, DID, generateKeyPair } from './dist/esm/index.js';

import { writeFile } from 'fs/promises';

// Generate keys and ION DID
let authnKeys = await generateKeyPair();
let did = new DID({
  content: {
    publicKeys: [
      {
        id: 'key-1',
        type: 'EcdsaSecp256k1VerificationKey2019',
        publicKeyJwk: authnKeys.publicJwk,
        purposes: [ 'authentication' ]
      }
    ],
    services: [
      {
        id: 'domain-1',
        type: 'LinkedDomains',
        serviceEndpoint: 'https://foo.example.com'
      },
      {
        id:'pfi',
        'type': 'PFI',
        'serviceEndpoint': 'https://pfi.mic4.com',
      },
    ]
  }
});

// Generate and publish create request to an ION node with given didtype
let createRequest = await did.generateRequest(0);
createRequest.suffixData.type = '1669'; // PFI a 16 , 6 , 9

// Testnet
// const endpoint = 'https://ion-test.tbddev.org'

// Dev Mainnet
// const endpoint = 'https://ion.tbddev.org'

// Prod Mainnet
const endpoint = 'https://ion.tbd.engineering';

let anchorResponse = await anchor(createRequest, { solutionEndpoint: endpoint + '/operations' });

console.log('Create Request');
console.log(createRequest);

console.log('Anchor Response');
console.log(anchorResponse);

// Store the key material and source data of all operations that have been created for the DID
let ionOps = await did.getAllOperations();
await writeFile('./ion-did-ops-v1.json', JSON.stringify({ ops: ionOps }));