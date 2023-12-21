## Protocol Test Vectors
This directory contains test vectors containing a collection of valid and invalid TBDex Messages and Resources. Implementations can use these vectors to ensure that they **accept valid messages** and **reject invalid messages**.

### Using Test Vectors
Implementations of the TBDex protocol should fetch the compiled list of test vectors from `github.com/tbd54566975/tbdex/blob/<git-ref>/hosted/test-vectors/protocol/vectors.json` where `<git-ref>` is the version of TBDex that the implementation supports.

`vectors.json` is an object with one property called `vectors`, which is an array of individual test vectors. Each vector complies with JSON schema `vectors.schema.json`.
1. `description` : A human readable description of the scenario being tested.
2. `input` : A stringified JSON TBDex object
3. `output` : If the input contains a valid TBDex object: A JSON object of the the expected parsed input.
4. `error` : If the input contains an invalid TBDex object: A JSON object with a boolean called `present` which is always `true` and an optional field `detail` which contains a substring of the expected error message.

NOTE: `output` and `error` are mutually exclusive.

### Generating Test Vectors
1. Create a new test vector file in `hosted/test-vectors/protocol/vectors`
2. Use an implementation of TBDex that supports the desired scenario to create the `input` and `output` if applicable. Specify the `error` if applicable.
3. Run the test vector compilation script to add your new vector to the master vector file at `hosted/test-vectors/protocol/vectors.json`.
  a. Set up with `cd hosted/test-vectors/protocol & npm install`.
  b. Run with `npm run compile-vectors.
4. Push your branch of `tbdex`. You can get the URL of your branch on GH to use the new test vector in your implementation repo.
5. Once you are confident that your test vector works as desired, open a PR on `tbdex`.