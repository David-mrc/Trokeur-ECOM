import { NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { TradeObject } from 'app/interfaces/TradeObjectInterface';
import { ProductCardComponent } from '../product-card/product-card.component';
import { productService } from '../product-service';

@Component({
  selector: 'jhi-my-products',
  templateUrl: './my-products.component.html',
  standalone: true,
  imports: [ProductCardComponent, NgIf, NgFor],
  styleUrls: ['./my-products.component.scss']
})
export class MyProductsComponent implements OnInit {
  myTradeObjects: TradeObject[] = [];

  constructor(private _productService: productService, protected http: HttpClient) {}

  ngOnInit(): void {
    this._productService.getMyProducts().subscribe((tradeObjects) => {
      tradeObjects.map((tradeObject: TradeObject) => {
        this.myTradeObjects.push(tradeObject);
      })
    });
  }
}
