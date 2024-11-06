class ProcessENV {
  //Порт для запуска самого сервера
  public SERVER_PORT: number = 3000; //При запуске через ДОКЕР - НЕ МЕНЯТЬ !
  public SERVER_URL: string = '';

  //PG - MAIN
  public PG_DB_URL: string = 'localhost';
  public PG_DB_PORT: number = 5432;
  public PG_DB_NAME: string = 'dev_example_db';
  public PG_DB_USERNAME: string = '';
  public PG_DB_PASSWORD: string = '';
  public PG_DB_LOG_SQL: boolean = true;

  //PG - REPLICA
  public PG_DB_HOTS_LIST: string = '';
}

let processENV: ProcessENV | null = null;

export function getProcessEnv(): ProcessENV {
  if (processENV === null) {
    processENV = new ProcessENV();

    if (typeof process.env.SERVER_PORT === 'string') {
      processENV.SERVER_PORT = Number(process.env.SERVER_PORT);
    }
    if (typeof process.env.SERVER_URL === 'string') {
      processENV.SERVER_URL = process.env.SERVER_URL;
    }

    //DB - PostgreSQL
    if (typeof process.env.PG_DB_URL === 'string') {
      processENV.PG_DB_URL = process.env.PG_DB_URL;
    }
    if (typeof process.env.PG_DB_PORT === 'string') {
      processENV.PG_DB_PORT = Number(process.env.PG_DB_PORT);
    }
    if (typeof process.env.PG_DB_NAME === 'string') {
      processENV.PG_DB_NAME = process.env.PG_DB_NAME;
    }
    if (typeof process.env.PG_DB_USERNAME === 'string') {
      processENV.PG_DB_USERNAME = process.env.PG_DB_USERNAME;
    }
    if (typeof process.env.PG_DB_PASSWORD === 'string') {
      processENV.PG_DB_PASSWORD = process.env.PG_DB_PASSWORD;
    }
    if (typeof process.env.PG_DB_LOG_SQL === 'string') {
      processENV.PG_DB_LOG_SQL = process.env.PG_DB_LOG_SQL === 'true';
    }

    //PG - REPLICA
    if (typeof process.env.PG_DB_HOTS_LIST === 'string') {
      processENV.PG_DB_HOTS_LIST = process.env.PG_DB_HOTS_LIST;
    }
  }
  return processENV;
}
