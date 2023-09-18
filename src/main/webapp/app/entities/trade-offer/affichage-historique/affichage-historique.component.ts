import { ITradeObject } from 'app/entities/trade-object/trade-object.model';
import { ITradeOffer } from 'app/entities/trade-offer/trade-offer.model';
import { Component, Input, OnInit } from '@angular/core';
import { TradeOfferService } from '../service/trade-offer.service';
import { TradeObjectService } from 'app/entities/trade-object/service/trade-object.service';
import { IUser } from 'app/entities/user/user.model';

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
  proposingUser: IUser | undefined;
  offeringUser: IUser | undefined;

  constructor(private _tradeOfferService: TradeOfferService, private _tradeObjectService: TradeObjectService) {}

  ngOnInit(): void {
    this.loadProposedObject();
    this.loadWantedObject();
  }

  loadProposedObject(): void {
    if (this.tradeOffer) {
      this._tradeOfferService.getProposedTradeObject(this.tradeOffer.id).subscribe((tradeObject: ITradeObject | null) => {
        if (tradeObject) {
          this.proposedObject = tradeObject;
          this.loadProposingUsername();
        }
      })
    }
  }

  loadWantedObject(): void {
    if (this.tradeOffer) {
      this._tradeOfferService.getWantedTradeObject(this.tradeOffer.id).subscribe((tradeObject: ITradeObject | null) => {
        if (tradeObject) {
          this.wantedObject = tradeObject;
          this.loadOfferingUsername();
        }
      })
    }
  }

  loadProposingUsername(): void {
    if (this.proposedObject) {
      this._tradeObjectService.getUsernameOfTradeObject(this.proposedObject.id).subscribe((user: IUser | undefined | null) => {
        if (user) {
          this.proposingUser = user;
        }
      })
    }
  }

  loadOfferingUsername(): void {
    if (this.wantedObject) {
      this._tradeObjectService.getUsernameOfTradeObject(this.wantedObject.id).subscribe((user: IUser | undefined | null) => {
        if (user) {
          this.offeringUser = user;
        }
      })
    }
  }
}


