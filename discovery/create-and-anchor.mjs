
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
        id:'pfi',
        'type': 'PFI',
        'serviceEndpoint': 'https://test-pfi.com',
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

// Anchor the create request
let anchorResponse = await anchor(createRequest, 
  { // use a fake challengeEndpoint as the one MSFT hosted is now closed down (and was defaulted in the library)
    challengeEndpoint: "https://gist.githubusercontent.com/michaelneale/ff647d64f1bd49c7e3beed350ea5c265/raw/ab8183f469fbda3f89b83ce55a7701809122b348/challenge.json", 
    // the resolution endpoint is the one we want to use
    solutionEndpoint: endpoint + '/operations' });

console.log('Create Request');
console.log(createRequest);

console.log('Anchor Response');
console.log(anchorResponse);

// Store the key material and source data of all operations that have been created for the DID
let ionOps = await did.getAllOperations();
await writeFile('./ion-did-ops-v1.json', JSON.stringify({ ops: ionOps }));