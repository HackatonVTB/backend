import { pgInit } from './postgres-sequelize-client';

pgInit({
  constraintsCreate: true,
  sync: true,
  syncForce: true,
})
  .then(() => {
    console.log('pgMigrateInitTargetDB.OK');
  })
  .catch((err) => {
    console.log('pgMigrateInitTargetDB.ERROR', err);
  });
