const DELAY_MS = 150;

const delay = (value) =>
  new Promise((resolve) => setTimeout(() => resolve(value), DELAY_MS));

const readTable = (key, seed) => {
  const raw = localStorage.getItem(key);
  if (!raw) {
    const timestamped = seed.map((row) => ({
      CreatedAt: new Date().toISOString(),
      UpdatedAt: new Date().toISOString(),
      ...row,
    }));
    localStorage.setItem(key, JSON.stringify(timestamped));
    return timestamped;
  }
  return JSON.parse(raw);
};

const writeTable = (key, rows) => {
  localStorage.setItem(key, JSON.stringify(rows));
};

const nextId = (rows) =>
  rows.reduce((max, row) => Math.max(max, row.Id), 0) + 1;

const nowIso = () => new Date().toISOString();

export const createTable = (key, seed) => ({
  list: async () => delay(readTable(key, seed)),

  get: async (id) => {
    const rows = readTable(key, seed);
    return delay(rows.find((row) => row.Id === Number(id)) ?? null);
  },

  create: async (fields) => {
    const rows = readTable(key, seed);
    const row = {
      Id: nextId(rows),
      ...fields,
      CreatedAt: nowIso(),
      UpdatedAt: nowIso(),
    };
    writeTable(key, [...rows, row]);
    return delay(row);
  },

  update: async (id, fields) => {
    const rows = readTable(key, seed);
    let updated = null;
    const next = rows.map((row) => {
      if (row.Id === Number(id)) {
        updated = { ...row, ...fields, Id: row.Id, UpdatedAt: nowIso() };
        return updated;
      }
      return row;
    });
    writeTable(key, next);
    return delay(updated);
  },

  remove: async (id) => {
    const rows = readTable(key, seed);
    writeTable(
      key,
      rows.filter((row) => row.Id !== Number(id)),
    );
    return delay(true);
  },
});
