import low, { LowdbSync } from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
import { User, DBSchema } from './models';

export const getDBInstance = (): LowdbSync<DBSchema> => {
  const adapter = new FileSync('db.json');
  const db = low(adapter);

  // const defaultDb = { users: [], posts: [], pictures: [], comments: [] };
  // db.defaults(defaultDb).write();

  return db;
};
