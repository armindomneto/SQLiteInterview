import { Injectable } from '@angular/core';

@Injectable()
export class SummaryService {
  constructor() {}

  showSummary() {
    if (localStorage.getItem('Summary') === null) {
      localStorage.setItem('Summary', '{"lowestAge": 0, "highestAge": 0, "average": 0}');
    }
    return JSON.parse(localStorage.getItem('Summary'));
  }
}
