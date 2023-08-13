const decrypt = async (encryptedData) => {
  let cryptoKey, plainAB;
  const func = () => {
    return new Promise((resolve, reject) => {
      let openRequest = indexedDB.open("db", 1);
      openRequest.onerror = function () {
        console.error("Error", openRequest.error);
      };
      openRequest.onsuccess = function () {
        let db = openRequest.result;
        let transaction = db.transaction("keyStore", "readwrite");
        let keyStore = transaction.objectStore("keyStore");
        let request = keyStore.get("key");
        request.onsuccess = async function () {
          console.log("key added to the store", request.result);
          cryptoKey = request.result;
          console.log(cryptoKey);
          plainAB = await window.crypto.subtle.decrypt(
            { name: "RSA-OAEP" },
            cryptoKey,
            Uint8Array.from(atob(encryptedData), (c) => c.charCodeAt(0))
          );
          const dec = new TextDecoder();
          plainAB = dec.decode(plainAB);
          resolve(plainAB);
        };
        request.onerror = function () {
          console.log("Error", request.error);
        };
      };
    });
  };
  return await func();
};

export default decrypt;
