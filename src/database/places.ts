import {format} from 'pretty-format';
import escapeHTML from '../helpers/entity-escape';

export const createPlacesTable = (db: any) => {
  const query =
    'CREATE TABLE IF NOT EXISTS places(id INTEGER PRIMARY KEY AUTOINCREMENT,server_id INTEGER,tour_id INTEGER,title TEXT,sub_title TEXT,video_url TEXT,audio_url TEXT,image_url TEXT,local_path TEXT,description TEXT,active TEXT,place_images TEXT,created_at TEXT,updated_at TEXT,deleted_at TEXT);';
  return db.executeSql(query);
};

export const insertPlaces = (db: any, item: any) => {
  let str = `${item?.id},${item?.tour_id},'${escapeHTML(item?.title)}','${escapeHTML(item?.sub_title||'')}','${item?.video_url||''}','${item?.audio_url||''}','${item?.image_url}','${item?.localPath}','${escapeHTML(item?.description)}','${item?.active}','${JSON.stringify(item?.gallery)}','${item?.created_at}','${item?.updated_at}','${item?.deleted_at}'`
  const insertQuery = `INSERT INTO places (server_id,tour_id,title,sub_title,video_url,audio_url,image_url,local_path,description,active,place_images,created_at,updated_at,deleted_at) VALUES (${str})`;
  return db.executeSql(insertQuery);
};

export const getAllPlaces = async (db: any,id:Number) => {
  var items: any = [];
  var results = await db.executeSql(`SELECT * FROM places WHERE tour_id='${id}'`);
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

export const searchFromPlaces = async (db: any, id: Number, search: string) => {
  var items: any = [];
  var results = await db.executeSql(
    `SELECT * FROM places WHERE tour_id='${id}' AND title LIKE '%${search}%'`,
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

export const getPlaceById = async (db: any, id: any) => {
  var results = await db.executeSql(
    `SELECT * FROM places where server_id=${id}`,
  );
  return results[0]?.rows?.item(0) || null;
};

export const updatePlaceById = async (db: any, item: any) => {
  try {
    await db.executeSql(
      `UPDATE places SET server_id=${item?.id},tour_id=${item?.tour_id},title='${escapeHTML(item?.title)}',sub_title='${escapeHTML(item?.sub_title||'')}',video_url='${item?.video_url||''}',audio_url='${item?.audio_url||''}',image_url='${item?.image_url}',local_path='${item?.localPath}',description='${escapeHTML(item?.description)}',active='${item?.active}',place_images='${JSON.stringify(item?.gallery)}',created_at='${item?.created_at}',updated_at='${item?.updated_at}',deleted_at='${item?.deleted_at}' WHERE server_id='${item?.id}'`,
    );
  } catch (error) {
    console.error('🚀 ~ file: places.ts ~ updatePlaceById ~ error', error);
  }
};

export const deletePlaceById = async (db: any, id: any) => {
  try {
    await db.executeSql(`DELETE FROM places where server_id='${id}'`);
  } catch (error) {
    console.error('🚀 ~ file: country.ts ~ updatePlaceById ~ error', error);
  }
};