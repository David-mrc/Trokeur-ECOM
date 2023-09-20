import { ITradeObject } from 'app/entities/trade-object/trade-object.model';
import { ITradeOffer } from 'app/entities/trade-offer/trade-offer.model';
import { Component, OnInit } from '@angular/core';
import { AffichageHistoriqueComponent } from '../affichage-historique/affichage-historique.component';
import { TradeOfferService } from '../service/trade-offer.service';
import { NgFor } from '@angular/common';

@Component({
  selector: 'jhi-historique-transactions',
  templateUrl: './historique-transactions.component.html',
  standalone: true,
  imports: [NgFor, AffichageHistoriqueComponent],
  styleUrls: ['./historique-transactions.component.scss']
})
export class HistoriqueTransactionsComponent implements OnInit {
  tradeOffers: ITradeOffer[] = [];

  constructor(private _tradeOfferService: TradeOfferService) {}

  ngOnInit(): void {
    this._tradeOfferService.getAllNonPendingOffersOfUser().subscribe((allTradeOffers: ITradeOffer[] | null) => {
      if (allTradeOffers != null) {
        this.tradeOffers = allTradeOffers;
      }
    });
  }
}
