import { hexToBin, binToHex, instantiateSecp256k1 } from 'bitcoin-ts';

import { privateKeyUInt8Array, publicKeyUInt8Array } from '../src/fixtures';

const expectedSignatureHex =
  '11937ecef942d399287831da18c2f7694ba4ae5898f99ee489e00e9be99831a17879b73b3c70474d8602dedf7d26d231f8bfa243107534506635bfb08e99c1ad';

const messageHashUInt8Array = hexToBin('deadbeef');
let secp256k1: any;

describe('bitcoin-ts.sanity', () => {
  beforeAll(async () => {
    secp256k1 = await instantiateSecp256k1();
  });

  it('signMessageHashSchnorr', async () => {
    const signatureUInt8Array = await secp256k1.signMessageHashSchnorr(
      privateKeyUInt8Array,
      messageHashUInt8Array
    );
    expect(binToHex(signatureUInt8Array)).toBe(expectedSignatureHex);
  });

  it('verifySignatureSchnorr', async () => {
    const verification = await secp256k1.verifySignatureSchnorr(
      hexToBin(expectedSignatureHex),
      publicKeyUInt8Array,
      messageHashUInt8Array
    );
    expect(verification).toBe(true);
  });
});
