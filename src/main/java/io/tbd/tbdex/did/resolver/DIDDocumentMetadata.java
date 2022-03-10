package io.tbd.tbdex.did.resolver;

/**
 * TODO: add documentation
 */
public class DIDDocumentMetadata {

    // indicate the timestamp of the Create operation
    // TODO: change type to something appropriate to represent an ISO8601 timestamp
    String created;

    // indicates the timestamp of the last Update operation for the document version which was
    // resolved
    // TODO: change type to something appropriate to represent an ISO8601 timestamp
    String updated;

    // indicates whether the DID has been deactivated
    boolean deactivated = false;

    // if the resolved document version is not the latest version of the document.
    // It indicates the timestamp of the next Update operation
    // TODO: change type to something appropriate to represent an ISO8601 timestamp
    String nextUpdate;

    // indicates the version of the last Update operation for the document version which
    // was resolved
    String versionId;

    // if the resolved document version is not the latest version of the document.
    // It indicates the version of the next Update operation.
    String nextVersionId;

    // @see https://www.w3.org/TR/did-core/#dfn-equivalentid
    String equivalentId;

    // @see https://www.w3.org/TR/did-core/#dfn-canonicalid
    String canonicalId;

    private DIDDocumentMetadata() {}

    public static class Builder {
        private DIDDocumentMetadata instance;

        public Builder() {
            this.instance = new DIDDocumentMetadata();
        }


        public Builder created(String created) {
            this.instance.created = created;

            return this;
        }

        public Builder updated(String updated) {
            this.instance.updated = updated;

            return this;
        }

        public Builder deactivated(boolean deactivated) {
            this.instance.deactivated = deactivated;

            return this;
        }

        public Builder nextUpdate(String nextUpdate) {
            this.instance.nextUpdate = nextUpdate;

            return this;
        }

        public Builder versionId(String versionId) {
            this.instance.versionId = versionId;

            return this;
        }

        public Builder nextVersionId(String nextVersionId) {
            this.instance.nextVersionId = nextVersionId;

            return this;
        }

        public Builder equivalentId(String equivalentId) {
            this.instance.equivalentId = equivalentId;

            return this;
        }

        public Builder canonicalId(String canonicalId) {
            this.instance.canonicalId = canonicalId;

            return this;
        }

        // TODO: implement `fromJson` method that parses a serialized JSON object into
        //       a `DIDDocumentMetadata`
    }
}
