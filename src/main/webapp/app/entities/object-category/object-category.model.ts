import { ITradeObject } from 'app/entities/trade-object/trade-object.model';

export interface IObjectCategory {
  id: number;
  name?: string | null;
  tradeObjects?: Pick<ITradeObject, 'id'>[] | null;
}

export type NewObjectCategory = Omit<IObjectCategory, 'id'> & { id: null };
