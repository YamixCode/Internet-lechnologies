import { GoodInOrderRepository } from '../repository/good_in_order.repository.js';

export class GoodInOrderController {
  goodInOrderRepository = new GoodInOrderRepository();

  constructor() {}

  init(router) {
    router.get('/api/goodInOrder/:orderId', (req, res) => {
      const orderId = req.params.orderId;
      this.goodInOrderRepository
        .getByOrderId(orderId)
        .then(results => {
          res.status(200).json(results);
          console.log('Successfully returned goods in order list');
        })
        .catch(err => this.onQueryError(err));
    });

    router.post('/api/goodInOrder/:orderId', (req, res) => {
      const orderId = req.params.orderId;
      const good_amount = req.body.good_in_order_amount;
      const good_id = req.body.good_id;

      this.goodInOrderRepository
        .addNewGoodToOrder(good_id, orderId, good_amount)
        .then(results => {
          res.status(200).json(results);
          console.log('Successfully added new good to good-in-order');
        })
        .catch(err => this.onQueryError(err));
    });

    router.put('/api/goodInOrder/:id/:orderId', (req, res) => {
      console.log('enterd update controller');
      const id = req.params.id;
      const orderId = req.params.orderId;
      const amount = req.body.good_in_order_amount;
      const good_id = req.body.good_id;

      this.goodInOrderRepository
        .updateById(id, amount)
        .then(results => {
          res.status(200).json(results);
          console.log('Successfully added new good to good-in-order');
        })
        .catch(err => this.onQueryError(err));
    });

    router.delete('/api/goodInOrder/:id', (req, res) => {
      console.log('from delete');
      const id = req.params.id;

      this.goodInOrderRepository
        .deleteById(id)
        .then(results => {
          res.status(200).json(results);
          console.log('Successfully deleted good ');
        })
        .catch(err => this.onQueryError(err));
    });
  }

  onQueryError(err) {
    console.log('При выполнении запроса произошла ошибка');
    console.log(err);
  }
}
