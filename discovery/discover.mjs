

const BASE_URL = "https://ion.tbd.engineering";
const DID_TYPE_ENDPOINT = "/didtype/1669";
const IDENTIFIER_PREFIX = "/identifiers/";

async function fetchDIDList() {
  const response = await fetch(BASE_URL + DID_TYPE_ENDPOINT);
  if (!response.ok) {
    throw new Error('Failed to fetch DID list');
  }
  return await response.json();
}

async function fetchDIDData(did) {
  console.log(BASE_URL + IDENTIFIER_PREFIX + did);
  const response = await fetch(BASE_URL + IDENTIFIER_PREFIX + did);
  if (!response.ok) {
    throw new Error('Failed to fetch DID data for ' + did);
  }
  return await response.json();
}

async function fetchPFIServiceEndpoints() {
  const ids = await fetchDIDList();
  const promises = ids.map(id => {
    const ionDid = "did:ion:" + id;
    return fetchDIDData(ionDid);
  });

  const didDataList = await Promise.all(promises);

  const pfiServiceEndpoints = didDataList.reduce((results, didData) => {
    const services = didData.didDocument.service;
    const pfiServices = services.filter(service => service.type === 'PFI');
    
    if (pfiServices.length > 0) {
      results.push({
        did: didData.didDocument.id,
        serviceEndpoint: pfiServices[0].serviceEndpoint
      });
    }

    return results;
  }, []);

  return pfiServiceEndpoints;
}

// Exporting the function to be used in other parts of your app
export default fetchPFIServiceEndpoints;


const endpoints = await fetchPFIServiceEndpoints();
console.log(endpoints);