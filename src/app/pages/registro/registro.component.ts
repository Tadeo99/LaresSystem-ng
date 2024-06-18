import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiserviceService } from 'src/app/apiservice.service';
import { AlertComponent } from 'src/shared/components/alert/alert.component';
import { PATH_URL_DATA } from 'src/shared/helpers/constants';
import { ModalMessageComponent } from 'src/shared/components/modal-message/modal-message.component';
@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'

})
export class RegistroComponent {

  tipoDocumento: string = "T";
  numeroDocumento: string;
  respuesta: any;
  listaResultado: any;
  objetoResultado: any;
  formularioSubmitted: boolean = false;
  constructor(private service: ApiserviceService, private router: Router, private dialog: MatDialog) {}

  validaRegistro() {
    //this.formularioSubmitted = true;
    if(this.tipoDocumento && this.numeroDocumento && this.tipoDocumento != "T" ){
      var params = { tipoDocumento: this.tipoDocumento, numeroDocumento: this.numeroDocumento };
      this.service.validaRegistro(params)
        .subscribe((response: any) => {
          if (!response.isError && response.objetoResultado) {
            this.success(response.objetoResultado);
          } else {
            this.openModalError(response.mensajeError);
          }
        })
    }
  }

  botonActivo: string = 'boton1'; // Inicialmente el botón activo es boton1

  activarBoton(boton: string) {
    this.botonActivo = boton;
  }

  success(mensaje : any) {
    const dialogRef = this.dialog.open(ModalMessageComponent, {
      width: '400px', data: { success: {message: mensaje}}
    });
    dialogRef.afterClosed().subscribe(result => {
      this.openView(1);
    });
  }

  openMsgExito(message: string) {
    var alert = { title: 'Éxito', message: message };
    const dialogRef = this.dialog.open(AlertComponent, {
      width: '400px', data: { alert: alert }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.openView(1);
    });
  }

  // Mostrar modal de alerta en caso de error al guardar
  openModalError(message: string) {
    var alert = { title: 'Alerta', message: message };

    const dialogRef = this.dialog.open(AlertComponent, {
      width: '400px', data: { alert: alert }
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  openView(id:any) {
    this.router.navigate([PATH_URL_DATA[id]], { replaceUrl: false });
  }

  isTipoDocumentoInvalid(): boolean {
    return this.formularioSubmitted && (this.tipoDocumento === 'T' || !this.tipoDocumento);
  }

}