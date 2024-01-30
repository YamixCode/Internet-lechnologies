import { app } from './express/express.initializer.js';
import { db, deleteExpiredOrdersOnStartup } from './db/mysql.connector.js';

db.connect().then(() => {
  console.log('Connected to database successfully!');
  deleteExpiredOrdersOnStartup()
    .then(console.log('Удаление успешно!'))
    .catch(err => {
      console.log('Ошибка при удалении истекших заказов');
      console.log(err);
    });
});

const port = 8080;

app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});
