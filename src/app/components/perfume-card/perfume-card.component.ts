import { Component, Input } from '@angular/core';
import { Perfume } from '../../common/models/perfume.model';

@Component({
  selector: 'app-perfume-card',
  templateUrl: './perfume-card.component.html',
  styleUrls: ['./perfume-card.component.css']
})
export class PerfumeCardComponent {
  @Input() perfume: Perfume | undefined;
}
