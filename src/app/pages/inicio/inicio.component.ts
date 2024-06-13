import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
  OnChanges
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '@environments/environments';
import { ApiserviceService } from 'src/app/apiservice.service';
import { AlertComponent } from 'src/shared/components/alert/alert.component';
import { ContratoService } from 'src/shared/ContratoService';
import { MODULES, PATH_URL_DATA } from 'src/shared/helpers/constants';
import { Usuario } from 'src/shared/models/common/clases/usuario';
import { UsuarioService } from 'src/shared/usuarioService';
import { Contrato } from 'src/shared/models/common/clases/contrato';
import { CacheService } from 'src/shared/CacheService';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css',
})
export class InicioComponent implements OnInit,OnChanges {
  @ViewChild('dropdownMenu') dropdownMenu: ElementRef;
  tipoDocumento: any;
  numDocumento: any;
  listaContrato: any[] = [];
  contratoSeleccionado: any;
  listaProximaLetra: any[] = [];
  listaLastPayment: any[] = [];
  dropdownOpen = false;
  dropdownSession = false;
  usuario: Usuario | null;
  contrato: Contrato | null;
  modulo: string = MODULES.INICIO;

  constructor(
    private usuarioService: UsuarioService,
    private contratoService: ContratoService,
    private service: ApiserviceService,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.usuario = this.usuarioService.getUsuario();
    if (!this.usuario || this.usuario === null) {
      this.goLogin();
    } else {
      this.recuperarParametros();
      this.obtenerContrato();
      const cacheService = new CacheService<any>("modulo");
      if(cacheService){
        this.modulo = cacheService.getCache() || 'INICIO';
      }
    }
  }

  ngOnChanges() {
    // Code here what you want
  }

  toggleDropdownAndSelect() {
    if (this.dropdownOpen) {
      this.dropdownOpen = true;
    } else {
      this.closeDropdown();
    }
  }

  setModulo(modulo: string): void {
    this.modulo = modulo;
    const cacheService = new CacheService<any>("modulo");
    cacheService.setCache(this.modulo);
  }

  // Método para verificar si un módulo está activo
  isModuloActivo(modulo: string) {
    return this.modulo === modulo;
  }

  cerrarSesion() {
    this.usuarioService.deleteUsuario();
    this.goLogin();
  }

  seleccionarContrato(event: any, contratoTemp: any) {
    this.contratoSeleccionado = this.listaContrato.find(
      (contrato) => contrato.numero_contrato === contratoTemp.numero_contrato
    );
    this.llenarContrato();
    window.location.reload();
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
    const cacheService = new CacheService<any>("listaContrato");
    this.listaContrato = cacheService.getCache() || [];
    this.contratoSeleccionado = this.contratoService.getContrato();
    if (this.listaContrato.length === 0) {
      if (this.tipoDocumento && this.numDocumento) {
        const params = {
          tipoDocumento: this.tipoDocumento,
          numeroDocumento: this.numDocumento,
        };
        await this.service
          .obtenerContrato(params)
          .subscribe((response: any) => {
            if (!response.isError) {
              this.listaContrato = response.listaResultado;
              if (this.listaContrato.length > 0) {
                this.contratoSeleccionado = this.listaContrato[0];
                this.contrato = new Contrato(
                  this.contratoSeleccionado.numero_contrato,
                  this.contratoSeleccionado.documento_cliente,
                  this.contratoSeleccionado.tipo_documento,
                  this.contratoSeleccionado.nombre_proyecto,
                  this.contratoSeleccionado.nombre,
                  this.contratoSeleccionado.Cliente,
                  this.contratoSeleccionado.Manzana,
                  this.contratoSeleccionado.Lote,
                  this.contratoSeleccionado.telefono,
                  this.contratoSeleccionado.celulares
                );
                const cacheService = new CacheService<any>("listaContrato");
                cacheService.setCache(response.listaResultado);
                this.contratoService.setContrato(this.contrato);
              }
              console.log('Lista contrato desde servicio', this.listaContrato);
            } else {
              this.openModalError(response.mensajeError);
            }
          });
      }
    }else{
      this.contratoSeleccionado = this.contratoService.getContrato();
    }
  }

  llenarContrato() {
    this.contrato = new Contrato(
      this.contratoSeleccionado.numero_contrato,
      this.contratoSeleccionado.documento_cliente,
      this.contratoSeleccionado.tipo_documento,
      this.contratoSeleccionado.nombre_proyecto,
      this.contratoSeleccionado.nombre,
      this.contratoSeleccionado.Cliente,
      this.contratoSeleccionado.Manzana,
      this.contratoSeleccionado.Lote,
      this.contratoSeleccionado.telefono,
      this.contratoSeleccionado.celulares
    );
    this.contratoService.deleteContrato();
    this.contratoService.setContrato(this.contrato);
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    if (!event.target) {
      return;
    }
    const clickedInside = this.isClickedInside(
      event.target as HTMLElement,
      '.dropdown'
    );
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
    /*this.activatedRoute.paramMap.subscribe((params) => {
      let id = params.get('tipoDocumento');
      let id_dos = params.get('numDocumento');
      this.tipoDocumento = id;
      this.numDocumento = id_dos;
    });*/
    this.tipoDocumento = this.usuario?.tipoDocumento;
    this.numDocumento = this.usuario?.documentoCliente;
  }

  goLogin() {
    localStorage.clear();
    this.usuarioService.deleteUsuario();
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
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return new Date(date).toLocaleDateString('es-ES', options);
  }

  formatCurrency(amount: string): string {
    return `USD ${parseFloat(amount).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  openView(id: any) {
    console.log('entro a');
    this.router.navigate([PATH_URL_DATA[id]], { replaceUrl: false });
  }
}
