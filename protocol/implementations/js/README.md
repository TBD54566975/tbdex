# TS/JS type implementation of tbDEX protocol

## How to publish and use new versions of `@tbd54566975/tbdex`:

1. Check out your branch `git checkout -b ${your_branch_name}`

2. Make changes as necessary in the `src` directory. Open a PR for review.

3. After the PR has been approved, _before_ merging to main, bump the version by running this npm command: `npm version ${major}.${minor}.${patch}`, i.e. `npm version 0.0.3`

4. Merge the PR. This will run the Github Actions which you can see [here]. You can find the specifics of the workflows in `.github/workflows` folder of this repo.

5. After merging the PR, navigate to Github's `tags` section of this repo [here](https://github.com/TBD54566975/tbdex-protocol/tags)
![Tags](./images/github_tags.png)

6. Click on `Releases` button and click `Draft a new release`.

7. Click on `Choose a tag`, then create a new tag with the version number matching from step 3. The release title is also the same version number, i.e. `v0.0.3`
![New release](./images/new_release.png)

8. Click `Generate release notes`. This will auto-populate a list of all PRs merged to main since the last release.
![Generated release notes](./images/generated_release_notes.png)

9. Click `Publish release`, which will kick off the `Release to NPM Registry` action, which you can see [here](https://github.com/TBD54566975/tbdex-protocol/actions/workflows/release-npm.yml)

10. After the github action is successfully completed, you will have a new version of `@tbd54566975/tbdex` available in the [NPM registry](https://www.npmjs.com/package/@tbd54566975/tbdex).

11. Reference the new version in your package.json under `dependencies`:

```js
{
  "name": "your-project",
  "type": "module",
  "version": "0.0.1",
  "dependencies": {
    "@tbd54566975/tbdex": "^0.0.2",
...
```