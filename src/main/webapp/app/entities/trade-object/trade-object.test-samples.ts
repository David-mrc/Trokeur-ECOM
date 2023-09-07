import { TradeObjectState } from 'app/entities/enumerations/trade-object-state.model';

import { ITradeObject, NewTradeObject } from './trade-object.model';

export const sampleWithRequiredData: ITradeObject = {
  id: 17448,
  name: 'rouille Coordinateur',
  state: 'Mauvais',
  stock: 25093,
};

export const sampleWithPartialData: ITradeObject = {
  id: 6890,
  name: 'Superviseur Ouest vert',
  state: 'Mauvais',
  stock: 2989,
};

export const sampleWithFullData: ITradeObject = {
  id: 5209,
  name: 'retrait derechef Guinée',
  description: '../fake-data/blob/hipster.txt',
  state: 'Bon',
  stock: 20333,
};

export const sampleWithNewData: NewTradeObject = {
  name: 'ronron derrière',
  state: 'Moyen',
  stock: 12902,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
