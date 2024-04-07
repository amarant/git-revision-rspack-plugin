# git-revision-rspack-plugin

<!-- [![npm version](https://badge.fury.io/js/git-revision-rspack-plugin.svg)](https://badge.fury.io/js/git-revision-rspack-plugin)
[![downloads](https://img.shields.io/npm/dm/git-revision-rspack-plugin.svg?style=flat-square)](https://www.npmjs.com/package/git-revision-rspack-plugin)
[![Code Climate](https://codeclimate.com/github/pirelenito/git-revision-rspack-plugin/badges/gpa.svg)](https://codeclimate.com/github/pirelenito/git-revision-rspack-plugin) -->

Simple [rspack](https://www.rspack.dev/) plugin that generates `VERSION` and `COMMITHASH` files during build based on a local [git](http://www.git-scm.com/) repository.

## Usage

Given a **rspack** project, install it as a local development dependency:

```bash
npm install --save-dev @amarant/git-revision-rspack-plugin
```

Then, simply configure it as a plugin in the rspack config:

```javascript
const { GitRevisionPlugin } = require('@amarant/git-revision-rspack-plugin')

module.exports = {
  plugins: [new GitRevisionPlugin()],
}
```

It outputs a `VERSION` based on [git-describe](http://www.git-scm.com/docs/git-describe) such as:

```
v0.0.0-34-g7c16d8b
```

A `COMMITHASH` such as:

```
7c16d8b1abeced419c14eb9908baeb4229ac0542
```

And (optionally [when branch is enabled](#branch-false)) a `BRANCH` such as:

```
master
```

<!-- ## Path Substitutions

It is also possible to use [path substitutions](https://webpack.js.org/configuration/output/#output-filename) on build to get the revision, version or branch as part of output paths.

- `[git-revision-version]`
- `[git-revision-hash]`
- `[git-revision-branch]` (only [when branch is enabled](#branch-false))
- `[git-revision-last-commit-datetime]`

Example:

```javascript
module.exports = {
  output: {
    publicPath: 'http://my-fancy-cdn.com/[git-revision-version]/',
    filename: '[name]-[git-revision-hash].js',
  },
}
``` -->

## Plugin API

The `VERSION`, `COMMITHASH`, `LASTCOMMITDATETIME` and `BRANCH` are also exposed through a public API.

Example using the [DefinePlugin](https://www.rspack.dev/config/plugins.html#defineplugin):

```javascript
const rspack = require('@rspack/core')
const { GitRevisionPlugin } = require('@amarant/git-revision-rspack-plugin')
const gitRevisionPlugin = new GitRevisionPlugin()

module.exports = {
  plugins: [
    gitRevisionPlugin,
    new rspack.DefinePlugin({
      VERSION: JSON.stringify(gitRevisionPlugin.version()),
      COMMITHASH: JSON.stringify(gitRevisionPlugin.commithash()),
      BRANCH: JSON.stringify(gitRevisionPlugin.branch()),
      LASTCOMMITDATETIME: JSON.stringify(gitRevisionPlugin.lastcommitdatetime()),
    }),
  ],
}
```

## Configuration

The plugin requires no configuration by default, but it is possible to configure it to support custom git workflows.

### `lightweightTags: false`

If you need [lightweight tags](https://git-scm.com/book/en/v2/Git-Basics-Tagging#_lightweight_tags) support, you may turn on `lightweightTags` option in this way:

```javascript
const { GitRevisionPlugin } = require('@amarant/git-revision-rspack-plugin')

module.exports = {
  plugins: [
    new GitRevisionPlugin({
      lightweightTags: true,
    }),
  ],
}
```

### `branch: false`

If you need branch name support, you may turn on `branch` option in this way:

```javascript
const { GitRevisionPlugin } = require('@amarant/git-revision-rspack-plugin')

module.exports = {
  plugins: [
    new GitRevisionPlugin({
      branch: true,
    }),
  ],
}
```

### `commithashCommand: 'rev-parse HEAD'`

To change the default `git` command used to read the value of `COMMITHASH`.

This configuration is not not meant to accept arbitrary user input and it is executed by the plugin without any sanitization.

```javascript
const { GitRevisionPlugin } = require('@amarant/git-revision-rspack-plugin')

module.exports = {
  plugins: [
    new GitRevisionPlugin({
      commithashCommand: 'rev-list --max-count=1 --no-merges HEAD',
    }),
  ],
}
```

### `versionCommand: 'describe --always'`

To change the default `git` command used to read the value of `VERSION`.

This configuration is not not meant to accept arbitrary user input and it is executed by the plugin without any sanitization.

```javascript
const { GitRevisionPlugin } = require('@amarant/git-revision-rspack-plugin')

module.exports = {
  plugins: [
    new GitRevisionPlugin({
      versionCommand: 'describe --always --tags --dirty',
    }),
  ],
}
```

### `branchCommand: 'rev-parse --abbrev-ref HEAD'`

To change the default `git` command used to read the value of `BRANCH`.

This configuration is not not meant to accept arbitrary user input and it is executed by the plugin without any sanitization.

```javascript
const { GitRevisionPlugin } = require('@amarant/git-revision-rspack-plugin')

module.exports = {
  plugins: [
    new GitRevisionPlugin({
      branchCommand: 'rev-parse --symbolic-full-name HEAD',
    }),
  ],
}
```

### `lastCommitDateTimeCommand: 'log -1 --format=%cI'`

To change the default `git` command used to read the value of `LASTCOMMITDATETIME`.

This configuration is not not meant to accept arbitrary user input and it is executed by the plugin without any sanitization.

```javascript
const { GitRevisionPlugin } = require('@amarant/git-revision-rspack-plugin')

module.exports = {
  plugins: [
    new GitRevisionPlugin({
      branchCommand: 'log -1 --format=%ci',
    }),
  ],
}
```
