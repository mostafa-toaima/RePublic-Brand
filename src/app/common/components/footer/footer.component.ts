import { Component } from '@angular/core';

@Component({
  selector: 'custom-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  currentYear: number = new Date().getFullYear();

}
