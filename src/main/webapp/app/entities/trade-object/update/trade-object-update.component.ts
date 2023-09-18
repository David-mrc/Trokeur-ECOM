/* eslint-disable no-console */
import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TradeObjectFormService, TradeObjectFormGroup } from './trade-object-form.service';
import { ITradeObject } from '../trade-object.model';
import { TradeObjectService } from '../service/trade-object.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IObjectCategory } from 'app/entities/object-category/object-category.model';
import { ObjectCategoryService } from 'app/entities/object-category/service/object-category.service';
import { ITrockeurUser } from 'app/entities/trockeur-user/trockeur-user.model';
import { TrockeurUserService } from 'app/entities/trockeur-user/service/trockeur-user.service';
import { TradeObjectState } from 'app/entities/enumerations/trade-object-state.model';
import { S3serviceService } from 'app/fileservice/s3service.service';
import { GenericImageService } from 'app/entities/generic-image/service/generic-image.service';
import { NewGenericImage } from 'app/entities/generic-image/generic-image.model';

@Component({
  standalone: true,
  selector: 'jhi-trade-object-update',
  templateUrl: './trade-object-update.component.html',
  styleUrls: ['./trade-object-update.component.scss'],
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class TradeObjectUpdateComponent implements OnInit {
  isSaving = false;
  formData: FormData | undefined;
  tradeObject: ITradeObject | null = null;
  tradeObjectStateValues = Object.keys(TradeObjectState);

  objectCategoriesSharedCollection: IObjectCategory[] = [];
  trockeurUsersSharedCollection: ITrockeurUser[] = [];
  imagePreviews: string[] = [];
  imageUrls: string[] = [];

  editForm: TradeObjectFormGroup = this.tradeObjectFormService.createTradeObjectFormGroup();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected tradeObjectService: TradeObjectService,
    protected tradeObjectFormService: TradeObjectFormService,
    protected objectCategoryService: ObjectCategoryService,
    protected trockeurUserService: TrockeurUserService,
    protected activatedRoute: ActivatedRoute,
    private config: S3serviceService,
    private genericImageService: GenericImageService
  ) {}

  previewImages(event: any): void {
    const files = event.target.files;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.imagePreviews.push(e.target.result);
      };

      reader.readAsDataURL(file);
    }
  }

  deleteImage(index: number): void {
    this.imagePreviews.splice(index, 1);
    this.imageUrls.splice(index, 1);
  }

  compareObjectCategory = (o1: IObjectCategory | null, o2: IObjectCategory | null): boolean =>
    this.objectCategoryService.compareObjectCategory(o1, o2);

  compareTrockeurUser = (o1: ITrockeurUser | null, o2: ITrockeurUser | null): boolean =>
    this.trockeurUserService.compareTrockeurUser(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ tradeObject }) => {
      this.tradeObject = tradeObject;
      if (tradeObject) {
        this.updateForm(tradeObject);
      }

      this.loadRelationshipsOptions();
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('trokeurApp.error', { ...err, key: 'error.file.' + err.key })),
    });
  }

  previousState(): void {
    window.history.back();
  }

  onFileChange(event: any): void {
    for (const file of event.target.files) {
      this.formData = new FormData();
      this.formData.append('file', file);
      this.config.uploadFile(this.formData).subscribe(response => {
        console.log('file uploaded successfully', response);
        this.imageUrls.push(response.data);
      });
    }
  }

  createGenericImages(tradeObjectID: number): void {
    for (const path of this.imageUrls) {
      const newGenericImage: NewGenericImage = {
        id: null,
        imagePath: path,
        tradeObject: { id: tradeObjectID },
      };

      this.genericImageService.create(newGenericImage).subscribe(response => {
        console.log('New GenericImage created:', response.body);
      });
    }
  }

  save(): void {
    this.isSaving = true;
    const tradeObject = this.tradeObjectFormService.getTradeObject(this.editForm);
    if (tradeObject.id !== null) {
      this.subscribeToSaveResponse(this.tradeObjectService.update(tradeObject));
    } else {
      this.subscribeToSaveResponse(this.tradeObjectService.create(tradeObject));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITradeObject>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: response => {
        const createdTradeObject = response.body;
        if (createdTradeObject?.id) {
          this.createGenericImages(createdTradeObject.id);
        }
        this.onSaveSuccess();
      },
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

  protected updateForm(tradeObject: ITradeObject): void {
    this.tradeObject = tradeObject;
    this.tradeObjectFormService.resetForm(this.editForm, tradeObject);

    this.objectCategoriesSharedCollection = this.objectCategoryService.addObjectCategoryToCollectionIfMissing<IObjectCategory>(
      this.objectCategoriesSharedCollection,
      ...(tradeObject.objectCategories ?? [])
    );
    this.trockeurUsersSharedCollection = this.trockeurUserService.addTrockeurUserToCollectionIfMissing<ITrockeurUser>(
      this.trockeurUsersSharedCollection,
      tradeObject.trockeurUser
    );
  }

  protected loadRelationshipsOptions(): void {
    this.objectCategoryService
      .query()
      .pipe(map((res: HttpResponse<IObjectCategory[]>) => res.body ?? []))
      .pipe(
        map((objectCategories: IObjectCategory[]) =>
          this.objectCategoryService.addObjectCategoryToCollectionIfMissing<IObjectCategory>(
            objectCategories,
            ...(this.tradeObject?.objectCategories ?? [])
          )
        )
      )
      .subscribe((objectCategories: IObjectCategory[]) => (this.objectCategoriesSharedCollection = objectCategories));

    this.trockeurUserService
      .query()
      .pipe(map((res: HttpResponse<ITrockeurUser[]>) => res.body ?? []))
      .pipe(
        map((trockeurUsers: ITrockeurUser[]) =>
          this.trockeurUserService.addTrockeurUserToCollectionIfMissing<ITrockeurUser>(trockeurUsers, this.tradeObject?.trockeurUser)
        )
      )
      .subscribe((trockeurUsers: ITrockeurUser[]) => (this.trockeurUsersSharedCollection = trockeurUsers));
  }
}
