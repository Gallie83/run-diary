import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-change-username',
  standalone: true,
  imports: [FormsModule],
  template: `
  <div>
      <h2 mat-dialog-title>Change Username</h2>
      <input matInput
              placeholder="New Username"
              [(ngModel)]="newUsername"
            />
        <div>
          <button mat-button (click)="onNoClick()">Cancel</button>
          <button mat-button color="warn" (click)="onYesClick()">Confirm</button>
        </div>
    </div>
`,
styleUrls: ['changeUsername.component.less']
})
export class ChangeUsernameComponent {
  public newUsername:string = '';

  constructor(public dialogRef: MatDialogRef<ChangeUsernameComponent>) {}

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    this.dialogRef.close(this.newUsername);
  }
}