import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-confirm',
  template: `
  <div class="confirm-delete">
      <h2 mat-dialog-title>Delete Permanently?</h2>
      <div>Cannot be undone</div>
      <div>
          <button mat-button (click)="onNoClick()">Cancel</button>
          <button mat-button color="warn" (click)="onYesClick()">Delete</button>
        </div>
    </div>
`,
styleUrls: ['deleteConfirm.component.less']
})
export class DeleteConfirmComponent {
  constructor(public dialogRef: MatDialogRef<DeleteConfirmComponent>) {}

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    this.dialogRef.close(true);
  }
}