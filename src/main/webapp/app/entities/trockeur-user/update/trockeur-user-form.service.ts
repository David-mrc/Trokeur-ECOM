import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ITrockeurUser, NewTrockeurUser } from '../trockeur-user.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ITrockeurUser for edit and NewTrockeurUserFormGroupInput for create.
 */
type TrockeurUserFormGroupInput = ITrockeurUser | PartialWithRequiredKeyOf<NewTrockeurUser>;

type TrockeurUserFormDefaults = Pick<NewTrockeurUser, 'id' | 'tradeOffers'>;

type TrockeurUserFormGroupContent = {
  id: FormControl<ITrockeurUser['id'] | NewTrockeurUser['id']>;
  address: FormControl<ITrockeurUser['address']>;
  zipCode: FormControl<ITrockeurUser['zipCode']>;
  description: FormControl<ITrockeurUser['description']>;
  profilePicturePath: FormControl<ITrockeurUser['profilePicturePath']>;
  user: FormControl<ITrockeurUser['user']>;
  tradeOffers: FormControl<ITrockeurUser['tradeOffers']>;
};

export type TrockeurUserFormGroup = FormGroup<TrockeurUserFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class TrockeurUserFormService {
  createTrockeurUserFormGroup(trockeurUser: TrockeurUserFormGroupInput = { id: null }): TrockeurUserFormGroup {
    const trockeurUserRawValue = {
      ...this.getFormDefaults(),
      ...trockeurUser,
    };
    return new FormGroup<TrockeurUserFormGroupContent>({
      id: new FormControl(
        { value: trockeurUserRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      address: new FormControl(trockeurUserRawValue.address, {
        validators: [Validators.required],
      }),
      zipCode: new FormControl(trockeurUserRawValue.zipCode, {
        validators: [Validators.required, Validators.minLength(5)],
      }),
      description: new FormControl(trockeurUserRawValue.description),
      profilePicturePath: new FormControl(trockeurUserRawValue.profilePicturePath),
      user: new FormControl(trockeurUserRawValue.user),
      tradeOffers: new FormControl(trockeurUserRawValue.tradeOffers ?? []),
    });
  }

  getTrockeurUser(form: TrockeurUserFormGroup): ITrockeurUser | NewTrockeurUser {
    return form.getRawValue() as ITrockeurUser | NewTrockeurUser;
  }

  resetForm(form: TrockeurUserFormGroup, trockeurUser: TrockeurUserFormGroupInput): void {
    const trockeurUserRawValue = { ...this.getFormDefaults(), ...trockeurUser };
    form.reset(
      {
        ...trockeurUserRawValue,
        id: { value: trockeurUserRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): TrockeurUserFormDefaults {
    return {
      id: null,
      tradeOffers: [],
    };
  }
}
