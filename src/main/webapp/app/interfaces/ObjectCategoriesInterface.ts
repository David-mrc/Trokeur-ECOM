import { TradeObject } from "./TradeObjectInterface";

export interface ObjectCategories {
  id: number;
  name: string;
  tradeObjects: null | TradeObject[];
}
