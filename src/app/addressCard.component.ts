import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector:    'app-address-card',
  // templateUrl: './addressCard.component.html',
  standalone:  true,
  imports: [    
    MatCardModule
  ],
  template: `
    <mat-card>
  <mat-card-title>{{ addressDetails?.display_name }}</mat-card-title>
  <mat-card-content>
    <div>{{ addressDetails?.lat }}, {{ addressDetails?.lon }}</div>
  </mat-card-content>
</mat-card>
  `,
  styles: ``
})
export class AddressCardComponent {

  @Input() addressDetails: IAddressDetails | undefined;


}

export interface IAddressDetails {
  display_name: string,
  lat:          string,
  lon:          string,
}
