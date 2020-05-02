#### [View on GitHub](https://github.com/decentralized-identity/SchnorrSecp256k1Signature2019)

![CI](https://github.com/decentralized-identity/SchnorrSecp256k1Signature2019/workflows/CI/badge.svg)

Relies on [bitcoin-ts](https://github.com/bitauth/bitcoin-ts) for secp256k1 crypto.

#### Relies on undrafted / unoffical JWS alg:

| JOSE Alg | COSE Alg Value                 | Description                                         | Recommended |
| -------- | ------------------------------ | --------------------------------------------------- | ----------- |
| SS256K   | TBD (requested assignment -48) | Schnorr signature using secp256k1 curve and SHA-256 | Yes         |

> JSON-LD 1.1 is being formally specified in the W3C JSON-LD Working Group. To participate in this work, please join the W3C and then [join the Working Group](https://www.w3.org/2018/json-ld-wg/).

- [Latest JSON-LD Context](https://identity.foundation/SchnorrSecp256k1Signature2019/contexts/schnorr-v1.json)

### Suite Details

Per [ld-signatures](https://w3c-ccg.github.io/ld-signatures/#signature-suites), this Signature Suite defines the following:

```json
{
  "id": "https://identity.foundation/SchnorrSecp256k1Signature2019#SchnorrSecp256k1Signature2019",
  "type": "SignatureSuite",
  "canonicalizationAlgorithm": "https://w3id.org/security#URDNA2015",
  "digestAlgorithm": "https://www.ietf.org/assignments/jwa-parameters#SHA256",
  "signatureAlgorithm": "https://tools.ietf.org/html/rfc7515"
}
```

### Terminology

<h4 id="SS256K"><a href="#SS256K">SS256K</a></h4>

This suite uses detached JWS using alg "SS256K" an unregistered, experimental Schnorr over secp256k1. Please review the details below.

- [Detached JWS RFC 7515](https://tools.ietf.org/html/rfc7515#appendix-F)
- [ES256K](https://tools.ietf.org/html/draft-ietf-cose-webauthn-algorithms-04#section-3.2)

SS256K is just ES256K but uses Schnorr instead of ECDSA.

The detached JWS must have the following header:

```json
{
  "alg": "SS256K",
  "b64": false,
  "crit": ["b64"]
}
```

<h4 id="SchnorrSecp256k1Signature2019"><a href="#SchnorrSecp256k1Signature2019">SchnorrSecp256k1Signature2019</a></h4>

This is what a proof with `SchnorrSecp256k1Signature2019` looks like:

```json
{
  "type": "SchnorrSecp256k1Signature2019",
  "created": "2020-04-11T21:07:06Z",
  "verificationMethod": "did:example:123#vm-3",
  "proofPurpose": "assertionMethod",
  "jws": "eyJhbGciOiJFUzI1NkstUiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..pp9eiLCMfN4EfSB3cbl3UxJ4TtgUaTfByDaaB6IZbXsnvIy5AUIFjbgaiFNtq9-3f8mP7foD_HXpjrdWZfzlwAE"
}
```

## Local Development

This project was bootstrapped with [TSDX](https://github.com/jaredpalmer/tsdx).

Below is a list of commands you will probably find useful.

### `npm start` or `yarn start`

Runs the project in development/watch mode. Your project will be rebuilt upon changes. TSDX has a special logger for you convenience. Error messages are pretty printed and formatted for compatibility VS Code's Problems tab.

<img src="https://user-images.githubusercontent.com/4060187/52168303-574d3a00-26f6-11e9-9f3b-71dbec9ebfcb.gif" width="600" />

Your library will be rebuilt if you make edits.

### `npm run build` or `yarn build`

Bundles the package to the `dist` folder.
The package is optimized and bundled with Rollup into multiple formats (CommonJS, UMD, and ES Module).

<img src="https://user-images.githubusercontent.com/4060187/52168322-a98e5b00-26f6-11e9-8cf6-222d716b75ef.gif" width="600" />

### `npm test` or `yarn test`

Runs the test watcher (Jest) in an interactive mode.
By default, runs tests related to files changed since the last commit.
