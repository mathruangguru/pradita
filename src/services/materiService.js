import { createTable } from "../lib/storage";
import { seedMateri } from "../data/seedMateri";

const table = createTable("pradita_materi", seedMateri);

export const materiService = {
  list: table.list,
  get: table.get,
  create: table.create,
  update: table.update,
  remove: table.remove,
};
