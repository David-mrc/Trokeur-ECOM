import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionRecueComponent } from './transaction-recue.component';

describe('TransactionRecueComponent', () => {
  let component: TransactionRecueComponent;
  let fixture: ComponentFixture<TransactionRecueComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TransactionRecueComponent]
    });
    fixture = TestBed.createComponent(TransactionRecueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
