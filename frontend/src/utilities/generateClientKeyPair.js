import abtostr from "./arrayBufferToString";

const generateKeyPair = async () => {
  const res = await window.crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 4096,
      publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
      hash: "SHA-256",
    },
    true,
    ["encrypt", "decrypt"]
  );
  const privateKey = await crypto.subtle.exportKey("jwk", res.privateKey);
  const cryptoKey = await window.crypto.subtle.importKey(
    "jwk",
    privateKey,
    { name: "RSA-OAEP", hash: "SHA-256" },
    false,
    ["decrypt"]
  );
  console.log(cryptoKey);
  let openRequest = indexedDB.open("db", 1);
  openRequest.onupgradeneeded = function () {
    let db = openRequest.result;
    if (!db.objectStoreNames.contains("keyStore")) {
      // If does not exist
      db.createObjectStore("keyStore"); // create it
    }
  };
  openRequest.onerror = function () {
    console.error("Error", openRequest.error);
  };

  openRequest.onsuccess = function () {
    // After successfully opening
    let db = openRequest.result;
    let transaction = db.transaction("keyStore", "readwrite"); // (1)

    // get an object store to operate on it
    let keyStore = transaction.objectStore("keyStore"); // (2)
    let request = keyStore.put(cryptoKey, "key"); // (3)

    request.onsuccess = function () {
      console.log("key added to the store", request.result);
    };

    request.onerror = function () {
      console.log("Error", request.error);
    };
  };

  // localStorage.setItem("ClientKey", JSON.stringify(privateKey));
  const key = await crypto.subtle.exportKey("spki", res.publicKey);
  return abtostr(key);
};

export default generateKeyPair;
