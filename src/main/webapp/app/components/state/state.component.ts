import { NgIf } from '@angular/common';
import { Component, Input} from '@angular/core';

@Component({
  selector: 'jhi-state',
  templateUrl: './state.component.html',
  standalone: true,
  imports: [NgIf],
  styleUrls: ['./state.component.scss']
})

export class StateComponent {
  @Input() state = '';
}
