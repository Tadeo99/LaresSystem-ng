import { Component, OnInit, ElementRef, ViewChild,HostListener  } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ApiserviceService } from 'src/app/apiservice.service';
import { AlertComponent } from 'src/shared/components/alert/alert.component';
import { environment } from '@environments/environments';
import { UsuarioService } from 'src/shared/usuarioService';
import { PATH_URL_DATA } from 'src/shared/helpers/constants';
import { Usuario } from 'src/shared/models/common/clases/usuario';
@Component({
  selector: 'app-read',
  templateUrl: './read.component.html',
  styleUrl: './read.component.css',
})
export class ReadComponent implements OnInit {
    datos: any;

    @ViewChild('dropdownMenu') dropdownMenu: ElementRef;
    tipoDocumento: any;
    numDocumento: any;
    listaContrato: any[] = [];
    contratoSeleccionado : any;
    listaHistorial: any[] = [];
    dropdownOpen = false;
    dropdownSession = false;
    usuario: Usuario | null;

  // usuario: any;
  // usuarioId: number;

  constructor(
    private usuarioService: UsuarioService,
    private service: ApiserviceService,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.usuario = this.usuarioService.getUsuario();
    if(!this.usuario || this.usuario === null){
      this.goLogin();
    }else{
      this.recuperarParametros();
      this.obtenerContrato();
    }
  }

  toggleDropdownAndSelect() {
    if (this.dropdownOpen) {
      this.dropdownOpen = true;
    } else {
      this.closeDropdown();
    }
  }

  cerrarSesion() {
    this.goLogin();
  }
  

  seleccionarContrato(event: any, contratoTemp: any) {
    this.contratoSeleccionado = this.listaContrato.find(
      contrato => contrato.numero_contrato === contratoTemp.numero_contrato
    );
    if (this.contratoSeleccionado) {
      this.obtenerHistorial(this.contratoSeleccionado.numero_contrato);
    }
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  closeDropdown() {
    this.dropdownOpen = false;
  }

  toggleDropdownSession() {
    this.dropdownSession = !this.dropdownSession;
  }


  async obtenerContrato() {
    console.log("tipo odcumentonsa",this.tipoDocumento);
    if (this.tipoDocumento && this.numDocumento) {
      var params = {
        tipoDocumento: this.tipoDocumento,
        numeroDocumento: this.numDocumento,
      };
      await this.service.obtenerContrato(params).subscribe((response: any) => {
        if (!response.isError) {
          this.listaContrato = response.listaResultado;
          if (this.listaContrato.length > 0) {
            this.contratoSeleccionado = this.listaContrato[0];
            
            this.obtenerHistorial(this.contratoSeleccionado?.numero_contrato);
          }
          console.log("Lista contrato ",this.listaContrato);
        } else {
          this.openModalError(response.mensajeError);
        }
      });

    }
  }


  async obtenerHistorial(numContrato : string) {
    if (this.tipoDocumento && this.numDocumento && numContrato ){
      var params = {
        tipoDocumento: this.tipoDocumento,
        numeroDocumento: this.numDocumento,
        numero_contrato: numContrato
      };
      await this.service.obtenerHistorial(params).subscribe((response: any) => {
        if (!response.isError) {
          this.listaHistorial = response.listaResultado;
        } else {
          this.openModalError(response.mensajeError);
        }
      });
    }
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    if (!event.target) {
      return;
    }
    const clickedInside = this.isClickedInside(event.target as HTMLElement, '.dropdown');
    if (!clickedInside) {
      this.closeDropdown();
    }
  }
  

  private isClickedInside(target: HTMLElement, className: string): boolean {
    return !!target.closest(className);
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

  openMsgExito(message: string) {
    var alert = { title: 'Éxito', message: message };
    const dialogRef = this.dialog.open(AlertComponent, {
      width: '400px',
      data: { alert: alert },
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }

  recuperarParametros() {
    this.tipoDocumento = this.usuario?.tipoDocumento;
    this.numDocumento = this.usuario?.documentoCliente;
  }

  
  goLogin() {
    this.usuarioService.deleteUsuario();
    localStorage.clear();
    window.location.href = environment.angHome + 'login';
  }

  cambiarContrasena() {
    // Redirigir al componente de cambio de contraseña
    this.viewDetail('change-password');
  }

  viewDetail(namePage: string) {
    var id = this.usuario?.tipoDocumento;
    var id_dos = this.usuario?.documentoCliente;
    this.router.navigate([namePage, id, id_dos], { replaceUrl: false });
  }

  formatDate(date: string): string {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('es-ES', options);
  }

  formatCurrency(amount: string): string {
    return `USD ${parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  openView(id:any) {
    console.log("entro a");
    this.router.navigate([PATH_URL_DATA[id]], { replaceUrl: false });
  }

  viewPageInicio() {
    this.router.navigate(['inicio', this.usuario?.tipoDocumento, this.usuario?.documentoCliente], {
      replaceUrl: false,
    });
  }

}
