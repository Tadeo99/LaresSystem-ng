import { Component, OnInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiserviceService } from 'src/app/apiservice.service';
import { environment } from '@environments/environments';
import { UsuarioService } from 'src/shared/usuarioService';
import { AlertComponent } from 'src/shared/components/alert/alert.component';
import { PATH_URL_DATA } from 'src/shared/helpers/constants';
import { Usuario } from 'src/shared/models/common/clases/usuario';
@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css',
})
export class ChangePasswordComponent implements OnInit {
  tipoDocumento: string | undefined;
  numDocumento: string | undefined;
  passwordActual: string;
  nuevaPassword: string;
  usuario: Usuario | null;
  showPasswordActual: boolean = false;
  showNuevaPassword: boolean = false;

  constructor(
    private service: ApiserviceService,
    private router: Router,
    private usuarioService: UsuarioService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.usuario = this.usuarioService.getUsuario();
    if(!this.usuario || this.usuario === null){
      this.goLogin();
    }else{
      this.recuperarParametros();
    }
  }

  recuperarParametros() {
    this.tipoDocumento = this.usuario?.tipoDocumento;
    this.numDocumento = this.usuario?.documentoCliente;
  }

  goLogin() {
    localStorage.clear();
    this.usuarioService.deleteUsuario();
    window.location.href = environment.angHome + 'login';
  }

  togglePasswordVisibility(field: string): void {
    if (field === 'actual') {
      this.showPasswordActual = !this.showPasswordActual;
    } else if (field === 'nueva') {
      this.showNuevaPassword = !this.showNuevaPassword;
    }
  }

  openView(id: any) {
    this.router.navigate([PATH_URL_DATA[id]], { replaceUrl: false });
  }

  cambiarPassword(formulario: any): void {
    if (formulario.invalid) {
      for (const controlName in formulario.controls) {
        if (formulario.controls.hasOwnProperty(controlName)) {
          const control: AbstractControl = formulario.controls[controlName];
          control.markAsTouched();
        }
      }
      return; // Detiene el envío si el formulario es inválido
    }

    if (
      this.tipoDocumento &&
      this.numDocumento &&
      this.passwordActual &&
      this.nuevaPassword
    ) {
      const params = {
        tipoDocumento: this.tipoDocumento,
        numeroDocumento: this.numDocumento,
        passwordActual: this.passwordActual,
        nuevaPassword: this.nuevaPassword,
      };
      this.service.cambiarPassword(params).subscribe((response: any) => {
        if (!response.isError) {
          console.log('tipo documento: ' + this.tipoDocumento);
          console.log('numero documento: ' + this.numDocumento);
          console.log('password actual: ' + this.passwordActual);
          console.log('nueva password: ' + this.nuevaPassword);
          this.viewPageInicio();
        } else {
          this.openModalError(response.mensajeError);
        }
      });
    }
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

  viewPageInicio() {
    this.router.navigate(['inicio', this.tipoDocumento, this.numDocumento], {
      replaceUrl: false,
    });
  }
  
}
