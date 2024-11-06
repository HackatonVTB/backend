import { logInfo } from 'core/utils/logger';
import * as pg from 'pg';
import { ConnectionOptions, ReplicationOptions } from 'sequelize';
import { SequelizeOptions } from 'sequelize-typescript';
import { getProcessEnv } from 'utils/utils-env-config';
import { models } from './models';

function parseOptions() {
  const optionsDefault: SequelizeOptions = {};
  const optionsInit: SequelizeOptions = {};

  if (getProcessEnv().PG_DB_HOTS_LIST.length > 0) {
    const replicationOptions: ReplicationOptions = {
      write: {},
      read: [],
    };

    const splittedHostList = getProcessEnv().PG_DB_HOTS_LIST.split(','); // ['username:password@host:port']
    for (let index = 0; index < splittedHostList.length; index++) {
      const connectOptions: ConnectionOptions = {};

      let database = getProcessEnv().PG_DB_NAME;

      const splittedDetails = splittedHostList[index].split('@'); // ['username:password', 'host:port'] | ['host:port']
      if (splittedDetails.length === 2) {
        //Есть username и password
        const [username, password] = splittedDetails[0].split(':'); // ['username','password']
        const [host, port] = splittedDetails[1].split(':'); // ['host','port']

        connectOptions.host = host;
        connectOptions.port = Number(port);
        connectOptions.username = username;
        connectOptions.password = password;
        connectOptions.database = database;
      } else {
        //Нет username и password
        const [host, port] = splittedDetails[0].split(':'); // ['host','port']

        connectOptions.host = host;
        connectOptions.port = Number(port);
        connectOptions.username = getProcessEnv().PG_DB_USERNAME;
        connectOptions.password = getProcessEnv().PG_DB_PASSWORD;
        connectOptions.database = database;
      }

      //Добавляем в опции
      if (index === 0) {
        replicationOptions.write = {
          ...connectOptions,
        };
      } else {
        replicationOptions.read.push({
          ...connectOptions,
        });
      }
    }

    optionsDefault.replication = replicationOptions;
    optionsInit.replication = {
      write: {
        ...replicationOptions.write,
        database: 'postgres',
      },
      read: replicationOptions.read.map((el) => ({
        ...el,
        database: 'postgres',
      })),
    };

    logInfo('OPTIONS_DEFAULT', {
      write: optionsDefault.replication.write,
      read: optionsDefault.replication.read,
    });
    logInfo('OPTIONS_INIT', {
      write: optionsInit.replication.write,
      read: optionsInit.replication.read,
    });
  } else {
    //---
    optionsDefault.host = getProcessEnv().PG_DB_URL;
    optionsDefault.port = getProcessEnv().PG_DB_PORT;
    optionsDefault.database = getProcessEnv().PG_DB_NAME;
    optionsDefault.username = getProcessEnv().PG_DB_USERNAME;
    optionsDefault.password = getProcessEnv().PG_DB_PASSWORD;
    //---
    optionsInit.host = getProcessEnv().PG_DB_URL;
    optionsInit.port = getProcessEnv().PG_DB_PORT;
    optionsInit.database = 'postgres';
    optionsInit.username = getProcessEnv().PG_DB_USERNAME;
    optionsInit.password = getProcessEnv().PG_DB_PASSWORD;

    logInfo('OPTIONS_DEFAULT', optionsDefault);
    logInfo('OPTIONS_INIT', optionsInit);
  }

  return { optionsDefault, optionsInit };
}

function loggerSQL(sql: string, timing?: any) {
  // Executing (default):
  logInfo('PG.SQL.RUN', {
    sql,
  });
}

const optionsData = parseOptions();

export const sequelizePGOptionsInit: SequelizeOptions = {
  ...optionsData.optionsInit,
  logging: getProcessEnv().PG_DB_LOG_SQL ? loggerSQL : false,
  dialect: 'postgres',
  dialectModule: pg,
};

export const sequelizePGOptionsFull: SequelizeOptions = {
  ...optionsData.optionsDefault,
  logging: getProcessEnv().PG_DB_LOG_SQL ? loggerSQL : false,
  dialect: 'postgres',
  dialectModule: pg,
  models,
  pool: {
    max: 10,
    min: 0,
    acquire: 60000,
    idle: 10000,
  },
};
