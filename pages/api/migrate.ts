import { NextApiResponse, NextApiRequest } from 'next';
import getConfig from 'next/config';
import { getDirectusClient } from '../../lib/directus';

const {
  publicRuntimeConfig: { prefix },
} = getConfig();

const migrateCollection = async (data: any) => {
  const { from, to } = data;
  const directus = await getDirectusClient();
  const errors = [];
  const { data: collections } = await directus.collections.readAll();
  await collections.reduce(async (lastPromise, collection) => {
    const accum = await lastPromise;
    const { collection: collectionName, schema } = collection;
    if (collectionName.startsWith(from)) {
      const newCollection = collection;
      if (schema) {
        const fields = await directus.fields.readMany(collectionName);
        const newFields = fields.data.map((field) => {
          const { meta } = field;
          delete meta.id;
          const newMeta = meta;
          if (meta.interface === 'file-image') {
            newMeta.options = null;
          }
          const newField = {
            ...field,
            meta: newMeta,
          };
          return newField;
        });
        newCollection.fields = newFields;
      }
      const json = JSON.stringify(newCollection).replaceAll(from, to);
      const res = JSON.parse(json);
      try {
        const result = await directus.collections.createOne(res);
      } catch (e) {
        console.log(['collection', res, e]);
        errors.push(res);
      }
    }
    return [...accum, {}];
  }, Promise.resolve([]));
  if (errors.length > 0) {
    await errors.reduce(async (lastPromise, error) => {
      const accum = await lastPromise;
      try {
        const result = await directus.collections.createOne(error);
      } catch (e) {
        console.log(e);
      }
      return [...accum, {}];
    }, Promise.resolve([]));
  }

  const relations = await directus.relations.readAll();
  await relations.reduce(async (lastPromise, relation) => {
    const accum = await lastPromise;
    const { collection: collectionName } = relation;
    if (collectionName.startsWith(from)) {
      const { meta } = relation;
      delete meta.id;
      const newMeta = meta;
      const newRelation = {
        ...relation,
        meta: newMeta,
      };
      const json = JSON.stringify(newRelation).replaceAll(from, to);
      const res = JSON.parse(json);
      try {
        const result = await directus.relations.createOne(res);
      } catch (e) {
        console.log(['relation', res, e]);
      }
    }
    return [...accum, {}];
  }, Promise.resolve([]));

  await directus.folders.createOne({
    name: to,
    rootline: to,
  });

  const { data: roles } = await directus.roles.readByQuery();
  await roles.reduce(async (lastPromise, role) => {
    const accum = await lastPromise;
    const { id, name, icon, app_access } = role;
    if (name.startsWith(from)) {
      const newRole = {
        name: name.replaceAll(from, to),
        icon,
        app_access,
      }
      try {
        const { id: newRoleId } = await directus.roles.createOne(newRole);
        const { data: permissions } = await directus.permissions.readByQuery({
          filter: { role: { _eq: id } },
        })
        await permissions.reduce(async (lastPromise, permission) => {
          const { collection } = permission;
          const accum = await lastPromise;
          delete permission.id;
          const newPermission = {
            ...permission,
            role: newRoleId,
            collection: collection.replaceAll(from, to)
          }
          try {
            await directus.permissions.createOne(newPermission);
          } catch (e) {
            console.log(e);
          }
          return [...accum, {}];

        }, Promise.resolve([]));
      } catch (e) {
        console.log(e);
      }
    }
    return [...accum, {}];
  }, Promise.resolve([])); 
}  

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const { method, body } = _req;
  if (method === 'POST') {
    const res = await migrateCollection(body);
  }
  res.setHeader('Access-Control-Allow-Origin', ['*']);
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.status(200).json({
    message: 'Ok',
  });
}
