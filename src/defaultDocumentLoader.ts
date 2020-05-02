import jsonld from 'jsonld';
import resolver from './universalResolver';

const _nodejs =
  // tslint:disable-next-line
  typeof process !== 'undefined' && process.versions && process.versions.node;
const _browser =
  // tslint:disable-next-line
  !_nodejs && (typeof window !== 'undefined' || typeof self !== 'undefined');

const documentLoader = _browser
  ? jsonld.documentLoaders.xhr()
  : jsonld.documentLoaders.node();

const cachedContexts: any = {
  'did:example:123': require('./fixtures/didDoc.json'),
  'https://identity.foundation/SchnorrSecp256k1Signature2019/contexts/schnorr-v1.json': require('./fixtures/contexts/schnorr-v1.json'),
};

export default async (url: string) => {
  // console.log(url);
  // are we handling a cached context?
  if (cachedContexts[url.split('#')[0]]) {
    return {
      contextUrl: null, // this is for a context via a link header
      document: cachedContexts[url.split('#')[0]], // this is the actual document that was loaded
      documentUrl: url, // this is the actual context URL after redirects
    };
  }

  if (url.indexOf('did:') === 0) {
    // are we handling a DID?
    const doc = await resolver.resolve(url);

    // TODO: add proper jsonld logic for iterating all possible DID URIs.

    if (url.indexOf('#')) {
      // iterate public keys, find the correct id...
      for (const publicKey of doc.publicKey) {
        if (publicKey.id === url) {
          return {
            contextUrl: null, // this is for a context via a link header
            document: publicKey, // this is the actual document that was loaded
            documentUrl: url, // this is the actual context URL after redirects
          };
        }
      }
    }

    return {
      contextUrl: null, // this is for a context via a link header
      document: doc, // this is the actual document that was loaded
      documentUrl: url, // this is the actual context URL after redirects
    };
  }

  // console.warn('attempting to resolve remote document: ', url);

  //   is this a published (public) context?
  return documentLoader(url);
};
