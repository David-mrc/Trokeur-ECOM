import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IGenericImage, NewGenericImage } from '../generic-image.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IGenericImage for edit and NewGenericImageFormGroupInput for create.
 */
type GenericImageFormGroupInput = IGenericImage | PartialWithRequiredKeyOf<NewGenericImage>;

type GenericImageFormDefaults = Pick<NewGenericImage, 'id'>;

type GenericImageFormGroupContent = {
  id: FormControl<IGenericImage['id'] | NewGenericImage['id']>;
  imagePath: FormControl<IGenericImage['imagePath']>;
  tradeObject: FormControl<IGenericImage['tradeObject']>;
};

export type GenericImageFormGroup = FormGroup<GenericImageFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class GenericImageFormService {
  createGenericImageFormGroup(genericImage: GenericImageFormGroupInput = { id: null }): GenericImageFormGroup {
    const genericImageRawValue = {
      ...this.getFormDefaults(),
      ...genericImage,
    };
    return new FormGroup<GenericImageFormGroupContent>({
      id: new FormControl(
        { value: genericImageRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      imagePath: new FormControl(genericImageRawValue.imagePath, {
        validators: [Validators.required],
      }),
      tradeObject: new FormControl(genericImageRawValue.tradeObject),
    });
  }

  getGenericImage(form: GenericImageFormGroup): IGenericImage | NewGenericImage {
    return form.getRawValue() as IGenericImage | NewGenericImage;
  }

  resetForm(form: GenericImageFormGroup, genericImage: GenericImageFormGroupInput): void {
    const genericImageRawValue = { ...this.getFormDefaults(), ...genericImage };
    form.reset(
      {
        ...genericImageRawValue,
        id: { value: genericImageRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): GenericImageFormDefaults {
    return {
      id: null,
    };
  }
}
