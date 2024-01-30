import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { GoodDetailComponent } from './good-detail.component';

describe('Good Management Detail Component', () => {
  let comp: GoodDetailComponent;
  let fixture: ComponentFixture<GoodDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GoodDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ good: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(GoodDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(GoodDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load good on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.good).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
