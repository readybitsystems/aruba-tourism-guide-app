import {enablePromise, openDatabase} from 'react-native-sqlite-storage';
import {createCountryTable} from './country';
import {createToursTable} from './tours';
import {createPlacesTable} from './places';
import {createUserTable, getUser} from './users';

enablePromise(true);

export const DB_NAME: string = 'MainDB';

export const getDbConnection = async () => {
  const db = await openDatabase(
    {
      name: DB_NAME,
      location: 'default',
    },
    () => {},
    (err: any) => {
      throw new Error(`Error ${err}`);
    },
  );
  return db;
};

export const initDatabase = async () => {
  const db = await getDbConnection();
  await createCountryTable(db);
  await createPlacesTable(db);
  await createToursTable(db);
  await createUserTable(db);
  const user = await getUser(db);
  db.close();
  return user;
};
