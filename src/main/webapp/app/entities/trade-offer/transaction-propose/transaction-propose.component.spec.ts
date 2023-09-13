import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionProposeComponent } from './transaction-propose.component';

describe('TransactionProposeComponent', () => {
  let component: TransactionProposeComponent;
  let fixture: ComponentFixture<TransactionProposeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TransactionProposeComponent]
    });
    fixture = TestBed.createComponent(TransactionProposeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
