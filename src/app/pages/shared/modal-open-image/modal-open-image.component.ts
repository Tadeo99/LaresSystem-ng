import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'mapfre-modal-open-image',
  templateUrl: './modal-open-image.component.html',
  styleUrls: ['./modal-open-image.component.scss'],
})
export class ModalOpenImageComponent implements OnInit {
  imagenUrl: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private modalRef: MatDialogRef<ModalOpenImageComponent>
  ) {
    // Asumiendo que la URL de la imagen viene en data.process.documentoUrl
    this.imagenUrl = this.data.documentoUrl;
  }

  ngOnInit() {}

  mostrarImagen() {
    window.open(this.imagenUrl);
  }

  redirect() {
    this.modalRef.close();
  }
}
