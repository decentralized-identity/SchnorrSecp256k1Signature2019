import React from 'react';
import logo from './logo.svg';
import './App.css';

import {
  SchnorrSecp256k1VerificationKey2019,
  SchnorrSecp256k1Signature2019,
} from '@transmute/lds-ss256k';

const privateKeyJwk = {
  crv: 'secp256k1',
  d: 'rhYFsBPF9q3-uZThy7B3c4LDF_8wnozFUAEm5LLC4Zw',
  kid: 'JUvpllMEYUZ2joO59UNui_XYDqxVqiFLLAJ8klWuPBw',
  kty: 'EC',
  x: 'dWCvM4fTdeM0KmloF57zxtBPXTOythHPMm1HCLrdd3A',
  y: '36uMVGM7hnw-N6GnjFcihWE3SkrhMLzzLCdPMXPEXlA',
};

const suite3 = new SchnorrSecp256k1Signature2019({
  key: new SchnorrSecp256k1VerificationKey2019({
    id: 'did:example:123#key-0',
    type: 'SchnorrSecp256k1VerificationKey2019',
    controller: 'did:example:123',
    privateKeyJwk,
  }),
});

function App() {
  React.useEffect(() => {
    console.log('test');
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
