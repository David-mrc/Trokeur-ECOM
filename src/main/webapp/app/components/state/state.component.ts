import { Component, Input} from '@angular/core';
@Component({
  selector: 'jhi-state',
  templateUrl: './state.component.html',
  styleUrls: ['./state.component.scss']
})
export class StateComponent {

  @Input() state = '';
}
