import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { GoodFormService, GoodFormGroup } from './good-form.service';
import { IGood } from '../good.model';
import { GoodService } from '../service/good.service';

@Component({
  selector: 'jhi-good-update',
  templateUrl: './good-update.component.html',
})
export class GoodUpdateComponent implements OnInit {
  isSaving = false;
  good: IGood | null = null;

  editForm: GoodFormGroup = this.goodFormService.createGoodFormGroup();

  constructor(protected goodService: GoodService, protected goodFormService: GoodFormService, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ good }) => {
      this.good = good;
      if (good) {
        this.updateForm(good);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const good = this.goodFormService.getGood(this.editForm);
    if (good.id !== null) {
      this.subscribeToSaveResponse(this.goodService.update(good));
    } else {
      this.subscribeToSaveResponse(this.goodService.create(good));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IGood>>): void {
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

  protected updateForm(good: IGood): void {
    this.good = good;
    this.goodFormService.resetForm(this.editForm, good);
  }
}
