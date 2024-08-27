import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { NgFor } from '@angular/common';
import { AppComponent } from './app.component';

@Component({
  selector:    'app-address-card',
  // templateUrl: './addressCard.component.html',
  standalone:  true,
  imports: [    
    MatCardModule
  ],
  template: `
    <mat-card>
  <mat-card-title>{{ addressDetails?.display_name ? addressDetails?.display_name : "Title" }}</mat-card-title>
  <mat-card-content>
    <div>Lat:{{ addressDetails?.lat ? addressDetails?.lat: "0" }}</div> 
    <div>Lon:{{ addressDetails?.lon ? addressDetails?.lon: "0" }}</div> 
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
