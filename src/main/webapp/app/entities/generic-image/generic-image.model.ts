import { ITradeObject } from 'app/entities/trade-object/trade-object.model';

export interface IGenericImage {
  id: number;
  imagePath?: string | null;
  tradeObject?: Pick<ITradeObject, 'id'> | null;
}

export type NewGenericImage = Omit<IGenericImage, 'id'> & { id: null };
