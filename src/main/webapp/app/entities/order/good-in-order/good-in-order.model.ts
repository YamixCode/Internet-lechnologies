export interface IGoodInOrder {
  good_in_order_id: number;
  good_in_order_amount: number | null;
  good_id: string | null;
  good_amount: number | null;
  good_name: string | null | undefined;
}

export type NewGoodInOrder = Omit<IGoodInOrder, 'good_in_order_id'> & { good_in_order_id: null };
