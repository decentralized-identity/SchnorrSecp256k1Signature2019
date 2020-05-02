import base64url from 'base64url';
import SchnorrSecp256k1VerificationKey2019 from './SchnorrSecp256k1VerificationKey2019';

import { privateKeyJwk, publicKeyJwk } from './fixtures';

const data = new Uint8Array([128]);
let key: SchnorrSecp256k1VerificationKey2019;

const expectedDetachedJWS = 'eyJhbGciOiJTY2hub3JyRVMyNTZLIiwiYjY0IjpmYWxzZSwiY3JpdCI6WyJiNjQiXX0..cup5dVHz4tHM2b3qN82VBgEzh-It00rFLOyDVpzGiR8IQ8Kdihjv-ClrPRr-ltd_CZreVY6nDqIPNFerBaVABQ';

describe('SchnorrSecp256k1VerificationKey2019', () => {
  it('can import a jwk', async () => {
    key = new SchnorrSecp256k1VerificationKey2019({
      controller: 'did:example:123',
      privateKeyJwk,
    });
    expect(key.id).toBe(
      'did:example:123#JUvpllMEYUZ2joO59UNui_XYDqxVqiFLLAJ8klWuPBw'
    );
    expect(key.type).toBe('SchnorrSecp256k1VerificationKey2019');
    expect(key.controller).toBe('did:example:123');
    expect(key.privateKeyJwk).toBeDefined();
    expect(key.publicKeyJwk).toBeDefined();
  });

  it('sign', async () => {
    const { sign } = key.signer();
    expect(typeof sign).toBe('function');
    const signature = await sign({ data });
    const [encodedHeader, encodedSignature] = signature.split('..');
    const header = JSON.parse(base64url.decode(encodedHeader));
    expect(header.b64).toBe(false);
    expect(header.crit).toEqual(['b64']);
    expect(encodedSignature).toBe(
      'cup5dVHz4tHM2b3qN82VBgEzh-It00rFLOyDVpzGiR8IQ8Kdihjv-ClrPRr-ltd_CZreVY6nDqIPNFerBaVABQ'
    );
  });

  it('verify', async () => {
    const { verify } = key.verifier();
    expect(typeof verify).toBe('function');
    
    const result = await verify({
      data,
      signature: expectedDetachedJWS,
    });
    expect(result).toBe(true);
  });

  it('can not sign with out a private key', async () => {
    expect.assertions(6);
    key = new SchnorrSecp256k1VerificationKey2019({
      controller: 'did:example:123',
      publicKeyJwk,
    });
    expect(key.id).toBe(
      'did:example:123#JUvpllMEYUZ2joO59UNui_XYDqxVqiFLLAJ8klWuPBw'
    );
    expect(key.type).toBe('SchnorrSecp256k1VerificationKey2019');
    expect(key.controller).toBe('did:example:123');
    expect(key.privateKeyJwk).toBeUndefined();
    expect(key.publicKeyJwk).toBeDefined();

    const { sign } = key.signer();

    try {
      await sign('test');
    } catch (e) {
      expect(e.message).toBe('No private key to sign with.');
    }
  });

  it('can not verify with out a private key', async () => {
    expect.assertions(6);
    key = new SchnorrSecp256k1VerificationKey2019({
      controller: 'did:example:123',
      privateKeyJwk,
    });
    expect(key.id).toBe(
      'did:example:123#JUvpllMEYUZ2joO59UNui_XYDqxVqiFLLAJ8klWuPBw'
    );
    expect(key.type).toBe('SchnorrSecp256k1VerificationKey2019');
    expect(key.controller).toBe('did:example:123');
    expect(key.privateKeyJwk).toBeDefined();
    expect(key.publicKeyJwk).toBeDefined();

    delete key.publicKeyJwk;

    const { verify } = key.verifier();

    try {
      await verify('test');
    } catch (e) {
      expect(e.message).toBe('No public key to verify with.');
    }
  });

  it('verify fails when header is bad', async () => {
    expect.assertions(2);
    key = new SchnorrSecp256k1VerificationKey2019({
      controller: 'did:example:123',
      privateKeyJwk,
    });
    const { verify } = key.verifier();
    expect(typeof verify).toBe('function');

    const signature =
      'eyJhbGciOiJFUzI1NksiLCJiNjQiOmZhbHNlfQ..cup5dVHz4tHM2b3qN82VBgEzh-It00rFLOyDVpzGiR8IQ8Kdihjv-ClrPRr-ltd_CZreVY6nDqIPNFerBaVABQ';
    const result = await verify({
      data,
      signature,
    });

    expect(result).toBe(false);
  });

  it('verify fails with broken header', async () => {
    expect.assertions(1);
    key = new SchnorrSecp256k1VerificationKey2019({
      controller: 'did:example:123',
      privateKeyJwk,
    });
    const { verify } = key.verifier();

    try {
      const signature =
        'eyJhbGciOiJFUzNksiLCJiNjQiOmZhbHNlfQ..cup5dVHz4tHM2b3qN82VBgEzh-It00rFLOyDVpzGiR8IQ8Kdihjv-ClrPRr-ltd_CZreVY6nDqIPNFerBaVABQ';
       await verify({
        data,
        signature,
      });
    } catch (e) {
      expect(e.message).toBe(
        'Could not parse JWS header; SyntaxError: Unexpected token � in JSON at position 14'
      );
    }
  });
});