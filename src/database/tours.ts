import {format} from 'pretty-format';
import escapeHTML from '../helpers/entity-escape';

export const createToursTable = (db: any) => {
  const query =
    'CREATE TABLE IF NOT EXISTS tours(id INTEGER PRIMARY KEY AUTOINCREMENT,server_id INTEGER,country_id INTEGER,title TEXT,image_url TEXT,local_path TEXT,duration TEXT,active TEXT,created_at TEXT,updated_at TEXT,deleted_at TEXT);';
  return db.executeSql(query);
};

export const insertTours = (db: any, item: any) => {
  let str = `${item?.id},${item?.country_id},'${escapeHTML(item?.title)}','${item?.image_url}','${item?.localPath}','${escapeHTML(item?.duration)}','${item?.active}','${item?.created_at}','${item?.updated_at}','${item?.deleted_at}'`;
  const insertQuery = `INSERT INTO tours (server_id,country_id,title,image_url,local_path,duration,active,created_at,updated_at,deleted_at) VALUES (${str})`;
  return db.executeSql(insertQuery);
};

export const getAllTours = async (db: any, id: Number) => {
  var items: any = [];
  var results = await db.executeSql(
    `SELECT * FROM tours WHERE country_id ='${id}'`,
  );
  if (results[0].rows.length > 0) {
    results.forEach((item: any) => {
      for (let i = 0; i < item.rows.length; i++) {
        items.push(item.rows.item(i));
      }
    });
    return items;
  } else {
    return [];
  }
};

export const searchFromTours = async (db: any, id: Number, search: string) => {
  var items: any = [];
  var results = await db.executeSql(
    `SELECT * FROM tours WHERE country_id='${id}' AND title LIKE '%${search}%'`,
  );
  
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

export const getToursById = async (db: any, id: any) => {
  var results = await db.executeSql(
    `SELECT * FROM tours where server_id=${id}`,
  );
  return results[0]?.rows?.item(0) || null;
};

export const updateTourById = async (db: any, item: any) => {
  try {
    await db.executeSql(
      `UPDATE tours SET server_id=${item?.id},country_id=${item?.country_id},title='${escapeHTML(item?.title)}',image_url='${item?.image_url}',local_path='${item?.localPath}',duration='${escapeHTML(item?.duration)}',active='${item?.active}',created_at='${item?.created_at}',updated_at='${item?.updated_at}',deleted_at='${item?.deleted_at}' WHERE server_id='${item?.id}'`,
    );
  } catch (error) {
    console.error('🚀 ~ file: tours.ts ~ updateTourById ~ error', error);
  }
};

export const deleteTourById = async (db: any, id: any) => {
  try {
    await db.executeSql(`DELETE FROM tours where server_id='${id}'`);
  } catch (error) {
    console.error('🚀 ~ file: tours.ts ~ updateToursById ~ error', error);
  }
};
