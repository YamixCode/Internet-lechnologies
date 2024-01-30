import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IGood, NewGood } from '../good.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IGood for edit and NewGoodFormGroupInput for create.
 */
type GoodFormGroupInput = IGood | PartialWithRequiredKeyOf<NewGood>;

type GoodFormDefaults = Pick<NewGood, 'id'>;

type GoodFormGroupContent = {
  id: FormControl<IGood['id'] | NewGood['id']>;
  amount: FormControl<IGood['amount']>;
  name: FormControl<IGood['name']>;
};

export type GoodFormGroup = FormGroup<GoodFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class GoodFormService {
  createGoodFormGroup(good: GoodFormGroupInput = { id: null }): GoodFormGroup {
    const goodRawValue = {
      ...this.getFormDefaults(),
      ...good,
    };
    return new FormGroup<GoodFormGroupContent>({
      id: new FormControl(
        { value: goodRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      amount: new FormControl(goodRawValue.amount),
      name: new FormControl(goodRawValue.name),
    });
  }

  getGood(form: GoodFormGroup): IGood | NewGood {
    return form.getRawValue() as IGood | NewGood;
  }

  resetForm(form: GoodFormGroup, good: GoodFormGroupInput): void {
    const goodRawValue = { ...this.getFormDefaults(), ...good };
    form.reset(
      {
        ...goodRawValue,
        id: { value: goodRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): GoodFormDefaults {
    return {
      id: null,
    };
  }
}
