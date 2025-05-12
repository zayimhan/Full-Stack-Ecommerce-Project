import { Component } from '@angular/core';

@Component({
  selector: 'app-seller-layout',
  standalone: false,
  template: `<router-outlet></router-outlet>`,
  styles: [`
    :host {
      display: block;
      padding: 1rem;
      background-color: #f9f9f9;
      min-height: 100vh;
    }
  `]
})
export class SellerLayoutComponent {

}
