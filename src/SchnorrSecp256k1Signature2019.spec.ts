import SchnorrSecp256k1VerificationKey2019 from './SchnorrSecp256k1VerificationKey2019';
import SchnorrSecp256k1Signature2019 from './SchnorrSecp256k1Signature2019';

import { documentLoader, privateKeyJwk, exampleDoc, didDoc } from './fixtures';

import jsigs from 'jsonld-signatures';

const { AssertionProofPurpose } = jsigs.purposes;

const testJwk = async () => {
  const key = new SchnorrSecp256k1VerificationKey2019({
    controller: 'did:example:123',
    privateKeyJwk,
  });
  const signed = await jsigs.sign(
    { ...exampleDoc },
    {
      compactProof: false,
      documentLoader,
      purpose: new AssertionProofPurpose(),
      suite: new SchnorrSecp256k1Signature2019({
        key,
      }),
    }
  );
  // console.log(JSON.stringify(signed, null, 2));
  const res = await jsigs.verify(signed, {
    suite: new SchnorrSecp256k1Signature2019({
      key,
    }),

    compactProof: false,
    documentLoader,
    purpose: new AssertionProofPurpose(),
  });
  // Leave for development purposes
  if (!res.verified) {
    // tslint:disable-next-line:no-console
    console.log(res);
  }
  return expect(res.verified).toBe(true);
};

describe('test supported key types', () => {
  it('should be able to create a verify ', async () => {
    await testJwk();
  });
});

describe('assertVerificationMethod', () => {
  it('Invalid key type. Key type must be "SchnorrSecp256k1VerificationKey2019".', async () => {
    expect.assertions(1);
    const key = new SchnorrSecp256k1VerificationKey2019({
      controller: 'did:example:123',
      privateKeyJwk,
    });
    const suite = new SchnorrSecp256k1Signature2019({ key });
    try {
      await suite.assertVerificationMethod({
        verificationMethod: '123',
      });
    } catch (e) {
      expect(e.message).toBe(
        'Invalid key type. Key type must be "SchnorrSecp256k1VerificationKey2019".'
      );
    }
  });

  it('works', async () => {
    expect.assertions(1);
    const key = new SchnorrSecp256k1VerificationKey2019({
      controller: 'did:example:123',
      privateKeyJwk,
    });
    const suite = new SchnorrSecp256k1Signature2019({ key });
    const res = await suite.assertVerificationMethod({
      verificationMethod: didDoc.publicKey[0],
    });
    expect(res).toBeUndefined();
  });
});

describe('getVerificationMethod', () => {
  it('works', async () => {
    const key = new SchnorrSecp256k1VerificationKey2019({
      controller: 'did:example:123',
      privateKeyJwk,
    });
    const suite = new SchnorrSecp256k1Signature2019({ key });

    const signed = await jsigs.sign(
      { ...exampleDoc },
      {
        compactProof: false,
        documentLoader,
        purpose: new AssertionProofPurpose(),
        suite,
      }
    );

    const res = await suite.getVerificationMethod({
      proof: signed.proof,
      documentLoader,
    });

    expect(res.id).toBe(
      'did:example:123#JUvpllMEYUZ2joO59UNui_XYDqxVqiFLLAJ8klWuPBw'
    );
  });

  it('can get from proof', async () => {
    const key = new SchnorrSecp256k1VerificationKey2019({
      controller: 'did:example:123',
      privateKeyJwk,
    });
    let suite = new SchnorrSecp256k1Signature2019({ key });

    const signed = await jsigs.sign(
      { ...exampleDoc },
      {
        compactProof: false,
        documentLoader,
        purpose: new AssertionProofPurpose(),
        suite,
      }
    );

    // will get from proof
    suite = new SchnorrSecp256k1Signature2019({});

    const res = await suite.getVerificationMethod({
      proof: signed.proof,
      documentLoader,
    });

    expect(res.id).toBe(
      'did:example:123#JUvpllMEYUZ2joO59UNui_XYDqxVqiFLLAJ8klWuPBw'
    );
  });
});

describe('error cases', () => {
  it('A signer API has not been specified.', async () => {
    expect.assertions(1);
    const suite = new SchnorrSecp256k1Signature2019({});
    try {
      await jsigs.sign(
        { ...exampleDoc },
        {
          compactProof: false,
          documentLoader,
          purpose: new AssertionProofPurpose(),
          suite,
        }
      );
    } catch (e) {
      expect(e.message).toBe('A signer API has not been specified.');
    }
  });
});

describe('verifySignature', () => {
  it('fails with bad data', async () => {
    expect.assertions(1);
    const key = new SchnorrSecp256k1VerificationKey2019({
      controller: 'did:example:123',
      privateKeyJwk,
    });
    let suite = new SchnorrSecp256k1Signature2019({ key });

    const signed = await jsigs.sign(
      { ...exampleDoc },
      {
        compactProof: false,
        documentLoader,
        purpose: new AssertionProofPurpose(),
        suite,
      }
    );

    suite = new SchnorrSecp256k1Signature2019({});
    const res = await suite.verifySignature({
      verifyData: 'bad',
      verificationMethod: key,
      proof: signed.proof,
    });

    expect(res).toBe(false);
  });
});

describe('matchProof', () => {
  it('returns false when super fails', async () => {
    const key = new SchnorrSecp256k1VerificationKey2019({
      controller: 'did:example:123',
      privateKeyJwk,
    });

    const suite = new SchnorrSecp256k1Signature2019({ key });

    const signed = await jsigs.sign(
      { ...exampleDoc },
      {
        compactProof: false,
        documentLoader,
        purpose: new AssertionProofPurpose(),
        suite,
      }
    );

    signed.proof.type = 'bar';

    const res = await suite.matchProof({
      proof: signed.proof,
      document: signed,
      purpose: signed.proof.proofPurpose,
      documentLoader,
      expansionMap: false,
    });

    expect(res).toBe(false);
  });
  it('returns true when no key exists... who knows why...', async () => {
    const key = new SchnorrSecp256k1VerificationKey2019({
      controller: 'did:example:123',
      privateKeyJwk,
    });

    let suite = new SchnorrSecp256k1Signature2019({ key });

    const signed = await jsigs.sign(
      { ...exampleDoc },
      {
        compactProof: false,
        documentLoader,
        purpose: new AssertionProofPurpose(),
        suite,
      }
    );
    suite = new SchnorrSecp256k1Signature2019({});

    const res = await suite.matchProof({
      proof: signed.proof,
      document: signed,
      purpose: signed.proof.proofPurpose,
      documentLoader,
      expansionMap: false,
    });

    expect(res).toBe(true);
  });
});
