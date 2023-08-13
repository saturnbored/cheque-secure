const { subtle } = require("crypto").webcrypto;
const ab2str = require("./arrayBufferToString");

subtle
  .generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 4096,
      publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
      hash: "SHA-256",
    },
    true,
    ["encrypt", "decrypt"]
  )
  .then((res) => {
    subtle.exportKey("spki", res.publicKey).then((key) => {
      console.log(ab2str(key));
    });
    subtle.exportKey("jwk", res.privateKey).then((key) => {
      console.log(JSON.stringify(key));
    });
    // console.log(res.privateKey);
  });
