import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-reset-confirm',
  template: `
  <div class="confirm-reset">
      <h2 mat-dialog-title>Are you sure?</h2>
      <div>Cannot be undone</div>
      <div>This will remove any active goal progress</div>
      <div>
          <button mat-button (click)="onNoClick()">Cancel</button>
          <button mat-button color="warn" (click)="onYesClick()">Reset</button>
        </div>
    </div>
`,
styleUrls: ['resetConfirm.component.less']
})
export class ResetConfirmComponent {
  constructor(public dialogRef: MatDialogRef<ResetConfirmComponent>) {}

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    this.dialogRef.close(true);
  }
}