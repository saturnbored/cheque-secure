const { subtle } = require("crypto").webcrypto;
const str2ab = require("./stringToArrayBuffer");

const decrypt = async (encryptedData) => {
  const jwkPrivateKey = JSON.parse(process.env.PRIVATE_KEY);
  const cryptoKey = await subtle.importKey(
    "jwk",
    jwkPrivateKey,
    { name: "RSA-OAEP", hash: "SHA-256" },
    false,
    ["decrypt"]
  );
  //console.log("crypto000Key:",cryptoKey);
  const plainAB = await subtle.decrypt(
    { name: "RSA-OAEP" },
    cryptoKey,
    Uint8Array.from(atob(encryptedData), (c) => c.charCodeAt(0))
  );
  const dec = new TextDecoder();
  //console.log("dec:",dec.decode(plainAB))
  return dec.decode(plainAB);
};
//decrypt("bf0lhgLTCDi4/DrcnXfBK8R3Zd2AX9L9CeTAVaWGN5DiTd0Tcv1FGJX5UIdpAXl+B3i9bfVHusRfpsEX896/0VaRIRpUMgwl5aNlx0tNS6xGfyGy+rGhlPFobMihZjt3vL1nRAYiaSNiXjz2tEeZ0GV6P5S7NQd8YJUZK+Xe2DLF2ppIin9F8HB6aNGxzqwlS3junEC2etYN4t/0fWlRupSUXo0OwWiw0CSZMYLBpy3EiZnCDQ+kuwkMt+eW34IgTvcOf/H0zkrxbYfp24YdKLuBArmbZlpvZ+o4Phi23JVY/DHq9T95TefUeAn+t39u55TCjYirk1YNsFFttex+OqhuUjwdR1JorGbHjsQiPAcokhgDD7KVJ7xzsRoyeAJxGI4K/GmGibW8/uIY+/HMiO/ku1LulPIv3hDnNNZ46OsmpvDinoGaLB7arU62mELZ9yNPjw/CHGDHkceKX8sZmbcpXYHQL9vZrVuAqo/BXn/6QqA6RmBH3gB3HKFR4d+fSj4HALQmN5+MA7VeLn7KEhIhMgBJZ4UY0qIwxY73WBAxFLLI0cw1y+0UVmMl6Y+Vo7OB985yMKwiOnysvevVYG4PTunTFW3TSfu9UzJlT03heGb0TxHDesEmfFzQOG9A6Ejco/YMYkCaUUfVs0lu4WKLeWwQGZFAZHXzaT44PK0=")
module.exports = {decrypt};
