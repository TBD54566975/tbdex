## Protocol Test Vectors
This directory contains test vectors containing a collection of valid and invalid TBDex Messages and Resources. Implementations can use these vectors to ensure that they **accept valid messages** and **reject invalid messages**.

### Using Test Vectors
Implementations of the TBDex protocol can fetch the vectors using `curl` where `$MY_GIT_REF` is a git ref in the `tbdex` repo.
```sh
curl -L \                                                                                                                                                                                                                                                                                                    
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
"https://api.github.com/repos/TBD54566975/tbdex/contents/specs/?ref=$MY_GIT_REF"
```

Each vector file must follow the schema in `vectors.json.schema`.
1. `description` : A human readable description of the scenario being tested.
2. `input` : A stringified JSON TBDex object
3. `output` : If the input contains a valid TBDex object: A JSON object of the the expected parsed input. Otherwise, omit.
4. `error` : boolean. True if an error is expected, false if not.

### Generating Test Vectors
1. Create a new test vector file in `hosted/test-vectors/protocol/vectors`
2. Use an implementation of TBDex that supports the desired scenario to create the `input` and `output` if applicable. Specify the `error` if applicable.
3. Run the test vector compilation script to add your new vector to the master vector file at `hosted/test-vectors/protocol/vectors.json`.
  a. Set up with `cd hosted/test-vectors/protocol & npm install`.
  b. Run with `npm run validate-vectors`.
4. Test the updated vectors against an implmentation of TBDex either locally or by pushing your branch of `tbdex` and getting the URL of your branch on GH.
5. Once you are confident that your test vector works as desired, open a PR on `tbdex`.