import PouchDB from 'pouchdb-browser';
import MemoryAdapter from 'pouchdb-adapter-memory';
import pouchdbFind from 'pouchdb-find';
import CryptoJS from 'crypto-js';
import AES from 'crypto-js/aes';

PouchDB.plugin(MemoryAdapter);
PouchDB.plugin(pouchdbFind);

let profiles: any;
let db: any;
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
  db = new PouchDB(`${dbName}`, {
    revs_limit: 1,
    auto_compaction: true,
  });
  credentials = new PouchDB('credentials', {
    revs_limit: 1,
    auto_compaction: true,
    // adapter: 'memory',
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
  const response = await db.allDocs({
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
  if (keys.length > 0) {
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
    await db.bulkDocs(docs);
  }
};

export const getOutputs = async (options?: {
  startkey?: string;
  limit?: number;
  diff?: boolean;
}) => {
  const response = await db.allDocs({
    include_docs: true,
    ...options,
    startkey: options?.startkey || 'output',
    endkey: 'output\ufff0',
    skip: options?.startkey ? 1 : false,
  });
  if (response && response.rows.length > 0) {
    const nextOutputsCursor = response.rows[response.rows.length - 1].id;
    const outputs = response.rows.map((row: { doc: any }) => row.doc);
    return { nextOutputsCursor, outputs };
  } else {
    return { nextOutputsCursor: null, outputs: [] };
  }
};

export const getOutputsLastFetched = async () => {
  try {
    const doc = await db.get('lastFetched');
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
    const doc = await db.get('lastUpdated');
    return {
      lastUpdated: doc.value,
      doc,
    };
  } catch (error) {
    throw error;
  }
};

export const upsertOutputs = async (outputs: any) => {
  if (outputs.length > 0) {
    const { outputs: existingOutputs } = await getOutputs();
    let outputId = existingOutputs.length - 1;
    const docs = outputs.map((output: any, index: number) => {
      if (!output._id) {
        outputId = outputId + 1;
      }
      return {
        _id: `output-${String(outputId).padStart(20, '0')}`,
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
    await db.bulkDocs(docs);
  }
};

export const updateOutputs = async (outputs: any) => {
  const updateDoc = [];
  for (let index = 0; index < outputs.length; index++) {
    const element = outputs[index];
    const outputDoc = await db.get(element._id);
    updateDoc.push({ ...element, _rev: outputDoc._rev });
  }
  const { doc } = await getOutputsLastUpdated();
  updateDoc.push({
    _id: 'lastUpdated',
    _rev: doc._rev,
    value: new Date(),
  });
  try {
    const results = await db.bulkDocs(updateDoc);
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
  await db.createIndex({
    index: { fields: ['outputTxHash', 'outputIndex'] },
  });
  const outputDoc = await db.find({
    selector: {
      outputTxHash: { $eq: output.outputTxHash },
      outputIndex: { $eq: output.outputIndex },
    },
  });
  if (outputDoc.docs.length > 0) return true;
  return false;
};

export const getTransactions = async (options?: {
  startkey?: string;
  limit?: number;
  diff?: boolean;
}) => {
  const response = await db.allDocs({
    include_docs: true,
    ...options,
    descending: true,
    endkey: 'transaction',
    // endkey: 'transaction\ufff0',
    startkey: options?.startkey || 'transaction\ufff0',
    skip: options?.startkey ? 1 : false,
  });
  if (response && response.rows.length > 0) {
    let nextTransactionCursor;
    if (response.rows.length === options?.limit) {
      nextTransactionCursor = response.rows[response.rows.length - 1].id;
    } else {
      nextTransactionCursor = null;
    }
    const transactions = response.rows.map((row: { doc: any }) => row.doc);
    return { nextTransactionCursor, transactions };
  } else {
    return { nextTransactionCursor: null, transactions: [] };
  }
};

export const getTransactionsByConfirmations = async (options?: {
  startkey?: string;
  limit?: number;
  diff?: boolean;
}) => {
  await db.createIndex({
    index: { fields: ['confirmations'] },
  });
  const transactionDocs = await db.find({
    selector: {
      $and: [
        { confirmations: { $lte: 10 } },
        { confirmations: { $exists: true } },
      ],
    },
  });
  if (transactionDocs.docs.length > 0)
    return { transactions: transactionDocs.docs };
  return { transactions: [] };
};

export const upsertTransactions = async (transactions: any[]) => {
  if (transactions.length > 0) {
    const { transactions: existingTransactions } = await getTransactions();
    let txId = existingTransactions.length - 1;
    const docs = transactions
      .reverse()
      .map((transaction: any, index: number) => {
        if (!transaction._id) {
          txId = txId + 1;
        }
        return {
          ...transaction,
          _id: transaction._id
            ? transaction._id
            : `transaction-${String(txId).padStart(20, '0')}`,
        };
      });
    await db.bulkDocs(docs);
  }
};

export const upsertUnconfirmedTransactions = async (transactions: any[]) => {
  if (transactions.length > 0) {
    const {
      unconfirmedTransactions: existingUnconfirmedTransactions,
    } = await getUnconfirmedTransactions();
    let txId = existingUnconfirmedTransactions.length - 1;
    const docs = transactions.map((transaction: any, index: number) => {
      if (!transaction._id) {
        txId = txId + 1;
      }
      return {
        _id: transaction._id
          ? transaction._id
          : `unconfirmedTransaction-${String(txId).padStart(20, '0')}`,
        ...transaction,
      };
    });
    await db.bulkDocs(docs);
  }
};

export const deleteUnconfirmedTx = async (transactions: any) => {
  if (transactions.length > 0) {
    const docs = transactions.map((transaction: any, index: number) => {
      return {
        ...transaction,
        _deleted: true,
      };
    });
    await db.bulkDocs(docs);
  }
};

export const getUnconfirmedTransactions = async () => {
  const response = await db.allDocs({
    include_docs: true,
    startkey: 'unconfirmedTransaction',
    endkey: 'unconfirmedTransaction\ufff0',
  });
  if (response && response.rows.length > 0) {
    const unconfirmedTransactions = response.rows.map(
      (row: { doc: any }) => row.doc
    );
    return { unconfirmedTransactions };
  } else {
    return { unconfirmedTransactions: [] };
  }
};

export const updateDerivedKeys = async (addresses: string[]) => {
  if (addresses.length > 0) {
    const { existingDerivedKeys } = await getDerivedKeys();
    const matchedDerivedKeys = existingDerivedKeys.filter(
      (key: any, index: number) => {
        return addresses.includes(key.address);
      }
    );
    const docs = matchedDerivedKeys.map((key: any, index: number) => {
      return {
        ...key,
        isUsed: true,
      };
    });
    await db.bulkDocs(docs);
  }
};

export const getUTXOs = async (options?: {
  startkey?: string;
  limit?: number;
  diff?: boolean;
}) => {
  await db.createIndex({
    index: { fields: ['isSpent', 'isNameOutput'] },
  });
  const outputDoc = await db.find({
    selector: {
      isSpent: { $eq: false },
      isNameOutput: { $exists: false },
    },
  });
  if (outputDoc.docs.length > 0) return { utxos: outputDoc.docs };
  return { utxos: [] };
};

export const getNUtxo = async (name: string) => {
  await db.createIndex({
    index: { fields: ['isSpent', 'name'] },
  });
  const outputDoc = await db.find({
    selector: {
      // isSpent: { $eq: false },
      name: name,
    },
  });
  if (outputDoc.docs.length > 0) return { nUTXOs: outputDoc.docs[0] };
  return { nUTXOs: null };
};

export const getUnregisteredName = async () => {
  await db.createIndex({
    index: { fields: ['isSpent', 'isNameOutput'] },
  });
  const outputDoc = await db.find({
    selector: {
      isSpent: { $eq: false },
      isNameOutput: { $exists: true },
    },
  });
  if (outputDoc.docs.length > 0) {
    return { names: outputDoc.docs.map((doc: { name: string }) => doc.name) };
  }
  return { names: [] };
};

export const destroy = async () => {
  try {
    await db.viewCleanup();
    await credentials.destroy();
    db = null;
    credentials = null;
    return true;
  } catch (error) {
    throw error;
  }
};

export const reset = async () => {
  try {
    return true;
  } catch (error) {
    throw error;
  }
};

export const runScript = async () => {
  try {
  } catch (error) {
    throw error;
  }
};
