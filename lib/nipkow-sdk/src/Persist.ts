import PouchDB from 'pouchdb';

export const AUTH = 'auth';
export const BIP32_EXTENDED_KEY = 'bip32ExtendedKey';
export const DERIVED_KEYS = 'derivedKeys';
export const OUTPUTS = 'outputs';
export const UTXOS = 'utxos';

let db: any;

export const createDB = (dbName: string) => {
  db = new PouchDB(dbName, { revs_limit: 1, auto_compaction: true });
};

const get = async (key: string) => await db.get(key);

const set = async (key: string, value: any) => {
  const doc: any = await db.get(key);
  doc.value = value;
  await db.put(doc);
};

export const getAuth = async () => {
  const authDoc: any = await get(AUTH);
  return authDoc.value;
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

export const setAuth = async (value: any) => await set(AUTH, value);

export const setBip32ExtendedKey = async (value: any) =>
  await set(BIP32_EXTENDED_KEY, value);

export const setDerivedKeys = async (value: any) =>
  await set(DERIVED_KEYS, value);

export const setOutputs = async (value: any) => await set(OUTPUTS, value);

export const setUtxos = async (value: any) => await set(UTXOS, value);

export const setInitialState = async () => {
  await bulkSet([
    { key: AUTH, value: null },
    { key: BIP32_EXTENDED_KEY, value: null },
    { key: DERIVED_KEYS, value: [] },
    { key: OUTPUTS, value: [] },
    { key: UTXOS, value: [] },
  ]);
};

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
  await db.destroy();
};
