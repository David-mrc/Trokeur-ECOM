import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TradeDoneComponent } from './trade-done.component';

describe('TradeDoneComponent', () => {
  let component: TradeDoneComponent;
  let fixture: ComponentFixture<TradeDoneComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TradeDoneComponent]
    });
    fixture = TestBed.createComponent(TradeDoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
