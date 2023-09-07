import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TradeOfferFormService, TradeOfferFormGroup } from './trade-offer-form.service';
import { ITradeOffer } from '../trade-offer.model';
import { TradeOfferService } from '../service/trade-offer.service';
import { ITradeObject } from 'app/entities/trade-object/trade-object.model';
import { TradeObjectService } from 'app/entities/trade-object/service/trade-object.service';
import { ITrockeurUser } from 'app/entities/trockeur-user/trockeur-user.model';
import { TrockeurUserService } from 'app/entities/trockeur-user/service/trockeur-user.service';
import { TradeOfferState } from 'app/entities/enumerations/trade-offer-state.model';

@Component({
  standalone: true,
  selector: 'jhi-trade-offer-update',
  templateUrl: './trade-offer-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class TradeOfferUpdateComponent implements OnInit {
  isSaving = false;
  tradeOffer: ITradeOffer | null = null;
  tradeOfferStateValues = Object.keys(TradeOfferState);

  tradeObjectsSharedCollection: ITradeObject[] = [];
  trockeurUsersSharedCollection: ITrockeurUser[] = [];

  editForm: TradeOfferFormGroup = this.tradeOfferFormService.createTradeOfferFormGroup();

  constructor(
    protected tradeOfferService: TradeOfferService,
    protected tradeOfferFormService: TradeOfferFormService,
    protected tradeObjectService: TradeObjectService,
    protected trockeurUserService: TrockeurUserService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareTradeObject = (o1: ITradeObject | null, o2: ITradeObject | null): boolean => this.tradeObjectService.compareTradeObject(o1, o2);

  compareTrockeurUser = (o1: ITrockeurUser | null, o2: ITrockeurUser | null): boolean =>
    this.trockeurUserService.compareTrockeurUser(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ tradeOffer }) => {
      this.tradeOffer = tradeOffer;
      if (tradeOffer) {
        this.updateForm(tradeOffer);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const tradeOffer = this.tradeOfferFormService.getTradeOffer(this.editForm);
    if (tradeOffer.id !== null) {
      this.subscribeToSaveResponse(this.tradeOfferService.update(tradeOffer));
    } else {
      this.subscribeToSaveResponse(this.tradeOfferService.create(tradeOffer));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITradeOffer>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(tradeOffer: ITradeOffer): void {
    this.tradeOffer = tradeOffer;
    this.tradeOfferFormService.resetForm(this.editForm, tradeOffer);

    this.tradeObjectsSharedCollection = this.tradeObjectService.addTradeObjectToCollectionIfMissing<ITradeObject>(
      this.tradeObjectsSharedCollection,
      ...(tradeOffer.tradeObjects ?? [])
    );
    this.trockeurUsersSharedCollection = this.trockeurUserService.addTrockeurUserToCollectionIfMissing<ITrockeurUser>(
      this.trockeurUsersSharedCollection,
      ...(tradeOffer.trockeurUsers ?? [])
    );
  }

  protected loadRelationshipsOptions(): void {
    this.tradeObjectService
      .query()
      .pipe(map((res: HttpResponse<ITradeObject[]>) => res.body ?? []))
      .pipe(
        map((tradeObjects: ITradeObject[]) =>
          this.tradeObjectService.addTradeObjectToCollectionIfMissing<ITradeObject>(tradeObjects, ...(this.tradeOffer?.tradeObjects ?? []))
        )
      )
      .subscribe((tradeObjects: ITradeObject[]) => (this.tradeObjectsSharedCollection = tradeObjects));

    this.trockeurUserService
      .query()
      .pipe(map((res: HttpResponse<ITrockeurUser[]>) => res.body ?? []))
      .pipe(
        map((trockeurUsers: ITrockeurUser[]) =>
          this.trockeurUserService.addTrockeurUserToCollectionIfMissing<ITrockeurUser>(
            trockeurUsers,
            ...(this.tradeOffer?.trockeurUsers ?? [])
          )
        )
      )
      .subscribe((trockeurUsers: ITrockeurUser[]) => (this.trockeurUsersSharedCollection = trockeurUsers));
  }
}
