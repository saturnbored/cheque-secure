const strtoab = require("./stringToArrayBuffer");
const ab2str = require("./arrayBufferToString");
const { subtle } = require("crypto").webcrypto;
const encryptWithClientPublicKey = async (data, key) => {
  const cryptoKey = await subtle.importKey(
    "spki",
    Uint8Array.from(atob(key), c => c.charCodeAt(0)),
    {
      name: "RSA-OAEP",
      modulusLength: 4096,
      publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
      hash: "SHA-256",
    },
    true,
    ["encrypt"]
  );
  //console.log(cryptoKey);
  const enc = new TextEncoder();
  const encrypted = await subtle.encrypt(
    { name: "RSA-OAEP" },
    cryptoKey,
    enc.encode(JSON.stringify(data))
  );
  // console.log(ab2str.ab2str(encrypted));
  return ab2str.ab2str(encrypted);
};
//obj = { username: "abc", password:"abc"}
//console.log(encryptWithClientPublicKey(obj,"MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEA6agsPMeka4OfU7tt5ahMvvTAf5p+1SFtTKAw9+m3VoG9+iq5e6wAWvRZCW7Oqh0KVZs2PbaUx94ZLiINqgHgYLFJKrNlyFfqD2FhUkjPndoBsi9rhGMyYmswneicjuYUmzgAN3BtTAuSZjnzyYzoQYdN3Qgpt33CIAb79mEM36VGfO+R0zX3VfyWEQLUJYTzd1nGID+dA5CzbeoreFQnAlh0PiG4Q3uVGFsGsbyuwfS5OCNJI12Ofv1XP2WphdAWn43sLLQCGqZH9vxLj3Cc/O7KL90WQO64cKQfbqWZcsdZo95Zmrp8H9eem0bvoePquB0b8J6LPH2267ruHHxQKK7xekHzyPrze7aA7OzJK2qvN1nGQU7oUtXYw5pwLVtlzHIdNajtNSuOQoE+55lMSH4h+bfEF2ldZpr9o43g1wDHS2nECQZNFUjUMD+ACsnsUzvkdGM7NEjgRPIhi/p59bO8GDz7IFU1l7+POsK/ZcMJYXkSCj+BgEk/F80b/VbMr+hv1dULS71ErdYIAYxk9BCIIzhKhrUXXxEEHwkzxgUSYP93hGXzemFR+LNPhYVMmWdm0AMaTo2yw7+R6bNdgIV15/7acpOmhglVFHtZNfYyJau2hHHPgbWs4IFUHGoFKf4qSkmmF8E5QlLklZgKKoPo/RvIalOSbdA/Wqa3LNUCAwEAAQ=="))


module.exports = { encryptWithClientPublicKey };
