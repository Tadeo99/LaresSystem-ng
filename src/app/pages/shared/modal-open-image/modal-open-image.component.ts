import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AlertComponent } from 'src/shared/components/alert/alert.component';
import { ALERT_MESSAGES,ALERT_TYPE } from 'src/shared/helpers/constants';
@Component({
  selector: 'mapfre-modal-open-image',
  templateUrl: './modal-open-image.component.html',
  styleUrls: ['./modal-open-image.component.scss']
})

export class ModalOpenImageComponent implements OnInit {

  imagenBase64: string ;

  process: any;
  imagenFile: File;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private modalRef: MatDialogRef<ModalOpenImageComponent>,
    private dialog: MatDialog) { 
      this.imagenBase64 = 'data:image/'+this.data.process.tipoDocumento+';base64,'+this.data.process.documentoBase64;
    }

  ngOnInit() {
    this.process = this.data.process;
  }

  convertirBase64AFile(base64: string, nombreArchivo: string): File {
    const byteString = atob(base64.split(',')[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new File([ab], nombreArchivo, { type: 'image/png' }); // Ajusta el tipo según el formato de tu imagen
  }

  mostrarImagen() {
    window.open(this.imagenBase64);
    this.imagenFile = this.convertirBase64AFile(this.imagenBase64, 'imagen.png');
  }

  redirect() {
    this.modalRef.close();
  }

}
