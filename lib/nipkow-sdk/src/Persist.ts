import PouchDB from 'pouchdb';
import MemoryAdapter from 'pouchdb-adapter-memory';
import pouchdbFind from 'pouchdb-find';
import CryptoJS from 'crypto-js';
import AES from 'crypto-js/aes';

PouchDB.plugin(MemoryAdapter);
PouchDB.plugin(pouchdbFind);

let profiles: any;
let outputsDB: any;
let utxosDB: any;
let credentials: any;

export const BIP32_EXTENDED_KEY = 'bip32ExtendedKey';
export const DERIVED_KEYS = 'derivedKeys';
export const OUTPUTS = 'outputs';
export const UTXOS = 'utxos';
// export const SPENT_UTXOS = 'stxos';

const get = async (db: any, key: string) => await db.get(key);

const set = async (db: any, key: string, value: any) => {
  const doc: any = await db.get(key);
  for (const prop in value) {
    doc[prop] = value[prop];
  }
  await db.put(doc);
};

const bulkSet = async (db: any, inputs: any[]) => {
  const newData = inputs.map(element => {
    const key = element['key'];
    delete element.key;
    return { ...element, _id: key };
  });
  await db.bulkDocs(newData);
};

export const init = async (dbName: string) => {
  outputsDB = new PouchDB(`${dbName}_outputs`, {
    revs_limit: 1,
    auto_compaction: true,
  });
  utxosDB = new PouchDB(`${dbName}_utxos`, {
    revs_limit: 1,
    auto_compaction: true,
  });
  credentials = new PouchDB('credentials', {
    revs_limit: 1,
    auto_compaction: true,
    // adapter: 'memory',
  });
  await bulkSet(credentials, [
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

export const updateProfileName = async (
  currentProfileName: string,
  newProfileName: string
) => {
  try {
    const existingProfiles: any = await getProfiles();

    const profileIndex = existingProfiles.value.findIndex(
      (profile: any) => profile.name === currentProfileName
    );
    const profilesArray = existingProfiles.value;
    profilesArray[profileIndex].name = newProfileName;

    await profiles.put({
      _id: 'profiles',
      _rev: existingProfiles._rev,
      value: profilesArray,
    });
  } catch (error) {
    throw error;
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
  const bip32ExtendedKeyDoc: any = await get(credentials, BIP32_EXTENDED_KEY);
  return bip32ExtendedKeyDoc.value;
};

export const setBip32ExtendedKey = async (value: any) =>
  await set(credentials, BIP32_EXTENDED_KEY, { value });

export const updateDerivedKeys = async (value: any) => {
  const existingKeys = await getDerivedKeys();
  const newKeys = [...existingKeys, ...value];
  await setDerivedKeys(newKeys);
};

export const getDerivedKeys = async () => {
  const derivedKeysDoc: any = await get(credentials, DERIVED_KEYS);
  return derivedKeysDoc.value;
};

export const setDerivedKeys = async (value: any) =>
  await set(credentials, DERIVED_KEYS, { value });

export const getUTXOs = async (options?: {
  startkey?: string;
  limit?: number;
  diff?: boolean;
}) => {
  const response = await utxosDB.allDocs({
    include_docs: true,
    ...options,
    endkey: '_design',
    inclusive_end: false,
    skip: options?.startkey ? 1 : false,
  });
  if (response && response.rows.length > 0) {
    const utxos = response.rows.map((row: { doc: any; id: string }) => ({
      ...row.doc,
      id: row.id,
    }));
    return { utxos };
  } else {
    return { utxos: [] };
  }
};

export const setUTXOs = async (utxos: any) => {
  if (utxos.length > 0) {
    const { utxos: existingUtxos } = await getUTXOs();
    const existingUtxosLength = existingUtxos.length;
    const docs = utxos.map((utxo: any, index: number) => {
      return {
        _id: `${String(existingUtxosLength + index).padStart(20, '0')}`,
        ...utxo,
      };
    });
    docs.push({
      _id: 'lastFetched',
      value: new Date(),
    });
    docs.push({
      _id: 'lastUpdated',
      value: null,
    });
    await utxosDB.bulkDocs(docs);
  }
};

export const isInUTXOs = async (output: {
  outputTxHash: string;
  outputIndex: number;
}) => {
  await utxosDB.createIndex({
    index: { fields: ['outputTxHash', 'outputIndex'] },
  });
  const outputDoc = await utxosDB.find({
    selector: {
      outputTxHash: { $eq: output.outputTxHash },
      outputIndex: { $eq: output.outputIndex },
    },
  });
  if (outputDoc.docs.length > 0) return true;
  return false;
};

export const getOutputs = async (options?: {
  startkey?: string;
  limit?: number;
  diff?: boolean;
}) => {
  const response = await outputsDB.allDocs({
    include_docs: true,
    ...options,
    endkey: '_design',
    inclusive_end: false,
    skip: options?.startkey ? 1 : false,
  });
  if (response && response.rows.length > 0) {
    const nextOutputsCursor = response.rows[response.rows.length - 1].id;
    const outputs = response.rows.map((row: { doc: any }) => row.doc);
    const totalOutputs = response.rows.length;
    return { totalOutputs, nextOutputsCursor, outputs };
  } else {
    return { nextOutputsCursor: null, outputs: [], totalOutputs: 0 };
  }
};

export const setOutputs = async (outputs: any) => {
  if (outputs.length > 0) {
    const { outputs: existingOutputs } = await getOutputs();
    // const targetLength = String(Math.max(existingOutputs.length - 1, 0)).length;
    // const targetLength = String(utxos.length - 1).length;
    const existingOutputsLength = existingOutputs.length;
    const docs = outputs.map((output: any, index: number) => {
      return {
        // _id: `${String(targetLength + index).padStart(targetLength, '0')}`,
        // _id: `${String(index).padStart(targetLength, '0')}`,
        _id: `${String(existingOutputsLength + index).padStart(20, '0')}`,
        ...output,
      };
    });
    await outputsDB.bulkDocs(docs);
  }
};

export const isInOutputs = async (output: {
  outputTxHash: string;
  outputIndex: number;
}) => {
  await outputsDB.createIndex({
    index: { fields: ['outputTxHash', 'outputIndex'] },
  });
  const outputDoc = await outputsDB.find({
    selector: {
      outputTxHash: { $eq: output.outputTxHash },
      outputIndex: { $eq: output.outputIndex },
    },
  });
  if (outputDoc.docs.length > 0) return true;
  return false;
};

// export const getStxos = async () => {
//   const stxosDoc: any = await get(db, SPENT_UTXOS);
//   return { lastUpdated: stxosDoc.lastUpdated, value: stxosDoc.value };
// };

// export const setStxos = async (value: any) => {
//   const newValue = { lastUpdated: new Date(), value };
//   await set(db, SPENT_UTXOS, { newValue });
// };

// export const addNewUtxos = async (newUtxos: any) => {
//   const { value: existingUtxos } = await getUtxos();
//   const newValue = {
//     lastFetched: new Date(),
//     value: [...newUtxos, ...existingUtxos],
//   };
//   await set(db, UTXOS, { newValue });
// };

// export const addNewOutputs = async (newOutputs: any) => {
//   const { value: existingOutputs } = await getOutputs();
//   const newValue = {
//     lastFetched: new Date(),
//     value: [...newOutputs, ...existingOutputs],
//   };
//   await set(db, OUTPUTS, { newValue });
// };

// const bulkUpdate = async (db: any, data: any[]) => {
//   const newData = await Promise.all(
//     data.map(async element => {
//       const doc: any = await get(db, element.key);
//       doc.value = element.value;
//       return doc;
//     })
//   );
//   await db.bulkDocs(newData);
// };

export const destroy = async () => {
  try {
    await outputsDB.destroy();
    await utxosDB.destroy();
    await credentials.destroy();
    return true;
  } catch (error) {
    throw error;
  }
};
