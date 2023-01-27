export const createUserTable = (db: any) => {
  const query =
    'CREATE TABLE IF NOT EXISTS user(id INTEGER PRIMARY KEY AUTOINCREMENT,server_id INTEGER,user_name TEXT,profile_image TEXT,email TEXT,phone INTEGER,role INTEGER,token TEXT,active TEXT);';
  return db.executeSql(query);
};

export const insertUser = (db: any, data: any, token: any) => {
  let values = `'${data?.id}','${data?.user_name}','${data?.profile_image || ''}','${data?.email}','${data?.phone}','${data?.role}','${token}','${data?.active}'`;
  const insertQuery = `INSERT INTO user (server_id,user_name,profile_image,email,phone,role,token,active) VALUES (${values})`;
  return db.executeSql(insertQuery);
};

export const getUser = async (db: any) => {
  var results = await db.executeSql('SELECT * FROM user');
  return results[0]?.rows?.item(0) || null;
};

export const updateUser = async (db: any, item: any) => {
  try {
    await db.executeSql(      
      `UPDATE user SET user_name='${item?.user_name}',profile_image='${item?.profile_image||''}',phone=${item?.phone} WHERE server_id='${item?.id}'`,
    );
  } catch (error) {
    console.log("🚀 ~ file: users.ts:24 ~ updateUser ~ error", error)
  } finally {
    var results = await db.executeSql('SELECT * FROM user');
    return results[0]?.rows?.item(0) || null;
  }
};

export const dropUser = async (db: any) => {
  await db.executeSql('DROP TABLE user');
  await createUserTable(db);
};
