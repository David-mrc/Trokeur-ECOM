import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { TradeObject } from 'app/interfaces/TradeObjectInterface';
import { productService } from '../product-service';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { NgFor, NgIf } from '@angular/common';
import { ProductCardComponent } from '../product-card/product-card.component';
import { ObjectCategories } from 'app/interfaces/ObjectCategoriesInterface';
import { categoryService } from '../category-service';

@Component({
  selector: 'jhi-list-product',
  templateUrl: './list-product.component.html',
  standalone: true,
	imports: [NgbDropdownModule, NgFor, ProductCardComponent, NgIf],
  styleUrls: ['./list-product.component.scss']
})

export class ListProductComponent implements OnInit {
  tradeObjectList: TradeObject[] = [];
  categories: ObjectCategories[] = [];
  selectedCategory: ObjectCategories | undefined;

  constructor(
    private _productService: productService,
    protected http: HttpClient,
    private _categoryService: categoryService) {}

  ngOnInit(): void {
    this.fetchProduct();

    // Pour récupérer toutes les catégories
    this._categoryService.getAllCategories().subscribe((categories) => {
      categories.map((category: ObjectCategories) => {
        this.categories.push(category);
      })
    })
  }

  filterByCategory(category: ObjectCategories): void {
    if (this.selectedCategory && category.id === this.selectedCategory.id) {
      this.fetchProduct();
      this.selectedCategory = undefined;
    } else {
      this.selectedCategory = category;
      this.tradeObjectList = [];
      this._productService.getFilteredProductsByCategory(this.selectedCategory.id).subscribe((tradeObjects) => {
        tradeObjects.map((tradeObject: TradeObject) => {
          this.tradeObjectList.push(tradeObject);
        })
      });
    }
  }

  resetCategory(): void {
    this.selectedCategory = undefined;
    this.fetchProduct();
  }

  fetchProduct(): void {
    this.tradeObjectList = [];
    this._productService.getAllProducts().subscribe((tradeObjects) => {
      tradeObjects.map((tradeObject: TradeObject) => {
        this.tradeObjectList.push(tradeObject);
      })
    });
  }
}
