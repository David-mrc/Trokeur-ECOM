import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ObjectCategoryFormService, ObjectCategoryFormGroup } from './object-category-form.service';
import { IObjectCategory } from '../object-category.model';
import { ObjectCategoryService } from '../service/object-category.service';

@Component({
  standalone: true,
  selector: 'jhi-object-category-update',
  templateUrl: './object-category-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ObjectCategoryUpdateComponent implements OnInit {
  isSaving = false;
  objectCategory: IObjectCategory | null = null;

  editForm: ObjectCategoryFormGroup = this.objectCategoryFormService.createObjectCategoryFormGroup();

  constructor(
    protected objectCategoryService: ObjectCategoryService,
    protected objectCategoryFormService: ObjectCategoryFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ objectCategory }) => {
      this.objectCategory = objectCategory;
      if (objectCategory) {
        this.updateForm(objectCategory);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const objectCategory = this.objectCategoryFormService.getObjectCategory(this.editForm);
    if (objectCategory.id !== null) {
      this.subscribeToSaveResponse(this.objectCategoryService.update(objectCategory));
    } else {
      this.subscribeToSaveResponse(this.objectCategoryService.create(objectCategory));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IObjectCategory>>): void {
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

  protected updateForm(objectCategory: IObjectCategory): void {
    this.objectCategory = objectCategory;
    this.objectCategoryFormService.resetForm(this.editForm, objectCategory);
  }
}
