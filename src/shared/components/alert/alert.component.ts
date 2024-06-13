import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IAlerta } from 'src/shared/models/common/interfaces/alert.interface';
@Component({
  selector: 'mapfre-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})

export class AlertComponent implements OnInit {
  alert: IAlerta;

  constructor(public dialogRef: MatDialogRef<AlertComponent>,@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.alert = this.data.alert;
  }

  onClose(): void {
    this.dialogRef.close();
  }
  
}
