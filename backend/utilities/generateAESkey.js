const { subtle } = require("crypto").webcrypto;
const ab2str = require("./arrayBufferToString");

subtle
  .generateKey(
    {
        name: "AES-GCM",
        length: 256
      },
      true,
      ["encrypt", "decrypt"]
  )
  .then((res) => {
    subtle.exportKey("jwk", res).then((key) => {
      console.log(JSON.stringify(key));
    });
  });

  