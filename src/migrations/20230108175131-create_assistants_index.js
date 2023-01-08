export const up = async (db) => {
  await db.collection('assistants').createIndex({name: 1}, {unique: true});
};

export const down = async (db) => {
  await db.collection('assistants').dropIndex('name');
};
