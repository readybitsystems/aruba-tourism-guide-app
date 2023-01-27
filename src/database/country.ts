import {format} from 'pretty-format';
import escapeHTML from '../helpers/entity-escape';

export const createCountryTable = (db: any) => {
  const query =
    'CREATE TABLE IF NOT EXISTS country(id INTEGER PRIMARY KEY AUTOINCREMENT,server_id INTEGER,title TEXT,image_url TEXT,local_path TEXT,active TEXT,created_at TEXT,updated_at TEXT,deleted_at TEXT);';
  return db.executeSql(query);
};

export const insertCountry = (db: any, item: any) => {
  let str = `${item?.id},'${escapeHTML(item?.title)}','${item?.image_url}','${item?.localPath}','${item?.active}','${item?.created_at}','${item?.updated_at}','${item?.deleted_at}'`;
  const insertQuery = `INSERT INTO country (server_id,title,image_url,local_path,active,created_at,updated_at,deleted_at) VALUES (${str})`;
  return db.executeSql(insertQuery);
};

export const getAllCountries = async (db: any) => {
  var items: any = [];
  var results = await db.executeSql('SELECT * FROM country');
  if (results[0].rows.length > 0) {
    results.forEach((item: any) => {
      for (let i = 0; i < item.rows.length; i++) {
        items.push(item.rows.item(i));
      }
    });
    return items;
  } else {
    return items;
  }
};

export const getCountryById = async (db: any, id: any) => {
  var results = await db.executeSql(
    `SELECT * FROM country where server_id=${id}`,
  );
  return results[0]?.rows?.item(0) || null;
};

export const updateCountryById = async (db: any, item: any) => {
  try {
    await db.executeSql(
      `UPDATE country SET server_id='${item?.id}',title='${escapeHTML(item?.title)}',image_url='${item?.image_url}',local_path='${item?.localPath}',active='${item?.active}',created_at='${item?.created_at}',updated_at='${item?.updated_at}',deleted_at='${item?.deleted_at}' WHERE server_id='${item?.id}'`,
    );
  } catch (error) {
    console.error('🚀 ~ file: country.ts ~ updateCountryById ~ error', error);
  }
};

export const deleteCountryById = async (db: any, id: any) => {
  try {
    await db.executeSql(`DELETE FROM country where server_id='${id}'`);
  } catch (error) {
    console.error('🚀 ~ file: country.ts ~ updateCountryById ~ error', error);
  }
};
