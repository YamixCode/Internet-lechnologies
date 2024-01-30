import { db } from '../db/mysql.connector.js';
import { json, query } from 'express';
import pgPromise from 'pg-promise';
import { randomUUID } from 'crypto';

export class GoodRepository {
  pgp = pgPromise();

  constructor() {}

  getAll() {
    return db.query('SELECT * FROM "main".good', []);
  }

  getById(id) {
    return db.query(`SELECT * FROM "main".good WHERE id = $1`, [id]).catch(err => {
      console.log('При выполнении запроса произошла ошибка');
      console.log(err);
    });
  }

  getByOrderId(orderId) {
    return db.query(`SELECT * FROM "main".good WHERE order_id = $1`, [orderId]).catch(err => {
      console.log('При выполнении запроса произошла ошибка');
      console.log(err);
    });
  }

  updateById(id, name, amount) {
    return db.tx(async transaction => {
      await transaction.none('UPDATE "main".good SET amount = $1, name = $2 where id = $3', [amount, name, id]);
    });
  }

  updateAmountById(id, amount) {
    console.log('Updated good amount');
    return db.tx(async transaction => {
      await transaction.none('UPDATE "main".good SET amount = $1 where id = $2', [amount, id]);
    });
  }

  save(name, amount) {
    return db.tx(async transaction => {
      await transaction.none('INSERT INTO "main".good VALUES(default, $1, $2)', [amount, name]);
    });
  }

  deleteById(id) {
    return db.tx(async transaction => {
      await transaction.none('DELETE FROM "main".good WHERE id = $1', [id]);
    });
  }
}
