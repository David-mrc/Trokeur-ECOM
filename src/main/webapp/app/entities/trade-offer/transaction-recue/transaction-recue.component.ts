import { ITradeObject } from 'app/entities/trade-object/trade-object.model';
import { ITradeOffer } from 'app/entities/trade-offer/trade-offer.model';
import { NgbModal, NgbModalRef, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AffichageHistoriqueComponent } from '../affichage-historique/affichage-historique.component';
import { TradeOfferService } from '../service/trade-offer.service';
import { NgFor } from '@angular/common';

@Component({
  selector: 'jhi-transaction-recue',
  templateUrl: './transaction-recue.component.html',
  standalone: true,
  imports: [NgFor, NgbModule, AffichageHistoriqueComponent],
  styleUrls: ['./transaction-recue.component.scss']
})
export class TransactionRecueComponent implements OnInit {
  tradeOffers: ITradeOffer[] = [];

  constructor(private _tradeOfferService: TradeOfferService) {}

  ngOnInit(): void {
    this._tradeOfferService.getAllPendingOffersToUser().subscribe((allTradeOffers: ITradeOffer[] | null) => {
      if (allTradeOffers != null) {
        this.tradeOffers = allTradeOffers;
      }
    });
  }
}
