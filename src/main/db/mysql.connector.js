import pgPromise from 'pg-promise';

const connection = {
  host: 'localhost', // server name or IP address;
  port: 5433,
  database: 'postgres',
  user: 'postgres',
  password: '1234',
};

const pgp = pgPromise({});
export const db = pgp(connection);

export function deleteExpiredOrdersOnStartup() {
  console.log('Удаление истекших заказов...');
  return db.tx(async transaction => {
    await transaction.none('delete from "main".order_info where date < CURRENT_TIMESTAMP', []);
  });
}
