import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { GoodFormService } from './good-form.service';
import { GoodService } from '../service/good.service';
import { IGood } from '../good.model';

import { GoodUpdateComponent } from './good-update.component';

describe('Good Management Update Component', () => {
  let comp: GoodUpdateComponent;
  let fixture: ComponentFixture<GoodUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let goodFormService: GoodFormService;
  let goodService: GoodService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [GoodUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(GoodUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(GoodUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    goodFormService = TestBed.inject(GoodFormService);
    goodService = TestBed.inject(GoodService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const good: IGood = { id: 456 };

      activatedRoute.data = of({ good });
      comp.ngOnInit();

      expect(comp.good).toEqual(good);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IGood>>();
      const good = { id: 123 };
      jest.spyOn(goodFormService, 'getGood').mockReturnValue(good);
      jest.spyOn(goodService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ good });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: good }));
      saveSubject.complete();

      // THEN
      expect(goodFormService.getGood).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(goodService.update).toHaveBeenCalledWith(expect.objectContaining(good));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IGood>>();
      const good = { id: 123 };
      jest.spyOn(goodFormService, 'getGood').mockReturnValue({ id: null });
      jest.spyOn(goodService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ good: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: good }));
      saveSubject.complete();

      // THEN
      expect(goodFormService.getGood).toHaveBeenCalled();
      expect(goodService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IGood>>();
      const good = { id: 123 };
      jest.spyOn(goodService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ good });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(goodService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
