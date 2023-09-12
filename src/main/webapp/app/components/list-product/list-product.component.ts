import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { TradeObject } from 'app/interfaces/TradeObjectInterface';
import { productService } from '../product-service';

@Component({
  selector: 'jhi-list-product',
  templateUrl: './list-product.component.html',
  styleUrls: ['./list-product.component.scss']
})

export class ListProductComponent implements OnInit {

  tradeObjectList: TradeObject[] = [];

  constructor(private _productService: productService, protected http: HttpClient) {}

  ngOnInit(): void {
    this._productService.getAllProducts().subscribe((tradeObjects) => {
      tradeObjects.map((tradeObject: TradeObject) => {
        this.tradeObjectList.push(tradeObject);
      })
    });
  }
}
