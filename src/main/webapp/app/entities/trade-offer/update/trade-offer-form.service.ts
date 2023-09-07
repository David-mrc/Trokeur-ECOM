import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ITradeOffer, NewTradeOffer } from '../trade-offer.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ITradeOffer for edit and NewTradeOfferFormGroupInput for create.
 */
type TradeOfferFormGroupInput = ITradeOffer | PartialWithRequiredKeyOf<NewTradeOffer>;

type TradeOfferFormDefaults = Pick<NewTradeOffer, 'id' | 'tradeObjects' | 'trockeurUsers'>;

type TradeOfferFormGroupContent = {
  id: FormControl<ITradeOffer['id'] | NewTradeOffer['id']>;
  date: FormControl<ITradeOffer['date']>;
  state: FormControl<ITradeOffer['state']>;
  tradeObjects: FormControl<ITradeOffer['tradeObjects']>;
  trockeurUsers: FormControl<ITradeOffer['trockeurUsers']>;
};

export type TradeOfferFormGroup = FormGroup<TradeOfferFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class TradeOfferFormService {
  createTradeOfferFormGroup(tradeOffer: TradeOfferFormGroupInput = { id: null }): TradeOfferFormGroup {
    const tradeOfferRawValue = {
      ...this.getFormDefaults(),
      ...tradeOffer,
    };
    return new FormGroup<TradeOfferFormGroupContent>({
      id: new FormControl(
        { value: tradeOfferRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      date: new FormControl(tradeOfferRawValue.date, {
        validators: [Validators.required],
      }),
      state: new FormControl(tradeOfferRawValue.state, {
        validators: [Validators.required],
      }),
      tradeObjects: new FormControl(tradeOfferRawValue.tradeObjects ?? []),
      trockeurUsers: new FormControl(tradeOfferRawValue.trockeurUsers ?? []),
    });
  }

  getTradeOffer(form: TradeOfferFormGroup): ITradeOffer | NewTradeOffer {
    return form.getRawValue() as ITradeOffer | NewTradeOffer;
  }

  resetForm(form: TradeOfferFormGroup, tradeOffer: TradeOfferFormGroupInput): void {
    const tradeOfferRawValue = { ...this.getFormDefaults(), ...tradeOffer };
    form.reset(
      {
        ...tradeOfferRawValue,
        id: { value: tradeOfferRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): TradeOfferFormDefaults {
    return {
      id: null,
      tradeObjects: [],
      trockeurUsers: [],
    };
  }
}
