import { Component, OnInit } from '@angular/core';
import { AffichageHistoriqueComponent } from '../affichage-historique/affichage-historique.component';
import { ITradeOffer } from '../trade-offer.model';
import { TradeOfferService } from '../service/trade-offer.service';

@Component({
  selector: 'jhi-transaction-propose',
  templateUrl: './transaction-propose.component.html',
  styleUrls: ['./transaction-propose.component.scss']
})
export class TransactionProposeComponent implements OnInit {
  tradeOffers: ITradeOffer[] = [];

  constructor(private _tradeOfferService: TradeOfferService) {}

  ngOnInit(): void {
    this._tradeOfferService.getAllPendingOffersFromUser().subscribe((allTradeOffers: ITradeOffer[] | null) => {
      if (allTradeOffers != null) {
        this.tradeOffers = allTradeOffers;
      }
    });
  }
}
