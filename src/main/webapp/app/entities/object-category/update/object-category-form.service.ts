import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IObjectCategory, NewObjectCategory } from '../object-category.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IObjectCategory for edit and NewObjectCategoryFormGroupInput for create.
 */
type ObjectCategoryFormGroupInput = IObjectCategory | PartialWithRequiredKeyOf<NewObjectCategory>;

type ObjectCategoryFormDefaults = Pick<NewObjectCategory, 'id' | 'tradeObjects'>;

type ObjectCategoryFormGroupContent = {
  id: FormControl<IObjectCategory['id'] | NewObjectCategory['id']>;
  name: FormControl<IObjectCategory['name']>;
  tradeObjects: FormControl<IObjectCategory['tradeObjects']>;
};

export type ObjectCategoryFormGroup = FormGroup<ObjectCategoryFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ObjectCategoryFormService {
  createObjectCategoryFormGroup(objectCategory: ObjectCategoryFormGroupInput = { id: null }): ObjectCategoryFormGroup {
    const objectCategoryRawValue = {
      ...this.getFormDefaults(),
      ...objectCategory,
    };
    return new FormGroup<ObjectCategoryFormGroupContent>({
      id: new FormControl(
        { value: objectCategoryRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(objectCategoryRawValue.name, {
        validators: [Validators.required],
      }),
      tradeObjects: new FormControl(objectCategoryRawValue.tradeObjects ?? []),
    });
  }

  getObjectCategory(form: ObjectCategoryFormGroup): IObjectCategory | NewObjectCategory {
    return form.getRawValue() as IObjectCategory | NewObjectCategory;
  }

  resetForm(form: ObjectCategoryFormGroup, objectCategory: ObjectCategoryFormGroupInput): void {
    const objectCategoryRawValue = { ...this.getFormDefaults(), ...objectCategory };
    form.reset(
      {
        ...objectCategoryRawValue,
        id: { value: objectCategoryRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ObjectCategoryFormDefaults {
    return {
      id: null,
      tradeObjects: [],
    };
  }
}
