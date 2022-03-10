package io.tbd.tbdex.did.resolver;

import foundation.identity.did.DIDDocument;

public class DIDResolutionResult {
    private DIDDocumentMetadata didDocumentMetadata;
    private DIDResolutionMetadata resolutionMetadata;
    private DIDDocument didDocument;

    private DIDResolutionResult() {}

    public static class Builder {
        DIDResolutionResult instance;
        public Builder() {
            this.instance = new DIDResolutionResult();
        }

        public Builder didDocumentMetadata(DIDDocumentMetadata didDocumentMetadata) {
            this.instance.didDocumentMetadata = didDocumentMetadata;

            return this;
        }

        public Builder didResolutionMetadata(DIDResolutionMetadata resolutionMetadata) {
            this.instance.resolutionMetadata = resolutionMetadata;

            return this;
        }

        public Builder didDocument(DIDDocument didDocument) {
            this.instance.didDocument = didDocument;

            return this;
        }

        public DIDResolutionResult build() {
            return this.instance;
        }
    }
}
