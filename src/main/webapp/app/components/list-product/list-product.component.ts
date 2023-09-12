import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { TradeObject } from 'app/interfaces/TradeObjectInterface';
import { productService } from '../product-service';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { NgFor } from '@angular/common';
import { ProductCardComponent } from '../product-card/product-card.component';
import { ObjectCategories } from 'app/interfaces/ObjectCategoriesInterface';

@Component({
  selector: 'jhi-list-product',
  templateUrl: './list-product.component.html',
  standalone: true,
	imports: [NgbDropdownModule, NgFor, ProductCardComponent],
  styleUrls: ['./list-product.component.scss']
})

export class ListProductComponent implements OnInit {
  tradeObjectList: TradeObject[] = [];
  categories: ObjectCategories[] = [];

  constructor(private _productService: productService, protected http: HttpClient) {}

  ngOnInit(): void {
    this._productService.getAllProducts().subscribe((tradeObjects) => {
      tradeObjects.map((tradeObject: TradeObject) => {
        this.tradeObjectList.push(tradeObject);
      })
    });

    /*
    // Pour récupérer toutes les catégories
    this._categoryService.getAllCategories().subscribe((categories) => {
      categories.map((category: ObjectCategories) => {
        this.categories.push(category);
      })
    })*/
  }

  filterByCategory(categoryId: number): void {
    this.tradeObjectList = [];
    this._productService.getFilteredProductsByCategory(categoryId).subscribe((tradeObjects) => {
      tradeObjects.map((tradeObject: TradeObject) => {
        this.tradeObjectList.push(tradeObject);
      })
    });
  }
}
