import { Component } from '@angular/core';

@Component({
  selector: 'custom-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  // country-map.component.ts (or relevant navbar component)
  collapseNavbar() {
    const navbar = document.getElementById('navbarNav');
    if (navbar?.classList.contains('show')) {
      // @ts-ignore: Ignore TypeScript error for bootstrap
      new (window as any).bootstrap.Collapse(navbar).hide();
    }
  }

}
