import SS256K from './SS256K';

import { privateKeyJwk, publicKeyJwk } from './fixtures';

const payload = {
  hello: true,
};

const expectedSignatureCompact =
  'eyJhbGciOiJTUzI1NksifQ.eyJoZWxsbyI6dHJ1ZX0.NdGZ0_CJiOBssA8vVGXCgBbzm4zDLTwyc73JeZ8Z2rZ22xpVhTp5q9x9CjiL3QuE3Aiz7GPfvb3sCQsSvj2nLg';

describe('SS256K', () => {
  describe('sign', () => {
    it('should produce a SS256K', async () => {
      const signature = await SS256K.sign(payload, privateKeyJwk);
      expect(signature).toBe(expectedSignatureCompact);
    });
  });

  describe('verify', () => {
    it('should return the decoded payload for a valid SS256K', async () => {
      const verified = await SS256K.verify(
        expectedSignatureCompact,
        publicKeyJwk
      );
      expect(verified).toEqual(payload);
    });
  });

  describe('decode', () => {
    it('should return the decoded payload for a SS256K', async () => {
      const decoded = await SS256K.decode(expectedSignatureCompact);
      expect(decoded).toEqual(payload);
    });

    it('should return the decoded complete payload for a SS256K', async () => {
      const decoded = await SS256K.decode(expectedSignatureCompact, {
        complete: true,
      });
      expect(decoded.payload).toEqual(payload);
      expect(decoded.header).toEqual({ alg: 'SS256K' });
      expect(decoded.signature).toBe(
        'NdGZ0_CJiOBssA8vVGXCgBbzm4zDLTwyc73JeZ8Z2rZ22xpVhTp5q9x9CjiL3QuE3Aiz7GPfvb3sCQsSvj2nLg'
      );
    });
  });
});
