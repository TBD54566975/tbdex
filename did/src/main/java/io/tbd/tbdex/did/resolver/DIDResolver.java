package io.tbd.tbdex.did.resolver;

public interface DIDResolver {
    DIDResolutionResult resolve(String did);
}
