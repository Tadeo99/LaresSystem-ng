import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '@environments/environments';
import { ApiserviceService } from 'src/app/apiservice.service';
import { AlertComponent } from 'src/shared/components/alert/alert.component';
import { PATH_URL_DATA } from 'src/shared/helpers/constants';
import { Usuario } from 'src/shared/models/common/clases/usuario';
import { UsuarioService } from 'src/shared/usuarioService';
import { ModalOpenImageComponent } from '@pages/shared/modal-open-image/modal-open-image.component';
import { CacheService } from 'src/shared/CacheService';
@Component({
  selector: 'app-inmueble',
  templateUrl: './inmueble.component.html',
  styleUrl: './inmueble.component.css',
})
export class inmuebleComponent implements OnInit {
  datos: any;
  @Input() contratoSeleccionado: any;
  currentPage: number = 1; // Página actual
  itemsPerPage: number = 10; // Elementos por página
  tipoDocumento: any;
  numDocumento: any;
  listaHistorial: any[] = [];
  estadoContrato:any[] = [];
  usuario: Usuario | null;
  urlImagen: string;
  montoPagadoTotal: number = 0;
  montoProgramadoTotal: number = 0;
  porcentajePagado: number = 0;
  cuotasPagadas: number = 0;
  totalCuotas: number = 0;
  urlPrincipal : string;
  urlSecundario : string;
  estado : string;
  urlContrato : string;
  maxOrder: number = 0;

  constructor(
    private usuarioService: UsuarioService,
    private service: ApiserviceService,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private datePipe: DatePipe
  ) {}

  async obtenerEstado(numContrato: string) {
    console.log("numContrato estado", numContrato);
    const cacheService = new CacheService<any>('estado');
    this.estadoContrato = cacheService.getCache() || [];
  
    if (this.estadoContrato == null || this.estadoContrato.length == 0 || this.estadoContrato == undefined) {
      const params = {
        numero_contrato: numContrato
      };
  
      await this.service.obtenerEstado(params).subscribe((response: any) => {
        if (!response.isError) {
          // Verificar si response.objetoResultado es un arreglo y tiene al menos un elemento
          if (Array.isArray(response.listaResultado) && response.listaResultado.length > 0) {
            this.estadoContrato = response.listaResultado;
            const cacheService = new CacheService<any>('estado');
            cacheService.setCache(this.estadoContrato);
            this.calculateMaxOrder();
          } else {
            // En caso de que objetoResultado no sea un arreglo o esté vacío, manejarlo según tu lógica
            this.estadoContrato = []; // o algún valor por defecto
            console.error('objetoResultado no es un arreglo o está vacío.');
          }
        } else {
          this.openModalError(response.mensajeError);
        }
      });
    }else{
      //hacer cosas con la lista de esta de cache
      this.calculateMaxOrder();
    }
  }

  calculateMaxOrder() {
    // Encuentra el valor máximo de `orden` en `estadoContrato`
    this.maxOrder = this.estadoContrato.reduce((max, estado) => {
      return estado.orden > max ? estado.orden : max;
    }, 0);
  }

  estadosFases = [
    { estado: 'Contrato Firmado', orden: 1 },
    { estado: 'Pago completado', orden: 2 },
    { estado: 'Entrega del inmueble', orden: 3 },
    // Añadir más fases aquí si es necesario
  ];
  
  isCompleted(orden: number): boolean {
    return this.estadoContrato.some(estado => estado.orden === orden);
  }
  
  getIconPath(stepNumber: number): string {
    return `../../../../../assets/${stepNumber}.svg`;
  }


  async obtenerProyectoUrl(contrato: string) {
    var params = {
      codigo: contrato,
    };
    this.service.obtenerProyectoUrl(params).subscribe((response: any) => {
      if (!response.isError) {
        const listaUrl = response.listaResultado;
        // Buscar la URL de tipo "Principal"
        const principal = listaUrl.find((item: any) => item.tipo === 'Principal');
        if (principal) {
          this.urlPrincipal = principal.url;
        }
        // Buscar la URL de tipo "Secundario"
        const secundario = listaUrl.find((item: any) => item.tipo === 'Secundario');
        if (secundario) {
          this.urlSecundario = secundario.url;
        }
        // Manejo de errores si no se encuentran las URLs
        if (!principal && !secundario) {
          this.openModalError('No se encontraron URLs de tipo Principal o Secundario');
        }
      } else {
        this.openModalError(response.mensajeError);
      }
    });
  }

  getTotalPages() {
    return Math.ceil(this.listaHistorial.length / this.itemsPerPage);
  }

  async obtenerImagenLote() {
    var params = {
      idUnidad: this.contratoSeleccionado?.id_unidad
    };
    await this.service.obtenerImagenLote(params).subscribe((response: any) => {
      if (!response.isError) {
        this.urlImagen = response.listaResultado[0].path_url;
        this.openModalImagen();
      }else {
        this.openModalError(response.mensajeError);
      }
    });
  }

  async obtenerUrlContrato() {
    var params = {
      codigo: this.contratoSeleccionado?.numero_contrato+'.pdf'
    };
    await this.service.obtenerPdfContrato(params).subscribe((response: any) => {
      if (!response.isError) {
        this.urlContrato = response.objetoResultado;
        window.open(this.urlContrato, '_blank');
      }else {
        this.openModalError(response.mensajeError);
      }
    });
  }

  openModalImagen() {
    var urlImagen = this.urlImagen;
    const dialogRef = this.dialog.open(ModalOpenImageComponent, {
      width: '500px',
      // height:'500px',
      data: { documentoUrl: urlImagen },
    });
    dialogRef.afterClosed().subscribe((result) => {});
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
    const totalPages = Math.ceil(
      this.listaHistorial.length / this.itemsPerPage
    );
    if (this.currentPage < totalPages) {
      this.currentPage++;
    }
  }

  async ngOnInit(){
    this.usuario = this.usuarioService.getUsuario();
    this.recuperarParametros();
    this.obtenerProyectoUrl(this.contratoSeleccionado?.codigo_proyecto);
    await this.obtenerEstado(this.contratoSeleccionado.numero_contrato);
  }

  calcularValores() {
    this.totalCuotas = this.listaHistorial.length;
    this.listaHistorial.forEach((historial) => {
      const montoPagado = parseFloat(historial.monto_pagado);
      const saldo = parseFloat(historial.monto_programado); //monto programado
      this.montoPagadoTotal += montoPagado;
      this.montoProgramadoTotal += saldo;
      if (historial.estado === 'pagado') {
        this.cuotasPagadas++;
      }
    });
    if (this.montoProgramadoTotal > 0) {
      this.porcentajePagado =
        (this.montoPagadoTotal * 100) / this.montoProgramadoTotal;
    } else {
      this.porcentajePagado = 0;
    }
  }

  get tieneDeudas(): boolean {
    return this.cuotasPagadas < this.totalCuotas;
  }

  cerrarSesion() {
    this.goLogin();
  }

  transform(value: any): any {
    if (value) {
      const dateParts = value.split('-');
      return `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
    }
    return '-';
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
    if (date) {
      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      };
      return new Date(date).toLocaleDateString('es-ES', options);
    }
    return '-';
  }

  formatDateTemp(date: any): string {
    if (date) {
      const formattedDate = this.datePipe.transform(date, 'dd/MM/yyyy');
      return formattedDate ? formattedDate : '-';
    }
    return '-';
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
}
