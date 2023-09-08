import { Component, OnInit } from '@angular/core';
import { productService } from '../product-service';

@Component({
  selector: 'jhi-list-product',
  templateUrl: './list-product.component.html',
  styleUrls: ['./list-product.component.scss']
})
export class ListProductComponent implements OnInit {


  state = '';
  imagePath = '';
  title = '';

  constructor(private _productService: productService) {}

  // Pour tester, /testComponent
  ngOnInit(): void {
    //TODO : récupérer tous les produits via un http.get via service peut etre
    //puis parcourt liste des produits, puis appel de setProduct avec chacun des produits
    // dans html, boucle sur la liste des produits
    // changer les attributs de la classe, liste de produits plutot que state,imagepath, title
    this.state = 'Neuf';
    this.imagePath = "/google";
    this.title = "titre";
    this._productService.setProduct({imagePath: this.imagePath, title: this.title, state: this.state});

  }
}
