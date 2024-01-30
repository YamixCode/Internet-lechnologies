import dayjs from 'dayjs/esm';

export interface IOrder {
  id: string;
  name?: string | null;
  date?: dayjs.Dayjs | null;
}

export type NewOrder = Omit<IOrder, 'id'> & { id: null };
