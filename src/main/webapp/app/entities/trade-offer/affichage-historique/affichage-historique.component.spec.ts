import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffichageHistoriqueComponent } from './affichage-historique.component';

describe('AffichageHistoriqueComponent', () => {
  let component: AffichageHistoriqueComponent;
  let fixture: ComponentFixture<AffichageHistoriqueComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AffichageHistoriqueComponent]
    });
    fixture = TestBed.createComponent(AffichageHistoriqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
