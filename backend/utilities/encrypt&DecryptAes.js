const crypto = require("crypto").webcrypto;
const ab2str = require("./arrayBufferToString");
const fs = require("fs");

const obj = {
  a: "a92919",
};
function getMessageEncoding(obj) {
  const messageBox = obj;
  let message = JSON.stringify(messageBox);
  let enc = new TextEncoder();
  return enc.encode(message);
}

let iv = Uint8Array.from([
  146, 184, 121, 127, 136, 74, 198, 227, 43, 182, 160, 127, 33, 155, 147, 31,
]);
//const k=Uint8Array.from(atob(process.env.AES_KEY), c => c.charCodeAt(0))

async function encryptMessage(f) {
  //console.log("IV", iv)
  const key = await crypto.subtle.importKey(
    "jwk",
    JSON.parse(process.env.AES_KEY),
    { name: "AES-GCM" },
    true,
    ["encrypt", "decrypt"]
  );
  //console.log(key)
  let encoded = getMessageEncoding(f);
  // counter will be needed for decryption
  //counter = crypto.getRandomValues(new Uint8Array(16));
  return await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    encoded
  );
  //console.log(ab2str.ab2str(encrypted));
  //console.log(encrypted);
}

async function decryptMessage(enc) {
  console.log(JSON.parse(process.env.AES_KEY));
  const key = await crypto.subtle.importKey(
    "jwk",
    JSON.parse(process.env.AES_KEY),
    { name: "AES-GCM" },
    true,
    ["encrypt", "decrypt"]
  );
 // console.log(key);
  return await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    enc
  );
}

const decryptImageWithAesKey = async (encryptedBufferImg, key) => {
  const iv = Uint8Array.from([
    146, 184, 121, 127, 136, 74, 198, 227, 43, 182, 160, 127, 33, 155, 147, 31,
  ]);
  //const aesDecryptedKey = JSON.parse(await decrypt(process.env));
  const cryptoKey = await crypto.subtle.importKey(
    "jwk",
    JSON.parse(process.env.AES_KEY),
    { name: "AES-GCM" },
    true,
    ["encrypt", "decrypt"]
  );
  //console.log(cryptoKey)
  const result = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    cryptoKey,
    encryptedBufferImg
  );
  return ab2str(result);
};


async function all(f) {
  const p = await encryptMessage(f);
  console.log("p is: ",p)
  const q = await decryptMessage(p);
  const dec = new TextDecoder();
  const pp = dec.decode(q);
  const ans = ab2str.ab2str(JSON.parse(pp).data);
  fs.writeFileSync("lassan.txt", ans);
}

module.exports = {
  encryptMessage,
  decryptMessage,
  //all
};
