import { IGood, NewGood } from './good.model';

export const sampleWithRequiredData: IGood = {
  id: 94210,
};

export const sampleWithPartialData: IGood = {
  id: 50826,
  name: 'Туркменистан',
};

export const sampleWithFullData: IGood = {
  id: 60184,
  amount: 638,
  name: 'invoice',
};

export const sampleWithNewData: NewGood = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
