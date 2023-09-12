import { TradeObject } from "./TradeObjectInterface";

export interface GenericImage {
  id: number;
  imagePath: string;
  tradeObject: null | TradeObject;
}
