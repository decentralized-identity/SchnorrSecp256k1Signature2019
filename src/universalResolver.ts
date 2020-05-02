import fetch from 'node-fetch';


const getJson = async (url: string) =>
  fetch(url, {
    headers: {
      Accept: 'application/ld+json',
    },
    method: 'get',
  }).then((data: any) => data.json());


export default {
  resolve: async (didUri: string) => {
    try {
      const didMethod = didUri
        .split(':')
        .splice(0, 2)
        .join(':');

      let res;
      // this avoids jsonld parsing done the universal resolver,
      // which sometimes breaks things.
      switch (didMethod) {
        case 'did:elem':
          res = await getJson(
            'https://element-did.com/api/v1/sidetree/' + didUri
          );
          break;
        default:
          res = await getJson(
            'https://uniresolver.io/1.0/identifiers/' + didUri
          );
      }

      if (res.didDocument === null) {
        throw new Error('Could not resolve DID with Universal Resolver.');
      }
      return res.didDocument;
    } catch (e) {
      // tslint:disable-next-line:no-console
      // console.error('Could not resolve: ' + didUri);
      throw new Error(e);
    }
  },
};