import strtoab from "./stringToArrayBuffer";
import ab2str from "./arrayBufferToString";
const encryptWithServerPublicKey = async (data, key) => {
  try {
    console.log("Inside encryptWithServerPublicKey");
    console.log(data);

    // const binaryDerString = window.atob(key);
    // const binaryDer = strtoab(binaryDerString);

    // base64 decode the string to get the binary data
    const binaryDerString = window.atob(key);
    // convert from a binary string to an ArrayBuffer
    const binaryDer = strtoab(binaryDerString);

    const cryptoKey = await window.crypto.subtle.importKey(
      "spki",
      binaryDer,
      {
        name: "RSA-OAEP",
        hash: "SHA-256",
      },
      true,
      ["encrypt"]
    );

    console.log("crypto-key:", cryptoKey);
    
    const dataStr = JSON.stringify(data);
    // const dataStr = "hello world";

    console.log('type: ', typeof dataStr);
    console.log("strigified", dataStr);
    
    const enc = new TextEncoder();

    let encoded = enc.encode(dataStr);
    console.log("encoded", encoded);

    const encrypted = await window.crypto.subtle.encrypt(
      {
        name: "RSA-OAEP",
      },
      cryptoKey,
      encoded
    );

    console.log("encrypted:", encrypted);
    return ab2str(encrypted);
  } catch (err) {
    console.log(err);
  }
};

export default encryptWithServerPublicKey;
