import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiserviceService } from 'src/app/apiservice.service';
import { PATH_URL_DATA } from 'src/shared/helpers/constants';
import { CargarScriptsService } from 'src/app/cargar-scripts.service';
import { AlertComponent } from 'src/shared/components/alert/alert.component';
import { MatDialog } from '@angular/material/dialog';
import { Usuario } from 'src/shared/models/common/clases/usuario';
import { UsuarioService } from 'src/shared/usuarioService';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})

export class LoginComponent {
  email: string;
  tipoDocumento: string = 'T';
  numeroDocumento: string;
  password: string;
  usuario: Usuario; 
  constructor(
    private usuarioService: UsuarioService,
    private service: ApiserviceService,
    private router: Router,
    private _CargaScripts: CargarScriptsService,
    private dialog: MatDialog
  ) {
    
  }

  openView(id: any) {
    this.router.navigate([PATH_URL_DATA[id]], { replaceUrl: false });
  }

  login() {
    const params = {
      tipoDocumento: this.tipoDocumento,
      numeroDocumento: this.numeroDocumento,
      password: this.password,
    };
    this.service.login(params).subscribe((response: any) => {
      if (!response.isError) {
        if (response.pagination === 'CHANGES PASSWORD') {
          this.viewDetail('change-password');
        } else {
          this.viewDetail('inicio');
        }
        this.usuario = new Usuario(
          response.listaResultado.documento_cliente,
          response.listaResultado.tipo_documento,
          response.listaResultado.nombre,
          response.listaResultado.cliente,
          response.listaResultado.telefono,
          response.listaResultado.celulares,
          response.listaResultado.usuario,
          ''
        );
        localStorage.clear();
        this.usuarioService.setUsuario(this.usuario);
      } else {
        this.openModalError(response.mensajeError);
      }
    });
  }

  validaPagina() {
    const params = {
      tipoDocumento: this.tipoDocumento,
      numeroDocumento: this.numeroDocumento,
    };
    this.service.validaUsuario(params).subscribe((response: any) => {
      if (!response.isError) {
        if (response.objetoResultado === 'NOK') {
          this.viewDetail('change-password');
        } else {
          this.viewDetail('inicio');
        }
      } else {
        this.openModalError(response.mensajeError);
      }
    });
  }

  // Mostrar modal de alerta en caso de error al guardar
  openModalError(message: string) {
    var alert = { title: 'Alerta', message: message };
    const dialogRef = this.dialog.open(AlertComponent, {
      width: '400px',
      data: { alert: alert },
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }

  viewDetail(namePage: string) {
    var id = this.tipoDocumento;
    var id_dos = this.numeroDocumento;
    this.router.navigate([namePage, id, id_dos], { replaceUrl: false });
  }


}
