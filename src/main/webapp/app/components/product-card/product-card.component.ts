import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TradeObject } from 'app/interfaces/TradeObjectInterface';
import { StateComponent } from '../state/state.component';


@Component({
  selector: 'jhi-product-card',
  templateUrl: './product-card.component.html',
  standalone: true,
  imports: [StateComponent, NgIf],
  styleUrls: ['./product-card.component.scss']
})

export class ProductCardComponent {
  @Input() tradeObject: TradeObject | undefined;
  @Input() isPublic = true;

  getPathToFirstImage(): string {
    if (this.tradeObject?.genericImages?.[0]) {
      return this.tradeObject.genericImages[0].imagePath;
    } else {
      return "/content/images/logoTrokeur.png";
    }
  }
}
