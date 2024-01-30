import { db } from '../db/mysql.connector.js';
import { json, query } from 'express';
import pgPromise from 'pg-promise';
import { randomUUID } from 'crypto';

export class GoodInOrderRepository {
  pgp = pgPromise();

  constructor() {}

  getByOrderId(orderId) {
    return db.query(
      'SELECT good_in_order.id as good_in_order_id,\n' +
        '       good_id as good_in_order_good_id,\n' +
        '       good_in_order.amount as good_in_order_amount,\n' +
        '       g.id as good_id,\n' +
        '       g.amount as good_amount,\n' +
        '       g.name as good_name\n' +
        'FROM "main".good_in_order\n' +
        '    LEFT JOIN "main".good g on good_in_order.good_id = g.id\n' +
        'WHERE good_in_order.order_id = $1',
      [orderId]
    );
  }

  addNewGoodToOrder(goodId, orderId, amount) {
    return db.tx(async transaction => {
      await transaction.none('INSERT INTO "main".good_in_order VALUES(default, $1, $2, $3)', [goodId, orderId, amount]);
    });
  }

  updateById(id, amount) {
    return db.tx(async transaction => {
      await transaction.none('UPDATE "main".good_in_order SET ' + 'amount = $1 WHERE id = $2', [amount, id]);
    });
  }

  deleteById(id) {
    return db.tx(async transaction => {
      await transaction.none('DELETE FROM "main".good_in_order WHERE id = $1', [id]);
    });
  }
}
