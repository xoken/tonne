import PouchDB from 'pouchdb';
import MemoryAdapter from 'pouchdb-adapter-memory';
import pouchdbFind from 'pouchdb-find';
import CryptoJS from 'crypto-js';
import AES from 'crypto-js/aes';

PouchDB.plugin(MemoryAdapter);
PouchDB.plugin(pouchdbFind);

let profiles: any;
let outputsDB: any;
let credentials: any;

export const BIP32_EXTENDED_KEY = 'bip32ExtendedKey';

const get = async (db: any, key: string) => await db.get(key);

const set = async (db: any, key: string, value: any) => {
  const doc: any = await db.get(key);
  for (const prop in value) {
    doc[prop] = value[prop];
  }
  await db.put(doc);
};

export const init = async (dbName: string) => {
  outputsDB = new PouchDB(`${dbName}`, {
    revs_limit: 1,
    auto_compaction: true,
  });
  credentials = new PouchDB('credentials', {
    revs_limit: 1,
    auto_compaction: true,
    adapter: 'memory',
  });
  await credentials.bulkDocs([{ _id: BIP32_EXTENDED_KEY, value: null }]);
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
    const existingProfiles: any = await profiles.get('profiles', {
      revs: true,
    });

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

export const getDerivedKeys = async () => {
  const response = await outputsDB.allDocs({
    include_docs: true,
    startkey: 'key',
    endkey: 'key\ufff0',
  });
  if (response && response.rows.length > 0) {
    const existingDerivedKeys = response.rows.map(
      (row: { doc: any }) => row.doc
    );
    return { existingDerivedKeys };
  } else {
    return { existingDerivedKeys: [] };
  }
};

export const upsertDerivedKeys = async (keys: any) => {
  const { existingDerivedKeys } = await getDerivedKeys();
  let keyId = existingDerivedKeys.length - 1;
  const docs = keys.map((key: any, index: number) => {
    if (!key._id) {
      keyId = keyId + 1;
    }
    return {
      _id: key._id ? key._id : `key-${String(keyId).padStart(20, '0')}`,
      ...key,
    };
  });
  await outputsDB.bulkDocs(docs);
};

export const getOutputs = async (options?: {
  startkey?: string;
  limit?: number;
  diff?: boolean;
}) => {
  const response = await outputsDB.allDocs({
    include_docs: true,
    ...options,
    startkey: options?.startkey || 'output',
    endkey: 'output\ufff0',
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

export const getOutputsLastFetched = async () => {
  try {
    const doc = await outputsDB.get('lastFetched');
    return {
      lastFetched: doc.value,
      doc,
    };
  } catch (error) {
    return { lastFetched: null };
    // throw error;
  }
};

export const getOutputsLastUpdated = async () => {
  try {
    const doc = await outputsDB.get('lastUpdated');
    return {
      lastUpdated: doc.value,
      doc,
    };
  } catch (error) {
    throw error;
  }
};

export const insertOutputs = async (outputs: any) => {
  // if (outputs.length > 0) {
  const { outputs: existingOutputs } = await getOutputs();
  // const targetLength = String(Math.max(existingOutputs.length - 1, 0)).length;
  // const targetLength = String(utxos.length - 1).length;
  const existingOutputsLength = existingOutputs.length;
  const docs = outputs.map((output: any, index: number) => {
    return {
      // _id: `${String(targetLength + index).padStart(targetLength, '0')}`,
      // _id: `${String(index).padStart(targetLength, '0')}`,
      _id: `output-${String(existingOutputsLength + index).padStart(20, '0')}`,
      isSpent: output.spendInfo ? true : false,
      ...output,
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
  await outputsDB.bulkDocs(docs);
  // }
};

export const updateOutputs = async (outputs: any) => {
  const { doc } = await getOutputsLastUpdated();
  // const existingOutputsLength = existingOutputs.length;
  // const docs = outputs.map((output: any, index: number) => {
  //   return {
  //     _id: `${String(existingOutputsLength + index).padStart(20, '0')}`,
  //     isSpent: output.spendInfo ? true : false,
  //     ...output,
  //   };
  // });
  outputs.push({
    _id: 'lastUpdated',
    _rev: doc._rev,
    value: new Date(),
  });
  try {
    const results = await outputsDB.bulkDocs(outputs);
    results.forEach((result: { error: any }) => {
      if (result.error) {
        throw new Error('Error in updating utxos');
      }
    });
  } catch (error) {
    throw error;
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

export const isInOutputsNew = async (output: {
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
  if (outputDoc.docs.length > 0)
    return {
      isPresent: true,
      _id: outputDoc.docs[0]._id,
      _rev: outputDoc.docs[0]._rev,
    };
  return { isPresent: false, _id: null, _rev: null };
};

export const getUTXOs = async (options?: {
  startkey?: string;
  limit?: number;
  diff?: boolean;
}) => {
  await outputsDB.createIndex({
    index: { fields: ['isSpent'] },
  });
  const outputDoc = await outputsDB.find({
    selector: {
      isSpent: { $eq: false },
    },
  });
  if (outputDoc.docs.length > 0) return { utxos: outputDoc.docs };
  return { utxos: [] };
};

export const isInUTXOs = async (output: {
  outputTxHash: string;
  outputIndex: number;
}) => {
  await outputsDB.createIndex({
    index: { fields: ['outputTxHash', 'outputIndex', 'isSpent'] },
  });
  const outputDoc = await outputsDB.find({
    selector: {
      outputTxHash: { $eq: output.outputTxHash },
      outputIndex: { $eq: output.outputIndex },
      isSpent: false,
    },
  });
  if (outputDoc.docs.length > 0) return true;
  return false;
};

export const destroy = async () => {
  try {
    await credentials.destroy();
    return true;
  } catch (error) {
    throw error;
  }
};
