import { NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { TradeObject } from 'app/interfaces/TradeObjectInterface';
import { ProductCardComponent } from '../product-card/product-card.component';
import { productService } from '../product-service';
import { AccountService } from '../../core/auth/account.service';

@Component({
  selector: 'jhi-my-products',
  templateUrl: './my-products.component.html',
  standalone: true,
  imports: [ProductCardComponent, NgIf, NgFor],
  styleUrls: ['./my-products.component.scss']
})
export class MyProductsComponent implements OnInit {
  myTradeObjects: TradeObject[] = [];
  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  isAuthenticated: boolean = false;

  constructor(private _productService: productService, private _accountService: AccountService, protected http: HttpClient) {}

  ngOnInit(): void {
    this.isAuthenticated = this._accountService.isAuthenticated();
    this._productService.getMyActiveProducts().subscribe((tradeObjects) => {
      tradeObjects.map((tradeObject: TradeObject) => {
        this.myTradeObjects.push(tradeObject);
      })
    });
  }
}
