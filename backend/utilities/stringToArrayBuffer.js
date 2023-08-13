const str2ab = (str) => {
  return Uint8Array.from(atob(str), c => c.charCodeAt(0)).buffer
};

module.exports ={str2ab};
