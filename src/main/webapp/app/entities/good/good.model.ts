export interface IGood {
  id: string;
  amount?: number | null;
  name?: string | null;
}

export type NewGood = Omit<IGood, 'id'> & { id: null };
