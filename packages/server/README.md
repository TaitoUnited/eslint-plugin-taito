# eslint-plugin-taito-backend (template)

Eslint plugin for usage with the Taito United [Full Stack Template](https://github.com/TaitoUnited/full-stack-template) backend.

## Installation

Use [npm](https://www.npmjs.com/) or a compatibility tool to install.

```
$ npm install --save-dev eslint
```

### Requirements

- Node.js v8.10.0 or newer versions.
- ESLint v5.16.0 or newer versions.

## Usage

Write your config file such as `.eslintrc.yml`.

```yml
plugins:
  - xxxx
rules:
  xxxx/example-rule: error
```

See also [Configuring ESLint](https://eslint.org/docs/user-guide/configuring).

## Configs

- `xxxx/recommended` ... enables the recommended rules.

## Rules

<!--RULE_TABLE_BEGIN-->
### problem

| Rule ID | Description |    |
|:--------|:------------|:--:|
| [taito/authorize-service-calls](./docs/rules/authorize-service-calls.md) | All non-private service methods must be authorized | ⭐️ |

<!--RULE_TABLE_END-->

## Semantic Versioning Policy

This plugin follows [Semantic Versioning](http://semver.org/) and [ESLint's Semantic Versioning Policy](https://github.com/eslint/eslint#semantic-versioning-policy).

## Changelog

- [GitHub Releases]()

## Contributing

Welcome your contribution!

See also [ESLint Contribution Guide](https://eslint.org/docs/developer-guide/contributing/).

### Development Tools

- `npm test` runs tests.
- `npm run update` updates the package version. And it updates `src/configs/recommended.ts`, `lib/index.ts`, and `README.md`'s rule table. See also [npm version CLI command](https://docs.npmjs.com/cli/version).
- `npm run add-rule <RULE_ID>` creates three files to add a new rule.
