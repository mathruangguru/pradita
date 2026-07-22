import { createTable } from "../lib/storage";
import { seedUsers } from "../data/seedUsers";

const table = createTable("pradita_users", seedUsers);

export const userService = {
  list: table.list,
  get: table.get,
  create: table.create,
  update: table.update,
  remove: table.remove,
};
