import jsigs from 'jsonld-signatures';
import {
  SchnorrSecp256k1VerificationKey2019,
  SchnorrSecp256k1Signature2019,
  documentLoader,
} from '../src/index';

import { privateKeyJwk } from '../src/fixtures';

const { AssertionProofPurpose } = jsigs.purposes;

const vcjs = require('vc-js');

const key = new SchnorrSecp256k1VerificationKey2019({
  controller: 'did:example:123',
  privateKeyJwk,
});

const suite1 = new SchnorrSecp256k1Signature2019({ key });
const suite2 = new SchnorrSecp256k1Signature2019({});

const credential = {
  '@context': [
    'https://www.w3.org/2018/credentials/v1',
    'https://www.w3.org/2018/credentials/examples/v1',
    'https://identity.foundation/SchnorrSecp256k1Signature2019/contexts/schnorr-v1.json',
  ],
  id: 'http://example.gov/credentials/3732',
  type: ['VerifiableCredential', 'UniversityDegreeCredential'],
  issuer: {
    id: 'did:example:123',
  },
  issuanceDate: '2020-03-10T04:24:12.164Z',
  credentialSubject: {
    id: 'did:example:123',
    degree: {
      type: 'BachelorDegree',
      name: 'Bachelor of Science and Arts',
    },
  },
};

let verifiableCredential: any;

jest.setTimeout(10 * 1000);

describe('vc-js.sanity', () => {
  //   beforeAll(async () => {
  //     secp256k1 = await instantiateSecp256k1();
  //   });

  it('sign', async () => {
    verifiableCredential = await vcjs.issue({
      credential: { ...credential },
      suite: suite1,
      compactProof: false,
      documentLoader,
    });
    expect(verifiableCredential.proof.type).toBe(
      'SchnorrSecp256k1Signature2019'
    );
  });

  it('verify', async () => {
    const result = await vcjs.verifyCredential({
      credential: { ...verifiableCredential },
      suite: suite2,
      purpose: new AssertionProofPurpose(),
      compactProof: false,
      documentLoader,
    });
    expect(result.verified).toBe(true);
  });
});
