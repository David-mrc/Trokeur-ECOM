import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ITradeObject, NewTradeObject } from '../trade-object.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ITradeObject for edit and NewTradeObjectFormGroupInput for create.
 */
type TradeObjectFormGroupInput = ITradeObject | PartialWithRequiredKeyOf<NewTradeObject>;

type TradeObjectFormDefaults = Pick<NewTradeObject, 'id' | 'objectCategories' | 'tradeOffers'>;

type TradeObjectFormGroupContent = {
  id: FormControl<ITradeObject['id'] | NewTradeObject['id']>;
  name: FormControl<ITradeObject['name']>;
  description: FormControl<ITradeObject['description']>;
  state: FormControl<ITradeObject['state']>;
  stock: FormControl<ITradeObject['stock']>;
  objectCategories: FormControl<ITradeObject['objectCategories']>;
  trockeurUser: FormControl<ITradeObject['trockeurUser']>;
  tradeOffers: FormControl<ITradeObject['tradeOffers']>;
};

export type TradeObjectFormGroup = FormGroup<TradeObjectFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class TradeObjectFormService {
  createTradeObjectFormGroup(tradeObject: TradeObjectFormGroupInput = { id: null }): TradeObjectFormGroup {
    const tradeObjectRawValue = {
      ...this.getFormDefaults(),
      ...tradeObject,
    };
    return new FormGroup<TradeObjectFormGroupContent>({
      id: new FormControl(
        { value: tradeObjectRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(tradeObjectRawValue.name, {
        validators: [Validators.required, Validators.minLength(5)],
      }),
      description: new FormControl(tradeObjectRawValue.description),
      state: new FormControl(tradeObjectRawValue.state, {
        validators: [Validators.required],
      }),
      stock: new FormControl(1, {
        validators: [Validators.required],
      }),
      objectCategories: new FormControl(tradeObjectRawValue.objectCategories ?? []),
      trockeurUser: new FormControl(tradeObjectRawValue.trockeurUser),
      tradeOffers: new FormControl(tradeObjectRawValue.tradeOffers ?? []),
    });
  }

  getTradeObject(form: TradeObjectFormGroup): ITradeObject | NewTradeObject {
    return form.getRawValue() as ITradeObject | NewTradeObject;
  }

  resetForm(form: TradeObjectFormGroup, tradeObject: TradeObjectFormGroupInput): void {
    const tradeObjectRawValue = { ...this.getFormDefaults(), ...tradeObject };
    form.reset(
      {
        ...tradeObjectRawValue,
        id: { value: tradeObjectRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): TradeObjectFormDefaults {
    return {
      id: null,
      objectCategories: [],
      tradeOffers: [],
    };
  }
}
