import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

interface TradeObject {
  imagePath: string;
  title: string;
  state: string;
}
@Injectable({
  providedIn: "root"
})

export class productService {
  private _product = new BehaviorSubject<TradeObject>({
    imagePath: '',
    title: '',
    state: ''
  })

  private _product$ = this._product.asObservable();

  getProduct(): Observable<TradeObject> {
    return this._product$;
  }

  setProduct(latestValue: TradeObject): void {
    return this._product.next(latestValue);
  }

}
