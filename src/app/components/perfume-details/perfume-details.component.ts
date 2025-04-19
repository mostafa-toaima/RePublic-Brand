import { Component, Input } from '@angular/core';
import { Perfume } from '../../common/models/perfume.model';

@Component({
  selector: 'app-perfume-details',
  templateUrl: './perfume-details.component.html',
  styleUrls: ['./perfume-details.component.css']
})
export class PerfumeDetailsComponent {
  @Input() perfume: Perfume | undefined;
}
