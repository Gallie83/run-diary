import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { NgClass } from '@angular/common';

@Component({
  selector:    'app-address-card',
  standalone:  true,
  imports: [    
    MatCardModule,
    NgClass
  ],
  template: `
    <mat-card [ngClass]="{ 'highlight': highlight }">
  <mat-card-title>{{ addressDetails?.display_name ? addressDetails?.display_name : "Title" }}</mat-card-title>
  <mat-card-content>
  </mat-card-content>
</mat-card>
  `,
  styleUrls: ['addressCard.component.less']
})
export class AddressCardComponent {

  @Input() addressDetails: IAddressDetails | undefined;
  @Input() highlight: boolean = false;
}

export interface IAddressDetails {
  display_name: string,
  lat:          string,
  lon:          string,
}
