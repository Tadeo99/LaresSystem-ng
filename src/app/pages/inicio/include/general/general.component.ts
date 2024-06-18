import {
  Component,
  Input,
  OnInit,OnChanges
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '@environments/environments';
import { ApiserviceService } from 'src/app/apiservice.service';
import { AlertComponent } from 'src/shared/components/alert/alert.component';
import { PATH_URL_DATA } from 'src/shared/helpers/constants';
import { Usuario } from 'src/shared/models/common/clases/usuario';
import { UsuarioService } from 'src/shared/usuarioService';
import { CacheService } from 'src/shared/CacheService';

@Component({
  selector: 'app-inicio-general',
  templateUrl: './general.component.html',
  styleUrl: './general.component.css',
})
export class GeneralComponent implements OnInit,OnChanges {
  @Input() contratoSeleccionado: any;
  @Input() modulo: string;
  tipoDocumento: any;
  showAll: boolean = false;
  numDocumento: any;
  listaProximaLetra: any[] = [];
  listaLastPayment: any[] = [];
  usuario: Usuario | null;
  
  constructor(
    private usuarioService: UsuarioService,
    private service: ApiserviceService,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.usuario = this.usuarioService.getUsuario();
    if (!this.usuario || this.usuario === null) {
      this.goLogin();
    } else {
      this.recuperarParametros();
      this.obtenerContrato();
    }
  }

  ngOnChanges() {
    // Code here what you want
  }

  toggleShowAll() {
    this.showAll = !this.showAll;
  }

  async obtenerContrato() {
    console.log("EL CONTRATO SELECCIONAO ES ", this.contratoSeleccionado);
    this.obtenerProxmaLetra(this.contratoSeleccionado?.numero_contrato);
    this.obtenerLastpayment(this.contratoSeleccionado?.numero_contrato);
  }

  async obtenerProxmaLetra(numContrato: string) {
    if (this.tipoDocumento && this.numDocumento && numContrato) {
      var params = {
        tipoDocumento: this.tipoDocumento,
        numeroDocumento: this.numDocumento,
        numero_contrato: numContrato,
      };
      await this.service
        .obtenerProximaLetra(params)
        .subscribe((response: any) => {
          if (!response.isError) {
            this.listaProximaLetra = response.listaResultado;
            console.log('Lista proxima Letra ', this.listaProximaLetra);
          } else {
            this.openModalError(response.mensajeError);
          }
        });
    }
  }

  async obtenerLastpayment(numContrato: string) {
    if (this.tipoDocumento && this.numDocumento && numContrato) {
      var params = {
        tipoDocumento: this.tipoDocumento,
        numeroDocumento: this.numDocumento,
        numero_contrato: numContrato,
      };
      await this.service
        .obtenerLastPayment(params)
        .subscribe((response: any) => {
          if (!response.isError) {
            this.listaLastPayment = response.listaResultado;
            console.log('obtenerLastPayment ', this.listaLastPayment);
          } else {
            this.openModalError(response.mensajeError);
          }
        });
    }
  }

  setModulo(modulo: string): void {
    this.modulo = modulo;
    const cacheService = new CacheService<any>("modulo");
    cacheService.setCache(this.modulo);
    window.location.reload();
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
    localStorage.clear();
    this.usuarioService.deleteUsuario();
    window.location.href = environment.angHome + 'login';
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
    return `${parseFloat(amount).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  openView(id: any) {
    this.router.navigate([PATH_URL_DATA[id]], { replaceUrl: false });
  }

  toggleAccordion(id: string): void {
    const element = document.getElementById(id);
    if (element) {
      const isCollapsed = element.classList.contains('show');
      const parent = element.parentElement;
      if (parent) {
        const accordionItems = parent.querySelectorAll('.accordion-collapse');
        accordionItems.forEach(item => {
          item.classList.remove('show');
        });
      }
      if (!isCollapsed) {
        element.classList.add('show');
      }
    }
  }
}
