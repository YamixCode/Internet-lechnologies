import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../good.test-samples';

import { GoodFormService } from './good-form.service';

describe('Good Form Service', () => {
  let service: GoodFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GoodFormService);
  });

  describe('Service methods', () => {
    describe('createGoodFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createGoodFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            amount: expect.any(Object),
            name: expect.any(Object),
          })
        );
      });

      it('passing IGood should create a new form with FormGroup', () => {
        const formGroup = service.createGoodFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            amount: expect.any(Object),
            name: expect.any(Object),
          })
        );
      });
    });

    describe('getGood', () => {
      it('should return NewGood for default Good initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createGoodFormGroup(sampleWithNewData);

        const good = service.getGood(formGroup) as any;

        expect(good).toMatchObject(sampleWithNewData);
      });

      it('should return NewGood for empty Good initial value', () => {
        const formGroup = service.createGoodFormGroup();

        const good = service.getGood(formGroup) as any;

        expect(good).toMatchObject({});
      });

      it('should return IGood', () => {
        const formGroup = service.createGoodFormGroup(sampleWithRequiredData);

        const good = service.getGood(formGroup) as any;

        expect(good).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IGood should not enable id FormControl', () => {
        const formGroup = service.createGoodFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewGood should disable id FormControl', () => {
        const formGroup = service.createGoodFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
