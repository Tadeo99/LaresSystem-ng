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

@Component({
  selector: 'app-pagos',
  templateUrl: './pagos.component.html',
  styleUrl: './pagos.component.css',
})
export class PagosComponent implements OnInit {
  datos: any;
  @Input() contratoSeleccionado: any;
  currentPage: number = 1; // Página actual
  itemsPerPage: number = 10; // Elementos por página
  tipoDocumento: any;
  numDocumento: any;
  listaHistorial: any[] = [];
  usuario: Usuario | null;

  montoPagadoTotal: number = 0;
  montoProgramadoTotal: number = 0;
  porcentajePagado: number = 0;
  cuotasPagadas: number = 0;
  totalCuotas: number = 0;
  listaProximaLetra: any[] = [];

  constructor(
    private usuarioService: UsuarioService,
    private service: ApiserviceService,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private datePipe: DatePipe
    
  ) {}

  getTotalPages() {
    return Math.ceil(this.listaHistorial.length / this.itemsPerPage);
  }

  // Función para obtener la lista de elementos actual basada en la paginación
  getPaginatedList() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.listaHistorial.slice(startIndex, endIndex);
  }

  // Función para ir a la página anterior
  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  // Función para ir a la página siguiente
  nextPage() {
    const totalPages = Math.ceil(this.listaHistorial.length / this.itemsPerPage);
    if (this.currentPage < totalPages) {
      this.currentPage++;
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
      const saldo = parseFloat(historial.monto_programado);//monto programado
      this.montoPagadoTotal += montoPagado;
      this.montoProgramadoTotal += saldo;
      if (historial.estado === 'pagado') {
        this.cuotasPagadas++;
      }
    });
    if (this.montoProgramadoTotal > 0) {
      this.porcentajePagado = (this.montoPagadoTotal * 100) / this.montoProgramadoTotal;
    } else {
      this.porcentajePagado = 0;
    }
  }
//si tiene deudas el cliente
  get tieneDeudas(): boolean {
    return this.cuotasPagadas < this.totalCuotas;
  }

  cerrarSesion() {
    this.goLogin();
  }

  transform(value: any): any {
    if (value) {
      const dateParts = value.split('-');
      return  `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}` ;
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
      await this.service.obtenerHistorial(params).subscribe((response: any) => {
        if (!response.isError) {
          this.listaHistorial = response.listaResultado;
          this.calcularValores();
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
    if(date){
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
            console.log('Lista proxima Letra ', this.listaProximaLetra);
          } else {
            this.openModalError(response.mensajeError);
          }
        });
    }
  }
}
