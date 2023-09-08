import { Component, OnDestroy, OnInit } from '@angular/core';
import {  Subscription } from 'rxjs';
import { productService } from '../product-service';

@Component({
  selector: 'jhi-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})


export class ProductCardComponent implements OnInit, OnDestroy{
  imagePath = '';
  title = '';
  state = '';

  subscription: Subscription = new Subscription;

  constructor(private _productService: productService) {}

  ngOnInit(): void {
    this.subscription = this._productService
      .getProduct()
      .subscribe((product) => {
        this.imagePath = product.imagePath;
        this.title = product.title;
        this.state = product.state;
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
