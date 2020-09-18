import PouchDB from 'pouchdb';
import MemoryAdapter from 'pouchdb-adapter-memory';
import CryptoJS from 'crypto-js';
import AES from 'crypto-js/aes';

console.log(MemoryAdapter);
PouchDB.plugin(MemoryAdapter);
let profiles: any;
let db: any;
let keys: any;

export const BIP32_EXTENDED_KEY = 'bip32ExtendedKey';
export const DERIVED_KEYS = 'derivedKeys';
export const OUTPUTS = 'outputs';
export const UTXOS = 'utxos';

const get = async (db: any, key: string) => await db.get(key);

const set = async (db: any, key: string, value: any) => {
  const doc: any = await db.get(key);
  for (const prop in value) {
    doc[prop] = value[prop];
  }
  await db.put(doc);
};

export const init = async (dbName: string) => {
  db = new PouchDB(dbName, { revs_limit: 1, auto_compaction: true });
  keys = new PouchDB('keys', { adapter: 'memory' });
  await bulkSet(db, [
    { key: OUTPUTS, lastFetched: null, value: [] },
    { key: UTXOS, lastFetched: null, value: [] },
  ]);
  await bulkSet(keys, [
    { key: BIP32_EXTENDED_KEY, value: null },
    { key: DERIVED_KEYS, value: [] },
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
  const bip32ExtendedKeyDoc: any = await get(keys, BIP32_EXTENDED_KEY);
  return bip32ExtendedKeyDoc.value;
};

export const getDerivedKeys = async () => {
  const derivedKeysDoc: any = await get(keys, DERIVED_KEYS);
  return derivedKeysDoc.value;
};

export const getOutputs = async () => {
  const outputsDoc: any = await get(db, OUTPUTS);
  return { lastFetched: outputsDoc.lastFetched, value: outputsDoc.value };
};

export const getUtxos = async () => {
  const utxosDoc: any = await get(db, UTXOS);
  return utxosDoc.value;
};

export const setBip32ExtendedKey = async (value: any) =>
  await set(keys, BIP32_EXTENDED_KEY, value);

export const setDerivedKeys = async (value: any) =>
  await set(keys, DERIVED_KEYS, value);

export const setUtxos = async (value: any) => await set(db, UTXOS, value);

export const setOutputs = async (value: any) => {
  const newValue = { lastFetched: new Date(), value };
  await set(db, OUTPUTS, newValue);
};

export const updateDerivedKeys = async (value: any) => {
  const existingKeys = await getDerivedKeys();
  const newKeys = [...existingKeys, ...value];
  await setDerivedKeys(newKeys);
};

export const bulkSet = async (db: any, inputs: any[]) => {
  const newData = inputs.map(element => {
    const key = element['key'];
    delete element.key;
    return { ...element, _id: key };
  });
  await db.bulkDocs(newData);
};

export const bulkUpdate = async (db: any, data: any[]) => {
  const newData = await Promise.all(
    data.map(async element => {
      const doc: any = await get(db, element.key);
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
