package io.tbd.tbdex.did.resolver;

/**
 * An enum containing all the possible Resolution error codes that can be present in {@link DIDResolutionMetadata}
 * as per the did-core spec
 * @see <a href="https://www.w3.org/TR/did-core/#did-resolution-metadata">did-core spec</a>
 */
public enum DIDResolutionErrorCode {
    // The DID supplied to the DID resolution function does not conform to valid syntax.
    INVALID_DID("invalidDid"),
    // The DID resolver was unable to find the DID document resulting from this resolution request
    NOT_FOUND("notFound"),
    // the representation requested via the `accept` input metadata property is not supported
    // by the DID method and/or DID resolver implementation.
    REPR_NOT_SUPPORTED("representationNotSupported");

    private final String errorCode;

    DIDResolutionErrorCode(String errorCode) {
        this.errorCode = errorCode;
    }

    public String getErrorCode() {
        return this.errorCode;
    }
}
