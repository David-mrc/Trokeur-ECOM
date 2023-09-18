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
  private idTrokeurUserCreateur: number | null | undefined;

  constructor(private _tradeOfferService: TradeOfferService) {}

  ngOnInit(): void {
    this.idTrokeurUserCreateur = this.tradeOffer?.ownerID;
  }

  getProposedObject(): ITradeObject | undefined {
    if (this.idTrokeurUserCreateur) {
      this._tradeOfferService.getProposedTradeObject(this.idTrokeurUserCreateur).subscribe((tradeObject: ITradeObject | null) => {
        if (tradeObject) {
          return tradeObject;
        }
        return undefined;
      })
    }
    return undefined;
  }

  getWantedObject(): ITradeObject | undefined {
    if (this.idTrokeurUserCreateur) {
      this._tradeOfferService.getWantedTradeObject(this.idTrokeurUserCreateur).subscribe((tradeObject: ITradeObject | null) => {
        if (tradeObject) {
          return tradeObject;
        }
        return undefined;
      })
    }
    return undefined;
  }
}


