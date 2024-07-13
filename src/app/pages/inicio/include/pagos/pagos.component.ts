import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '@environments/environments';
import { ApiserviceService } from 'src/app/apiservice.service';
import { AlertComponent } from 'src/shared/components/alert/alert.component';
import { PATH_URL_DATA } from 'src/shared/helpers/constants';
import { Usuario } from 'src/shared/models/common/clases/usuario';
import { UsuarioService } from 'src/shared/usuarioService';
import { DatePipe } from '@angular/common';
import { ModalBoletaComponent } from '@pages/shared/modal-show-boleta/modal-boleta.component';

@Component({
  selector: 'app-pagos',
  templateUrl: './pagos.component.html',
  styleUrls: ['./pagos.component.css'],
})
export class PagosComponent implements OnInit {
  datos: any;
  @Input() contratoSeleccionado: any;
  currentDate: Date = new Date();
  currentPage: number = 1; // Página actual
  itemsPerPage: number = 10; // Elementos por página
  tipoDocumento: any;
  numDocumento: any;
  listaHistorial: any[] = [];
  listaCutotasVencidas: any[] = [];
  usuario: Usuario | null;

  montoPagadoTotal: number = 0;
  montoProgramadoTotal: number = 0;
  porcentajePagado: number = 0;
  moneda: string;
  cuotasPagadas: number = 0;
  totalCuotas: number = 0;
  listaProximaLetra: any[] = [];
  currentSlide = 0;  
  crsl = [
    {
      specialStyle: true
    },
  ];
  slides = [
    {
      image: 'https://sperant.s3.amazonaws.com/lares/gallery/project/inicio_20240706204617.png', 
      stepTitle: 'PASO 1',
      stepDescription: 'Elige “Pago de Servicios” en el menú principal.',
      additionalInfo: 'Pagar servicios',
      shape: 'oval',
      iconClass: 'droplet',
      specialStyle: true
    },
    {
      image: 'https://sperant.s3.amazonaws.com/lares/gallery/project/monteflor_2_20240706204619.png', 
      stepTitle: 'PASO 2',
      stepDescription: 'Colocar el nombre de la empresa a pagar.',
      additionalInfo: 'Inmobiliaria Monte Flor Sac',
      shape: 'rectangle',
      iconClass: 'search',
      specialStyle: true
    },
    {
      image: 'https://sperant.s3.amazonaws.com/lares/gallery/project/monteflor_3_20240706204622.png',
      stepTitle: 'PASO 3',
      stepDescription: 'Selecciona el tipo de servicio:',
      strong1:'Cobranzas',      
      additionalInfo: '(para pago en Soles)',      
      shape: 'limp',
      strong2:'Letras', 
      additionalInfo2: '(para pago en Dólares)',
      specialStyle: true
    },
    {
      image: 'https://sperant.s3.amazonaws.com/lares/gallery/project/monteflor_4_20240706204625.png', 
      stepTitle: 'PASO 4',
      stepDescription: 'Para finalizar deberás colocar tu número de DNI y',
      strongp: 'seleccionar la cuota a pagar',
      shape: 'limp',
      specialStyle: true,
    },
  ];

  constructor(
    private usuarioService: UsuarioService,
    private service: ApiserviceService,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private datePipe: DatePipe
  ) {}

  prevSlide() {
    this.currentSlide = (this.currentSlide === 0) ? this.slides.length - 1 : this.currentSlide - 1;
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide === this.slides.length - 1) ? 0 : this.currentSlide + 1;
  }

  goToSlide(index: number) {
    this.currentSlide = index;
  }

  openModalBoleta(nombrePago: string) {
    const dialogRef = this.dialog.open(ModalBoletaComponent, {
      width: '500px',  data: { numContrato: this.contratoSeleccionado.numero_contrato, nombre_pago: nombrePago }
    });
    dialogRef.afterClosed().subscribe(result => {});
  }

  isDeudaVencida(historial: any): boolean {
    const currentDate = new Date();
    const fechaVencimiento = new Date(historial.fecha_vcto);
    return fechaVencimiento < currentDate && parseFloat(historial.saldo) > 0;
  }

  getTotalPages() {
    return Math.ceil(this.listaHistorial.length / this.itemsPerPage);
  }

  getPaginatedList() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.listaHistorial.slice(startIndex, endIndex);
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    const totalPages = Math.ceil(this.listaHistorial.length / this.itemsPerPage);
    if (this.currentPage < totalPages) {
      this.currentPage++;
    }
  }
  toggleAccordion(id: string) {
    const element = document.getElementById(id);
    if (element) {
      element.classList.toggle('show');
    }
  }
  ngOnInit(): void {
    this.usuario = this.usuarioService.getUsuario();
    this.recuperarParametros();
    this.obtenerContrato();
  }

  calcularValores() {
    this.totalCuotas = this.listaHistorial.length;
    this.listaHistorial.forEach(historial => {
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
      this.porcentajePagado = (this.montoPagadoTotal * 100) / this.montoProgramadoTotal;
    } else {
      this.porcentajePagado = 0;
    }
  }

  get tieneDeudas(): boolean {
    const hoy = new Date();
    const cuotasConDeuda = this.listaHistorial.filter(historial => {
      return new Date(historial.fecha_vcto) < hoy && historial.estado !== 'pagado';
    });
    return cuotasConDeuda.length > 0;
  }

  cerrarSesion() {
    this.goLogin();
  }

  transform(value: any): any {
    if (value) {
      const dateParts = value.split('-');
      return `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
    }
    return "-";
  }

  async obtenerContrato() {
    this.obtenerHistorial(this.contratoSeleccionado?.numero_contrato);
  }

  async obtenerHistorial(numContrato: string) {
    if (this.tipoDocumento && this.numDocumento && numContrato) {
      var params = {
        tipoDocumento: this.tipoDocumento,
        numeroDocumento: this.numDocumento,
        numero_contrato: numContrato,
      };
      await this.service.obtenerHistorial(params).subscribe((response) => {
        if (!response.isError) {
          this.listaHistorial = response.listaResultado;
          if (this.listaHistorial.length > 0) {
            this.listaCutotasVencidas = response.listaResultado.filter((historial: any) => {
              return new Date(historial.fecha_vcto) < new Date() && historial.estado !== 'pagado';
            });
          }
          this.calcularValores();
        } else {
          this.openModalError(response.mensajeError);
        }
      });
    }
  }

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
    this.viewDetail('change-password');
  }

  viewDetail(namePage: string) {
    var id = this.usuario?.tipoDocumento;
    var id_dos = this.usuario?.documentoCliente;
    this.router.navigate([namePage, id, id_dos], { replaceUrl: false });
  }

  formatDate(date: string): string {
    if (date) {
      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      };
      return new Date(date).toLocaleDateString('es-ES', options);
    }
    return "-";
  }

  formatDateTemp(date: any): string {
    if (date) {
      const formattedDate = this.datePipe.transform(date, 'dd/MM/yyyy');
      return formattedDate ? formattedDate : "-";
    }
    return "-";
  }

  formatMilesNumber(number: number | string): string {
    if (!number) return '';
    let numericValue = typeof number === 'string' ? parseFloat(number) : number;
    if (!isNaN(numericValue)) {
      return numericValue.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    } else {
      return '';
    }
  }

  formatCurrency(amount: string): string {
    return `USD ${parseFloat(amount).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  openView(id: any) {
    this.router.navigate([PATH_URL_DATA[id]], { replaceUrl: false });
  }

  viewPageInicio() {
    this.router.navigate(
      ['inicio', this.usuario?.tipoDocumento, this.usuario?.documentoCliente],
      {
        replaceUrl: false,
      }
    );
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
          } else {
            this.openModalError(response.mensajeError);
          }
        });
    }
  }
}
