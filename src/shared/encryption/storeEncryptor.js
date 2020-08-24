import CryptoJS from 'crypto-js';

class StoreEncryptor {
  constructor() {
    if (StoreEncryptor.instance) {
      return StoreEncryptor.instance;
    }

    StoreEncryptor.instance = this;

    return this;
  }

  setEncryptionKey = (key) => {
    this.key = key;
  };

  encrypt = (data) => {
    if (!data || !this.key) return data;

    if (typeof data !== 'string') {
      data = JSON.stringify(data);
    }

    const cryptedText = CryptoJS.AES.encrypt(data, this.key);
    return cryptedText.toString();
  };

  decrypt = (data) => {
    if (!data || !this.key) return data;

    try {
      return this.decryptWithKey(data, this.key);
    } catch (error) {
      return null;
    }
  };

  decryptWithKey = (data, key) => {
    const bytes = CryptoJS.AES.decrypt(data, key);
    const decrypted = bytes.toString(CryptoJS.enc.utf8);
    return JSON.parse(decrypted);
  };
}

export default new StoreEncryptor();
