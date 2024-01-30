import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IGood } from '../good.model';

@Component({
  selector: 'jhi-good-detail',
  templateUrl: './good-detail.component.html',
})
export class GoodDetailComponent implements OnInit {
  good: IGood | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ good }) => {
      this.good = good;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
