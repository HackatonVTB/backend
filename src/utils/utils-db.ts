import { sequelizePGClient } from 'database/postgres/postgres-sequelize-client';
import { Transaction } from 'sequelize';

export async function dbGetTrx() {
  return await sequelizePGClient.transaction();
}

export async function dbOkTrx(transaction: Transaction) {
  await dbRunTrx(transaction.commit(), transaction);
}

export async function dbRunTrx<T>(
  promise: Promise<T>,
  transaction: Transaction,
  rollback: boolean = true
): Promise<T> | never {
  try {
    return await promise;
  } catch (error) {
    try {
      if (rollback === true) {
        await transaction.rollback();
      }
    } catch (error) {
      throw error;
    }
    throw error;
  }
}
