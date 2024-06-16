import { Component, Inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommunserviceService } from 'src/shared/comun.service';
import { AlertComponent } from 'src/shared/components/alert/alert.component';
import { MatDialog } from '@angular/material/dialog';
import { ModalShowBoletaComponent } from './successful-message/modal-show-boleta.component';
@Component({
  selector: 'modal-boleta',
  templateUrl: './modal-boleta.component.html',
  styleUrls: ['./modal-boleta.component.scss']
})
export class ModalBoletaComponent implements OnInit {
  numero_contrato: string;
  nombre_pago: string;
  listaOperaciones: any[] = [];
  listaComprobante : any[] = [];
  comprobante : any;
  private: string;
  mostrarTabla : boolean = false;
  displayedColumns: string[] = ['nro', 'numero_operacion', 'detalles'];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private modalRef: MatDialogRef<ModalBoletaComponent>,
    private dialog: MatDialog,
    private service: CommunserviceService,
    private cdr: ChangeDetectorRef
  ) {
    this.numero_contrato = data.numContrato;
    this.nombre_pago = data.nombre_pago;
  }

  ngOnInit() {
    setTimeout(() => {
      this.obtenerOperaciones();
    });
  }

  async obtenerOperaciones() {
    try {
      const params = {
        numero_contrato: this.numero_contrato,
        nombre_pago: this.nombre_pago
      };
      const response: any = await this.service.getObtenerNumOperaciones(params).toPromise();
      if (!response.isError) {
        this.listaOperaciones = response.listaResultado;
        this.mostrarTabla = true;
        // Forzar la detección de cambios después de actualizar listaOperaciones
        this.cdr.detectChanges();
      } else {
        this.openModalError(response.mensajeError);
      }
    } catch (error) {
      console.error('Error al obtener operaciones:', error);
      this.openModalError('Error al obtener operaciones');
    }
  }

  async obtenerComprobante(numOperacion : string) {
    try {
      const params = {
        numero_contrato: this.numero_contrato,
        nombre_pago: this.nombre_pago,
        ListNumOp: [
          {
            num_operacion: numOperacion
          }
        ]
      };
      const response: any = await this.service.obtenerComprobante(params).toPromise();
      if (response.status === "OK") {
        this.listaComprobante = response.Body.jsonRI;
        if (this.listaComprobante.length > 0) {
          this.comprobante = this.listaComprobante[0];
          //this.openModalBoletaPdf(this.comprobante.pdf_link_fe);
          console.log('URL del PDF:', this.comprobante.pdf_link_fe);
          window.open(this.comprobante.pdf_link_fe, '_blank');
        }else{
          this.openModalError("No existe documento");
        }
      } else {
        this.openModalError(response.mensajeError);
      }
    } catch (error) {
      console.error('Error al obtener operaciones:', error);
      this.openModalError('Error al obtener operaciones');
    }
  }

  verDetalle(element: any) {
    this.obtenerComprobante(element.numero_operacion);
  }

  openModalBoletaPdf(linkPdf : string) {
    const dialogRef = this.dialog.open(ModalShowBoletaComponent, {
      width: '500px',  data: { linkPdf : "https://www.nubefact.com/cpe/b48fec58-7d9a-4b57-9c3a-2e5a038bff40.pdf"}
    });
    dialogRef.afterClosed().subscribe(result => {
      
    });
  }

  redirect() {
    this.modalRef.close();
  }

  openModalError(message: string) {
    const alert = { title: 'Alerta', message: message };
    const dialogRef = this.dialog.open(AlertComponent, {
      width: '400px',
      data: { alert: alert }
    });
    dialogRef.afterClosed().subscribe(result => {});
  }
}
