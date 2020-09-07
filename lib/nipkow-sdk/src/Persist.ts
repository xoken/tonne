import PouchDB from 'pouchdb';
import CryptoJS from 'crypto-js';
import AES from 'crypto-js/aes';

let profiles: any;
let db: any;

export const BIP32_EXTENDED_KEY = 'bip32ExtendedKey';
export const DERIVED_KEYS = 'derivedKeys';
export const OUTPUTS = 'outputs';
export const UTXOS = 'utxos';

const get = async (key: string) => await db.get(key);

const set = async (key: string, value: any) => {
  const doc: any = await db.get(key);
  doc.value = value;
  await db.put(doc);
};

export const init = async (dbName: string) => {
  db = new PouchDB(dbName, { revs_limit: 1, auto_compaction: true });
  await bulkSet([
    { key: BIP32_EXTENDED_KEY, value: null },
    { key: DERIVED_KEYS, value: [] },
    { key: OUTPUTS, value: [] },
    { key: UTXOS, value: [] },
  ]);
};

export const createProfile = async (
  cryptedMnemonic: string,
  profileName: string
) => {
  const newProfile = { cryptedMnemonic, name: profileName };
  try {
    const existingProfiles: any = await profiles.get('profiles');
    if (
      existingProfiles &&
      existingProfiles.value &&
      existingProfiles.value instanceof Array
    ) {
      existingProfiles.value = [...existingProfiles.value, newProfile];
      await profiles.put(existingProfiles);
    } else {
      await profiles.put({
        _id: 'profiles',
        value: [newProfile],
      });
    }
  } catch (error) {
    await profiles.put({
      _id: 'profiles',
      value: [newProfile],
    });
  }
};

export const getProfiles = async () => {
  try {
    profiles = new PouchDB('Profiles', {
      revs_limit: 1,
      auto_compaction: true,
    });
    const existingProfiles: any = await profiles.get('profiles');
    if (
      existingProfiles &&
      existingProfiles.value &&
      existingProfiles.value instanceof Array
    ) {
      const profileNames = existingProfiles.value.map(
        (existingProfile: any) => existingProfile
      );
      return profileNames;
    } else {
      return [];
    }
  } catch (error) {
    return [];
  }
};

export const login = async (profile: string, password: string) => {
  const existingProfiles = await getProfiles();
  const selectedProfile = existingProfiles.find(
    (existingProfile: { name: string }) => existingProfile.name === profile
  );
  if (selectedProfile) {
    const bip39Mnemonic = AES.decrypt(
      selectedProfile.cryptedMnemonic,
      password
    ).toString(CryptoJS.enc.Utf8);
    if (bip39Mnemonic) {
      return bip39Mnemonic;
    } else {
      throw new Error('Login error');
    }
  } else {
    throw new Error("Account Doesn't exist");
  }
};

export const getBip32ExtendedKey = async () => {
  const bip32ExtendedKeyDoc: any = await get(BIP32_EXTENDED_KEY);
  return bip32ExtendedKeyDoc.value;
};

export const getDerivedKeys = async () => {
  const derivedKeysDoc: any = await get(DERIVED_KEYS);
  return derivedKeysDoc.value;
};

export const getOutputs = async () => {
  const outputsDoc: any = await get(OUTPUTS);
  return outputsDoc.value;
};

export const getUtxos = async () => {
  const utxosDoc: any = await get(UTXOS);
  return utxosDoc.value;
};

export const setBip32ExtendedKey = async (value: any) =>
  await set(BIP32_EXTENDED_KEY, value);

export const setDerivedKeys = async (value: any) =>
  await set(DERIVED_KEYS, value);

export const setOutputs = async (value: any) => await set(OUTPUTS, value);

export const setUtxos = async (value: any) => await set(UTXOS, value);

export const bulkSet = async (inputs: any[]) => {
  const newData = inputs.map(element => {
    return { _id: element.key, value: element.value };
  });
  await db.bulkDocs(newData);
};

export const bulkUpdate = async (data: any[]) => {
  const newData = await Promise.all(
    data.map(async element => {
      const doc: any = await get(element.key);
      doc.value = element.value;
      return doc;
    })
  );
  await db.bulkDocs(newData);
};

export const destroy = async () => {
  try {
    await db.destroy();
    return true;
  } catch (error) {
    throw error;
  }
};
