import dayjs from 'dayjs/esm';

import { IOrder, NewOrder } from './order.model';

export const sampleWithRequiredData: IOrder = {
  id: 47761,
};

export const sampleWithPartialData: IOrder = {
  id: 52696,
  date: dayjs('2024-01-15T04:15'),
};

export const sampleWithFullData: IOrder = {
  id: 34054,
  name: 'Ярославская Franc',
  date: dayjs('2024-01-15T19:55'),
};

export const sampleWithNewData: NewOrder = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
