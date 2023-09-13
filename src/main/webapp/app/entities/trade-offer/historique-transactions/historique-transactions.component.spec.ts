import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriqueTransactionsComponent } from './historique-transactions.component';

describe('HistoriqueTransactionsComponent', () => {
  let component: HistoriqueTransactionsComponent;
  let fixture: ComponentFixture<HistoriqueTransactionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HistoriqueTransactionsComponent]
    });
    fixture = TestBed.createComponent(HistoriqueTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
