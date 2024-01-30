import { db } from '../db/mysql.connector.js';
import { json, query } from 'express';
import pgPromise from 'pg-promise';
import { randomUUID } from 'crypto';

export class OrderRepository {
  pgp = pgPromise();

  constructor() {}

  getAll() {
    return db.query('SELECT * FROM "main".order_info', []);
  }

  getById(id) {
    return db.query(`SELECT * FROM "main".order_info WHERE id = $1`, [id]).catch(err => {
      console.log('При выполнении запроса произошла ошибка');
      console.log(err);
    });
  }

  updateById(id, name, date) {
    return db.tx(async transaction => {
      await transaction.none('UPDATE "main".order_info SET name = $1, date = $2 where id = $3', [name, date, id]);
    });
  }

  save(name, date) {
    return db.tx(async transaction => {
      await transaction.none('INSERT INTO "main".order_info VALUES(default, $1, $2)', [name, date]);
    });
  }

  deleteById(id) {
    return db.tx(async transaction => {
      await transaction.none('DELETE FROM "main".order_info WHERE id = $1', [id]);
    });
  }

  deleteExpiredOrdersOnStartup() {
    console.log('Удаление истекших заказов...');
    return db.tx(async transaction => {
      await transaction.none('delete from "main".order_info where date < CURRENT_TIMESTAMP', []);
    });
  }
}
