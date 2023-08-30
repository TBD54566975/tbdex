import type { DidDocument, DidService, VerificationMethod } from '@web5/dids'

import { DidResolver as Web5DidResolver, DidKeyMethod, DidIonMethod, utils as didUtils } from '@web5/dids'

/** can be used to resolve did:ion and did:key DIDs */
export const DidResolver = new Web5DidResolver({
  didResolvers: [DidIonMethod, DidKeyMethod]
})

/**
 * resolves the DID provided
 * @param did - the DID to resolve
 * @returns {DidDocument}
 */
export async function resolveDid(did: string): Promise<DidDocument> {
  const { didResolutionMetadata, didDocument } = await DidResolver.resolve(did)

  console.log(JSON.stringify(await DidResolver.resolve(did)))
  // no didresolution metadata, get this back instead:
  // {
  //   "@context": "https://w3id.org/did-resolution/v1",
  //   "didDocument": {
  //     "id": "did:ion:EiB_LMRZGHzGFX4LC1g8eObOUGY9ZlWdXHsBFpOyhheAzQ:eyJkZWx0YSI6eyJwYXRjaGVzIjpbeyJhY3Rpb24iOiJyZXBsYWNlIiwiZG9jdW1lbnQiOnsicHVibGljS2V5cyI6W3siaWQiOiJkd24tc2lnIiwicHVibGljS2V5SndrIjp7ImNydiI6IkVkMjU1MTkiLCJrdHkiOiJPS1AiLCJ4IjoiS09QT2owSmRNWU41c0MyT0RjZzMySVAtcjNLell3dENWelZUckUwN24wdyJ9LCJwdXJwb3NlcyI6WyJhdXRoZW50aWNhdGlvbiJdLCJ0eXBlIjoiSnNvbldlYktleTIwMjAifV0sInNlcnZpY2VzIjpbXX19XSwidXBkYXRlQ29tbWl0bWVudCI6IkVpQVdKYWlZYWFHYllrMWFET0JXSmhJb2Rnd1ozNW41RzdXN0dhaHUtV1dfbGcifSwic3VmZml4RGF0YSI6eyJkZWx0YUhhc2giOiJFaURyMmQzRnVnZDJIM0d6VU1oemN4OWQwZWE5V1hlU3RRMHp3RHFYeUlRVEx3IiwicmVjb3ZlcnlDb21taXRtZW50IjoiRWlCU3c2T3RWRG54eHY1YUs5Z2FjNm1UejRtTlZBaVBkQ2NFQWZsYWVobTI3QSJ9fQ",
  //     "@context": [
  //       "https://www.w3.org/ns/did/v1",
  //       {
  //         "@base": "did:ion:EiB_LMRZGHzGFX4LC1g8eObOUGY9ZlWdXHsBFpOyhheAzQ:eyJkZWx0YSI6eyJwYXRjaGVzIjpbeyJhY3Rpb24iOiJyZXBsYWNlIiwiZG9jdW1lbnQiOnsicHVibGljS2V5cyI6W3siaWQiOiJkd24tc2lnIiwicHVibGljS2V5SndrIjp7ImNydiI6IkVkMjU1MTkiLCJrdHkiOiJPS1AiLCJ4IjoiS09QT2owSmRNWU41c0MyT0RjZzMySVAtcjNLell3dENWelZUckUwN24wdyJ9LCJwdXJwb3NlcyI6WyJhdXRoZW50aWNhdGlvbiJdLCJ0eXBlIjoiSnNvbldlYktleTIwMjAifV0sInNlcnZpY2VzIjpbXX19XSwidXBkYXRlQ29tbWl0bWVudCI6IkVpQVdKYWlZYWFHYllrMWFET0JXSmhJb2Rnd1ozNW41RzdXN0dhaHUtV1dfbGcifSwic3VmZml4RGF0YSI6eyJkZWx0YUhhc2giOiJFaURyMmQzRnVnZDJIM0d6VU1oemN4OWQwZWE5V1hlU3RRMHp3RHFYeUlRVEx3IiwicmVjb3ZlcnlDb21taXRtZW50IjoiRWlCU3c2T3RWRG54eHY1YUs5Z2FjNm1UejRtTlZBaVBkQ2NFQWZsYWVobTI3QSJ9fQ"
  //       }
  //     ],
  //     "service": [],
  //     "verificationMethod": [
  //       {
  //         "id": "#dwn-sig",
  //         "controller": "did:ion:EiB_LMRZGHzGFX4LC1g8eObOUGY9ZlWdXHsBFpOyhheAzQ:eyJkZWx0YSI6eyJwYXRjaGVzIjpbeyJhY3Rpb24iOiJyZXBsYWNlIiwiZG9jdW1lbnQiOnsicHVibGljS2V5cyI6W3siaWQiOiJkd24tc2lnIiwicHVibGljS2V5SndrIjp7ImNydiI6IkVkMjU1MTkiLCJrdHkiOiJPS1AiLCJ4IjoiS09QT2owSmRNWU41c0MyT0RjZzMySVAtcjNLell3dENWelZUckUwN24wdyJ9LCJwdXJwb3NlcyI6WyJhdXRoZW50aWNhdGlvbiJdLCJ0eXBlIjoiSnNvbldlYktleTIwMjAifV0sInNlcnZpY2VzIjpbXX19XSwidXBkYXRlQ29tbWl0bWVudCI6IkVpQVdKYWlZYWFHYllrMWFET0JXSmhJb2Rnd1ozNW41RzdXN0dhaHUtV1dfbGcifSwic3VmZml4RGF0YSI6eyJkZWx0YUhhc2giOiJFaURyMmQzRnVnZDJIM0d6VU1oemN4OWQwZWE5V1hlU3RRMHp3RHFYeUlRVEx3IiwicmVjb3ZlcnlDb21taXRtZW50IjoiRWlCU3c2T3RWRG54eHY1YUs5Z2FjNm1UejRtTlZBaVBkQ2NFQWZsYWVobTI3QSJ9fQ",
  //         "type": "JsonWebKey2020",
  //         "publicKeyJwk": {
  //           "crv": "Ed25519",
  //           "kty": "OKP",
  //           "x": "KOPOj0JdMYN5sC2ODcg32IP-r3KzYwtCVzVTrE07n0w"
  //         }
  //       }
  //     ],
  //     "authentication": [
  //       "#dwn-sig"
  //     ]
  //   },
  //   "didDocumentMetadata": {
  //     "method": {
  //       "published": false,
  //       "recoveryCommitment": "EiBSw6OtVDnxxv5aK9gac6mTz4mNVAiPdCcEAflaehm27A",
  //       "updateCommitment": "EiAWJaiYaaGbYk1aDOBWJhIodgwZ35n5G7W7Gahu-WW_lg"
  //     },
  //     "equivalentId": [
  //       "did:ion:EiB_LMRZGHzGFX4LC1g8eObOUGY9ZlWdXHsBFpOyhheAzQ"
  //     ]
  //   }
  // }

  if (didResolutionMetadata.error) {
    throw new Error(`Failed to resolve DID: ${did}. Error: ${didResolutionMetadata.error}`)
  }

  return didDocument
}

export type DidResource = DidDocument | VerificationMethod | DidService

/**
 * Dereferences a DID URL according to [specification](https://www.w3.org/TR/did-core/#did-url-dereferencing).
 * See also: [DID URL Syntax](https://www.w3.org/TR/did-core/#did-url-syntax)
 *
 * **Note**: Support is limited to did#fragment within [Verification Method](https://www.w3.org/TR/did-core/#verification-methods)
 * and [Service](https://www.w3.org/TR/did-core/#services) only
 * @param didUrl - the did url to dereference
 * @returns the dereferenced resource
 * @throws if DID URL cannot be parsed
 * @throws if DID cannot be resolved
 */
export async function deferenceDidUrl(didUrl: string): Promise<DidResource> {
  const parsedDid = didUtils.parseDid({ didUrl })
  if (!parsedDid) {
    throw new Error('failed to parse did')
  }

  const didDocument = await resolveDid(didUrl)

  // return the entire DID Document if no fragment is present on the did url
  if (!parsedDid.fragment) {
    return didDocument
  }

  const { service, verificationMethod } = didDocument

  // create a set of possible id matches. the DID spec allows for an id to be the entire did#fragment or just #fragment.
  // See: https://www.w3.org/TR/did-core/#relative-did-urls
  // using a set for fast string comparison. DIDs can be lonnng.
  // TODO: check to see if parsedDid.fragment includes a '#'
  const idSet = new Set([didUrl, parsedDid.fragment])

  for (let vm of verificationMethod) {
    if (idSet.has(vm.id)) {
      return vm
    }
  }

  for (let svc of service) {
    if (idSet.has(svc.id)) {
      return svc
    }
  }
}

/**
 * type guard for {@link VerificationMethod}
 * @param didResource
 * @returns
 */
export function isVerificationMethod(didResource: DidResource): didResource is VerificationMethod {
  return 'id' in didResource && 'type' in didResource && 'controller' in didResource
}