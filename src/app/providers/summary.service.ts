import { Injectable } from '@angular/core';

@Injectable()
export class SummaryService {
  constructor() {}

  showSummary() {
    return JSON.parse(localStorage.getItem('Summary'));
  }
}
