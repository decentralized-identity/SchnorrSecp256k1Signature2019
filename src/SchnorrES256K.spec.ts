import SchnorrES256K from './SchnorrES256K';

import { privateKeyJwk, publicKeyJwk } from './fixtures';

const payload = {
  hello: true,
};

const expectedSignatureCompact =
  'eyJhbGciOiJTY2hub3JyRVMyNTZLIn0.eyJoZWxsbyI6dHJ1ZX0.6OdF-pxSidTAcTldIhy7bVkxPzM_vhgKw-cjqhvlcfBCl_xhUMLY8uDNlwGVLg0CC5tXCW12oLbb2LV2V-26rw';

describe('SchnorrES256K', () => {
  describe('sign', () => {
    it('should produce a SchnorrES256K', async () => {
      const signature = await SchnorrES256K.sign(payload, privateKeyJwk);
      expect(signature).toBe(expectedSignatureCompact);
    });
  });

  describe('verify', () => {
    it('should return the decoded payload for a valid SchnorrES256K', async () => {
      const verified = await SchnorrES256K.verify(
        expectedSignatureCompact,
        publicKeyJwk
      );
      expect(verified).toEqual(payload);
    });
  });

  describe('decode', () => {
    it('should return the decoded payload for a SchnorrES256K', async () => {
      const decoded = await SchnorrES256K.decode(expectedSignatureCompact);
      expect(decoded).toEqual(payload);
    });

    it('should return the decoded complete payload for a SchnorrES256K', async () => {
      const decoded = await SchnorrES256K.decode(expectedSignatureCompact, {
        complete: true,
      });
      expect(decoded.payload).toEqual(payload);
      expect(decoded.header).toEqual({ alg: 'SchnorrES256K' });
      expect(decoded.signature).toBe(
        '6OdF-pxSidTAcTldIhy7bVkxPzM_vhgKw-cjqhvlcfBCl_xhUMLY8uDNlwGVLg0CC5tXCW12oLbb2LV2V-26rw'
      );
    });
  });
});
