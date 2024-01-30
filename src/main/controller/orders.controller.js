import { OrderRepository } from '../repository/order.repository.js';

export class OrdersController {
  orderRepository = new OrderRepository();

  constructor() {}

  init(router) {
    router.get('/api/orders', (req, res) => {
      this.orderRepository.getAll().then(results => {
        res.status(200).json(results);
        console.log('Successfully returned orders list');
      });
    });

    router.get('/api/orders/:id', (req, res) => {
      const id = req.params.id;
      this.orderRepository
        .getById(id)
        .then(results => {
          res.status(200).json(results[0]);
          console.log(results);
          console.log('Successfully returned info of the order with id ' + req.params.id);
        })
        .catch(err => this.onQueryError(err));
    });

    router.put('/api/orders/:id', (req, res) => {
      const id = req.params.id;
      const date = req.body.date;
      const name = req.body.name;
      this.orderRepository.updateById(id, name, date).then(results => {
        res.status(200).json(results);
        console.log('Successfully updated order with id ' + id);
      });
    });

    router.post('/api/orders', (req, res) => {
      const date = req.body.date;
      const name = req.body.name;
      console.log(date);
      this.orderRepository.save(name, date).then(results => {
        res.status(200).json(results);
      });
    });

    router.delete('/api/orders/:id', (req, res) => {
      const id = req.params.id;
      this.orderRepository.deleteById(id).then(results => {
        res.status(200).json(results);
        console.log('Successfully updated good with id ' + id);
      });
    });
  }

  onQueryError(err) {
    console.log('При выполнении запроса произошла ошибка');
    console.log(err);
  }
}
