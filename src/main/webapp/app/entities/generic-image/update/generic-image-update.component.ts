import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { GenericImageFormService, GenericImageFormGroup } from './generic-image-form.service';
import { IGenericImage } from '../generic-image.model';
import { GenericImageService } from '../service/generic-image.service';
import { ITradeObject } from 'app/entities/trade-object/trade-object.model';
import { TradeObjectService } from 'app/entities/trade-object/service/trade-object.service';

@Component({
  standalone: true,
  selector: 'jhi-generic-image-update',
  templateUrl: './generic-image-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class GenericImageUpdateComponent implements OnInit {
  isSaving = false;
  genericImage: IGenericImage | null = null;

  tradeObjectsSharedCollection: ITradeObject[] = [];

  editForm: GenericImageFormGroup = this.genericImageFormService.createGenericImageFormGroup();

  constructor(
    protected genericImageService: GenericImageService,
    protected genericImageFormService: GenericImageFormService,
    protected tradeObjectService: TradeObjectService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareTradeObject = (o1: ITradeObject | null, o2: ITradeObject | null): boolean => this.tradeObjectService.compareTradeObject(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ genericImage }) => {
      this.genericImage = genericImage;
      if (genericImage) {
        this.updateForm(genericImage);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const genericImage = this.genericImageFormService.getGenericImage(this.editForm);
    if (genericImage.id !== null) {
      this.subscribeToSaveResponse(this.genericImageService.update(genericImage));
    } else {
      this.subscribeToSaveResponse(this.genericImageService.create(genericImage));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IGenericImage>>): void {
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

  protected updateForm(genericImage: IGenericImage): void {
    this.genericImage = genericImage;
    this.genericImageFormService.resetForm(this.editForm, genericImage);

    this.tradeObjectsSharedCollection = this.tradeObjectService.addTradeObjectToCollectionIfMissing<ITradeObject>(
      this.tradeObjectsSharedCollection,
      genericImage.tradeObject
    );
  }

  protected loadRelationshipsOptions(): void {
    this.tradeObjectService
      .query()
      .pipe(map((res: HttpResponse<ITradeObject[]>) => res.body ?? []))
      .pipe(
        map((tradeObjects: ITradeObject[]) =>
          this.tradeObjectService.addTradeObjectToCollectionIfMissing<ITradeObject>(tradeObjects, this.genericImage?.tradeObject)
        )
      )
      .subscribe((tradeObjects: ITradeObject[]) => (this.tradeObjectsSharedCollection = tradeObjects));
  }
}
