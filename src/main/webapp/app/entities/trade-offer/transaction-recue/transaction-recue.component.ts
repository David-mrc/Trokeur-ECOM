import { ITradeObject } from 'app/entities/trade-object/trade-object.model';
import { ITradeOffer } from 'app/entities/trade-offer/trade-offer.model';
import { Component, OnInit } from '@angular/core';
import { AffichageHistoriqueComponent } from '../affichage-historique/affichage-historique.component';
import { TradeOfferService } from '../service/trade-offer.service';

@Component({
  selector: 'jhi-transaction-recue',
  templateUrl: './transaction-recue.component.html',
  styleUrls: ['./transaction-recue.component.scss']
})
export class TransactionRecueComponent implements OnInit {
  tradeOffers: ITradeOffer[] = [];

  constructor(private _tradeOfferService: TradeOfferService) {}

  ngOnInit(): void {
    this._tradeOfferService.getAllPendingOffersToUser().subscribe((allTradeOffers: ITradeOffer[] | null) => {
      console.log(allTradeOffers);
      if (allTradeOffers != null) {
        this.tradeOffers = allTradeOffers;
      }
    });
  }
}
