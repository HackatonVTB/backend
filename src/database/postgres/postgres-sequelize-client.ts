import { logError, logInfo } from 'core/utils/logger';
import { QueryTypes } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { getProcessEnv } from 'utils/utils-env-config';
import { POSTGRES_CONSTANTS } from './constants';
import { pgConstraintList } from './constraints';
import { sequelizePGOptionsFull, sequelizePGOptionsInit } from './postgres-sequelize-config';

type PGInitOptions = {
  dbDrop?: boolean;
  dbCreate?: boolean;
  extensionsDrop?: boolean;
  extensionsCreate?: boolean;
  sync?: boolean;
  syncAlter?: boolean;
  syncForce?: true;
  constraintsCreate?: boolean;
};

export const sequelizePGClient = new Sequelize(sequelizePGOptionsFull);
const sequelizePGInitClient = new Sequelize(sequelizePGOptionsInit);

async function pgIsDBExist(useMaster: boolean) {
  logInfo('pgIsDBExist.INIT');

  const query = `SELECT datname FROM pg_database WHERE datname = '${getProcessEnv().PG_DB_NAME}'`;

  let dbList = await sequelizePGInitClient.query(query, {
    type: QueryTypes.SELECT,
    useMaster,
  });

  logInfo('pgIsDBExist.OK');

  return dbList.length > 0;
}

async function pgWaitDataBaseCreate() {
  logInfo('pgWaitDataBaseCreate.INIT');

  let isExistMaster = await pgIsDBExist(true);
  let isExistReplica = await pgIsDBExist(false);

  while (!isExistMaster || !isExistReplica) {
    await new Promise((r) => setTimeout(r, 200));
    isExistMaster = await pgIsDBExist(true);
    isExistReplica = await pgIsDBExist(false);
  }

  logInfo('pgWaitDataBaseCreate.OK');
}

export async function pgInit(options: PGInitOptions = {}) {
  logInfo('pgInit.INIT');

  await sequelizePGInitClient.authenticate({
    logging: true,
  });

  if (options.dbDrop === true) {
    logInfo('pgInit.dbDrop.INIT');

    const isExist = await pgIsDBExist(true);
    if (isExist === true) {
      await sequelizePGInitClient
        .getQueryInterface()
        .dropDatabase(getProcessEnv().PG_DB_NAME, {
          logging: true,
          useMaster: true,
        })
        .catch((err) => {
          logError('pgInit.dropDatabase.ERROR', err);
          throw err;
        });
    }

    logInfo('pgInit.dbDrop.OK');
  }

  if (options.dbCreate === true) {
    logInfo('pgInit.dbCreate.INIT');

    const isExist = await pgIsDBExist(true);
    if (!isExist) {
      await sequelizePGInitClient
        .getQueryInterface()
        .createDatabase(getProcessEnv().PG_DB_NAME, {
          logging: true,
          useMaster: true,
        })
        .catch((err) => {
          logError('pgInit.createDatabase.ERROR', err);
          throw err;
        });
    }

    logInfo('pgInit.dbCreate.OK');
  }

  await pgWaitDataBaseCreate();

  await sequelizePGInitClient.close();

  await sequelizePGClient
    .authenticate({
      logging: true,
    })
    .catch((err) => {
      logError('pgInit.authenticate.ERROR', err);
      throw err;
    });

  if (options.extensionsDrop === true) {
    logInfo('pgInit.extensionsDrop.INIT');

    for (const el of POSTGRES_CONSTANTS.extensionList) {
      await sequelizePGClient
        .query(`DROP EXTENSION IF EXISTS "${el}";`, {
          type: QueryTypes.RAW,
          logging: true,
          useMaster: true,
        })
        .catch((err) => {
          logError('pgInit.dropExtension.ERROR', err);
        });
    }

    logInfo('pgInit.extensionsDrop.OK');
  }

  if (options.extensionsCreate === true) {
    logInfo('pgInit.extensionsCreate.INIT');

    for (const el of POSTGRES_CONSTANTS.extensionList) {
      await sequelizePGClient
        .query(`CREATE EXTENSION IF NOT EXISTS "${el}";`, {
          type: QueryTypes.RAW,
          logging: true,
          useMaster: true,
        })
        .catch((err) => {
          logError('pgInit.createExtension.ERROR', err);
        });
    }

    logInfo('pgInit.extensionsCreate.OK');
  }

  if (options.sync === true) {
    logInfo('pgInit.sync.INIT');

    await sequelizePGClient
      .sync({
        alter: options.syncAlter,
        force: options.syncForce,
      })
      .catch((err) => {
        logError('pgInit.sync.ERROR', err);
        throw err;
      });

    logInfo('pgInit.sync.OK');
  }

  if (options.constraintsCreate === true) {
    logInfo('pgInit.constraintsCreate.INIT');

    for (const el of pgConstraintList()) {
      await sequelizePGClient
        .getQueryInterface()
        .addConstraint(el.tableName, el.options)
        .catch((err) => {
          logError('pgInit.addConstraint.ERROR', err);
        });
    }

    logInfo('pgInit.constraintsCreate.OK');
  }

  logInfo('pgInit.OK');
}
