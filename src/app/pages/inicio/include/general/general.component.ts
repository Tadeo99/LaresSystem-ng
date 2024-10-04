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
import { CacheGeneralService } from 'src/shared/CacheServiceGeneral';
@Component({
  selector: 'app-inicio-general',
  templateUrl: './general.component.html',
  styleUrl: './general.component.css',
})
export class GeneralComponent implements OnInit, OnChanges {
  @Input() contratoSeleccionado: any;
  @Input() modulo: string;
  tipoDocumento: any;
  showAll: boolean = false;
  numDocumento: any;
  listaProximaLetra: any[] = [];
  listaLastPayment: any[] = [];
  usuario: Usuario | null;
  montoPagadoTotal: number = 0;
  montoProgramadoTotal: number = 0;
  porcentajePagado: number = 0;
  moneda: string;
  cuotasPagadas: number = 0;
  totalCuotas: number = 0;
  listaHistorial: any[] = [];
  UrlBaner: string;
  telefonoCobranzas: string = '';
  
  constructor(
    private cacheService: CacheGeneralService,
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
      this.obtenerHistorial(this.contratoSeleccionado?.numero_contrato);
      this.obtenerProyectoUrl(this.contratoSeleccionado?.codigo_proyecto);
    }
  }

  ngOnChanges() {
    // Code here what you want
  }

  toggleShowAll() {
    this.showAll = !this.showAll;
  }

  async obtenerContrato() {
    console.log('EL CONTRATO SELECCIONAO ES ', this.contratoSeleccionado);
    this.obtenerProxmaLetra(this.contratoSeleccionado?.numero_contrato);
    this.obtenerLastpayment(this.contratoSeleccionado?.numero_contrato);
  }

  async obtenerProxmaLetra(numContrato: string) {
    this.listaProximaLetra =
      this.cacheService.getCache('listaProximaLetra') || [];
    if (this.listaProximaLetra.length == 0) {
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
              this.cacheService.setCache(
                'listaProximaLetra',
                this.listaProximaLetra
              );
            } else {
              this.openModalError(response.mensajeError);
            }
          });
      }
    }
  }

  async obtenerProyectoUrl(contrato: string) {
    var params = {
      codigo: contrato,
    };
  
    this.service.obtenerProyectoUrl(params).subscribe((response: any) => {
      if (!response.isError) {
        const listaUrl = response.listaResultado;
        const banner = listaUrl.find((item: any) => item.tipo === 'Banner');
  
        if (banner) {
          this.UrlBaner = banner.url;
        } else {
          this.openModalError('No se encontró una URL de tipo Banner');
        }
        /*--Boton whatsapp cobranza--*/ 
        const nombreProyecto = this.contratoSeleccionado?.nombre_proyecto; 
          
        const proyectoFiltrado = listaUrl.find((proyecto: any) => proyecto.nombre === nombreProyecto);
        if (proyectoFiltrado) {
          const telefonoCobranzas = proyectoFiltrado.Telefono_cobranzas || '';
          console.log(`Teléfono de cobranzas del proyecto ${nombreProyecto}:`, telefonoCobranzas);
          this.telefonoCobranzas = telefonoCobranzas; 
        } else {
          console.log(`No se encontró un proyecto con el nombre: ${nombreProyecto}`);
          this.telefonoCobranzas = ''; 
        }
      } else {
        this.openModalError(response.mensajeError);
      }
    });
  }
  

  calcularValores() {
    this.totalCuotas = this.listaHistorial.length;
    this.listaHistorial.forEach((historial) => {
      const montoPagado = parseFloat(historial.monto_pagado);
      const saldo = parseFloat(historial.monto_programado); // monto programado
      this.montoPagadoTotal += montoPagado;
      this.montoProgramadoTotal += saldo;
      if (historial.estado === 'pagado') {
        this.cuotasPagadas++;
      }
      this.moneda = historial.moneda;
    });
    if (this.montoProgramadoTotal > 0) {
      this.porcentajePagado =
        (this.montoPagadoTotal * 100) / this.montoProgramadoTotal;
    } else {
      this.porcentajePagado = 0;
    }
  }

  async obtenerHistorial(numContrato: string) {
    this.listaHistorial = this.cacheService.getCache('listaHistorial') || [];
    if (this.listaHistorial.length == 0) {
      if (this.tipoDocumento && this.numDocumento && numContrato) {
        var params = {
          tipoDocumento: this.tipoDocumento,
          numeroDocumento: this.numDocumento,
          numero_contrato: numContrato,
        };
        await this.service.obtenerHistorial(params).subscribe((response) => {
          if (!response.isError) {
            this.listaHistorial = response.listaResultado;
            this.cacheService.setCache('listaHistorial', this.listaHistorial);
            this.calcularValores();
          } else {
            this.openModalError(response.mensajeError);
          }
        });
      }
    } else {
      this.calcularValores();
    }
  }

  async obtenerLastpayment(numContrato: string) {
    this.listaLastPayment =
      this.cacheService.getCache('listaLastPayment') || [];
    if (this.listaLastPayment.length == 0) {
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
              this.cacheService.setCache(
                'listaLastPayment',
                this.listaLastPayment
              );
            } else {
              this.openModalError(response.mensajeError);
            }
          });
      }
    }
  }

  setModulo(modulo: string): void {
    this.modulo = modulo;
    const cacheService = new CacheService<any>('modulo');
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

  getWhatsAppLink(): string {
    if (this.usuario && this.usuario.cliente) {
      const nombreCompleto = this.usuario.cliente.split(' ');     
      const primerNombre = this.toCamelCase(nombreCompleto[0]); 
      const primerApellido = nombreCompleto.length > 1 ? this.toCamelCase(nombreCompleto[1]) : '';
      const mensaje = `¡Hola! te escribe *${primerNombre} ${primerApellido}* 👋 Tengo algunas consultas sobre el proceso de Cobranzas ¿Podría ayudarme?`;
  
      return `https://api.whatsapp.com/send?phone=${this.telefonoCobranzas}&text=${encodeURIComponent(mensaje)}`;
    }
    return '#'; 
  }  
  
  toCamelCase(text: string): string {
    return text
      .toLowerCase() 
      .replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match) =>
        match.charAt(0).toUpperCase() + match.slice(1) 
      )
      .replace(/\s+/g, ''); 
  }
  
  goLogin() {
    localStorage.clear();
    this.usuarioService.deleteUsuario();
    window.location.href = environment.angHome + 'login';
  }
  formatMilesNumber(number: number | string): string {
    if (!number) return '';
    let numericValue = typeof number === 'string' ? parseFloat(number) : number;
    if (!isNaN(numericValue)) {
      return numericValue.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    } else {
      return '';
    }
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
        accordionItems.forEach((item) => {
          item.classList.remove('show');
        });
      }
      if (!isCollapsed) {
        element.classList.add('show');
      }
    }
  }
}
