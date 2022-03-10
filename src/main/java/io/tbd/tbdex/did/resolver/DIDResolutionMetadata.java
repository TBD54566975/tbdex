package io.tbd.tbdex.did.resolver;

public class DIDResolutionMetadata {
    String contentType;
    DIDResolutionErrorCode error;

    public String contentType() {
        return contentType;
    }

    public DIDResolutionErrorCode error() {
        return error;
    }

    private DIDResolutionMetadata() {}

    public static class Builder {
        DIDResolutionMetadata instance;

        public Builder() {
            this.instance = new DIDResolutionMetadata();
        }

        public Builder error(DIDResolutionErrorCode errorCode) {
            this.instance.error = errorCode;

            return this;
        }

        public Builder contentType(String contentType) {
            this.instance.contentType = contentType;

            return this;
        }

        public DIDResolutionMetadata build() {
            return instance;
        }
    }
}
