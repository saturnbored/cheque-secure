import decrypt from "./decrypt";

const encryptImageWithAesKey = async (image, key) => {
  try{

    console.log('aes-key: ', key);
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
      let enc = new TextEncoder();
      const encodedImg = enc.encode(JSON.stringify(image));
      const result = await window.crypto.subtle.encrypt(
        {
          name: "AES-GCM",
          iv: iv,
        },
        cryptoKey,
        image
        );
        return result;
    }
    catch(err){
      console.log(err);
    }
};

export default encryptImageWithAesKey;
