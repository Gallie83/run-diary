import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-change-location',
  standalone: true,
  imports: [FormsModule],
  template: `
  <div>
      <h2 mat-dialog-title>Change Home Location</h2>
      <div>*This will change your progress towards any active goals*</div>
      <input matInput
              placeholder="Search for new location"
              [(ngModel)]="newUsername"
            />
        <!-- <div>
          <button mat-button (click)="onNoClick()">Cancel</button>
          <button mat-button color="warn" (click)="onYesClick()">Confirm</button>
        </div> -->
    </div>
`,
styleUrls: ['changeLocation.component.less']
})


export class ChangeLocationComponent {
  public newUsername:string = '';

  constructor(public dialogRef: MatDialogRef<ChangeLocationComponent>) {}

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    this.dialogRef.close(this.newUsername);
  }
}