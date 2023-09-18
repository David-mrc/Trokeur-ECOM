import { ITradeObject } from 'app/entities/trade-object/trade-object.model';
import { ITradeOffer } from 'app/entities/trade-offer/trade-offer.model';
import { Component, Input, OnInit } from '@angular/core';
import { TradeOfferService } from '../service/trade-offer.service';

@Component({
  selector: 'app-affichage-historique',
  templateUrl: './affichage-historique.component.html',
  styleUrls: ['./affichage-historique.component.scss']
})

export class AffichageHistoriqueComponent implements OnInit {
  @Input() tradeOffer: ITradeOffer | undefined;
  @Input() recues: boolean = false;
  @Input() propose: boolean = false;
  proposedObject: ITradeObject | undefined;
  wantedObject: ITradeObject | undefined;

  constructor(private _tradeOfferService: TradeOfferService) {}

  ngOnInit(): void {
    this.loadProposedObject();
    this.loadWantedObject();
  }

  loadProposedObject(): void {
    if (this.tradeOffer) {
      this._tradeOfferService.getProposedTradeObject(this.tradeOffer.id).subscribe((tradeObject: ITradeObject | null) => {
        if (tradeObject) {
          this.proposedObject = tradeObject;
          console.log(this.proposedObject);
        }
      })
    }
  }

  loadWantedObject(): void {
    if (this.tradeOffer) {
      this._tradeOfferService.getWantedTradeObject(this.tradeOffer.id).subscribe((tradeObject: ITradeObject | null) => {
        if (tradeObject) {
          this.wantedObject = tradeObject;
        }
      })
    }
  }
}


