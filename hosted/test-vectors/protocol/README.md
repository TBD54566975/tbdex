## Protocol Test Vectors
This directory contains test vectors containing a collection of valid and invalid TBDex Messages and Resources. Implementations can use these vectors to ensure that they **accept valid messages** and **reject invalid messages**.

### Using Test Vectors
It is recommended to add this repo as a git submodule to your implementation repo. See [this PR](https://github.com/TBD54566975/tbdex-js/pull/129) in `tbdex-js` for an example.

### Test Vector Structure
Each vector file must follow the schema in `vectors.json.schema`.
1. `description` : A human readable description of the scenario being tested.
2. `input` : A stringified JSON TBDex object
3. `output` : If the input contains a valid TBDex object: A JSON object of the the expected parsed input. Otherwise, omit.
4. `error` : boolean. True if an error is expected, false if not.

### Generating Test Vectors
1. Create a new test vector file in `hosted/test-vectors/protocol/vectors/`
2. Use an implementation of TBDex that supports the desired scenario to create the `input`, `output`, and `error`.
3. Validate the test vector structure.
  a. Set up with `cd hosted/test-vectors/protocol & npm install`.
  b. Run with `npm run validate-vectors`.
4. Test the updated vectors against at least two implementations of TBDex.
5. Once you are confident that your test vector works as desired, open a PR against `tbdex`.
