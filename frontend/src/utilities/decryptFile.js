import decrypt from "./decrypt";
import ab2str from "./arrayBufferToString";

const decryptImageWithAesKey = async (encryptedBufferImg, key) => {
  const iv = Uint8Array.from([
    146, 184, 121, 127, 136, 74, 198, 227, 43, 182, 160, 127, 33, 155, 147, 31,
  ]);
  const aesDecryptedKey = JSON.parse(await decrypt(key));
  const cryptoKey = await window.crypto.subtle.importKey(
    "jwk",
    JSON.parse(aesDecryptedKey),
    { name: "AES-GCM" },
    true,
    ["encrypt", "decrypt"]
  );
  console.log(cryptoKey)
  const result = await window.crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    cryptoKey,
    encryptedBufferImg
  );
  return ab2str(result);
};

export default decryptImageWithAesKey;
