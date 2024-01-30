import { json, Router } from 'express';
import { GoodsController } from './goods.controller.js';
import { OrdersController } from './orders.controller.js';
import { GoodInOrderController } from './good_in_order.controller.js';

class AppController {
  router = Router();
  goodsController = new GoodsController();
  ordersController = new OrdersController();
  goodInOrderController = new GoodInOrderController();

  constructor() {
    this.init();
  }

  init() {
    this.goodsController.init(this.router);
    this.ordersController.init(this.router);
    this.goodInOrderController.init(this.router);

    this.router.get('/management/info', () => {
      console.log('Sent management info');
      return '{"inProduction": false}';
    });

    this.router.get('/api/orders/new', () => {
      console.log('From new-order controller');
    });
  }
}

export default new AppController().router;
