import { Router } from 'express';
import { GoodRepository } from '../repository/good.repository.js';

export class GoodsController {
  goodRepository = new GoodRepository();

  constructor() {}

  init(router) {
    router.get('/api/goods', (req, res) => {
      this.goodRepository.getAll().then(results => {
        res.status(200).json(results);
        console.log('Successfully returned goods list');
      });
    });

    router.get('/api/goods/:id', (req, res) => {
      const id = req.params.id;
      this.goodRepository
        .getById(id)
        .then(results => {
          res.status(200).json(results[0]);
          console.log(results);
          console.log('Successfully returned info of the good with id ' + req.params.id);
        })
        .catch(err => this.onQueryError(err));
    });

    router.get('/api/goods/getGoodsByOrderId/:orderId', (req, res) => {
      const orderId = req.params.orderId;
      console.log(orderId);
      this.goodRepository
        .getById(orderId)
        .then(results => {
          res.status(200).json(results[0]);
          console.log(results);
          console.log('Successfully returned info of the good with id ' + req.params.id);
        })
        .catch(err => this.onQueryError(err));
    });

    router.put('/api/goods/:id', (req, res) => {
      const id = req.params.id;
      const amount = req.body.amount;
      const name = req.body.name;
      this.goodRepository
        .updateById(id, name, amount)
        .then(results => {
          res.status(200).json(results);
          console.log('Successfully updated good with id ' + id);
        })
        .catch(err => this.onQueryError(err));
    });

    router.post('/api/goods', (req, res) => {
      const amount = req.body.amount;
      const name = req.body.name;
      this.goodRepository
        .save(name, amount)
        .then(results => {
          res.status(200).json(results);
        })
        .catch(err => this.onQueryError(err));
    });

    router.delete('/api/goods/:id', (req, res) => {
      const id = req.params.id;
      this.goodRepository
        .deleteById(id)
        .then(results => {
          res.status(200).json(results);
          console.log('Successfully updated good with id ' + id);
        })
        .catch(err => this.onQueryError(err));
    });

    router.put('/api/goods/amount/:id', (req, res) => {
      const id = req.params.id;
      const amount = req.body.amount;
      this.goodRepository.updateAmountById(id, amount).then(results => {
        res.status(200).json(results);
        console.log('Successfully updated good with id ' + id);
      });
      console.log('From new goods controller');
    });
  }

  onQueryError(err) {
    console.log('При выполнении запроса произошла ошибка');
    console.log(err);
  }
}
