import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-affichage-historique',
  templateUrl: './affichage-historique.component.html',
  styleUrls: ['./affichage-historique.component.scss']
})

export class AffichageHistoriqueComponent {
  @Input() recues: boolean = false;

  @Input() propose: boolean = false;
}


