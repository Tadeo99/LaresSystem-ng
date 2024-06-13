export class Contrato {
    numero_contrato: string;
    documento_cliente: string;
    tipo_documento: string;
    nombre_proyecto: string;
    nombre: string;
    cliente: string;
    manzana: string;
    lote: string;
    telefono: string;
    celulares: string;
  
    constructor(
      numeroContrato: string,
      documentoCliente: string,
      tipoDocumento: string,
      nombre_proyecto: string,
      nombre: string,
      cliente: string,
      manzana: string,
      lote: string,
      telefono: string,
      celulares: string
    ) {
      this.numero_contrato = numeroContrato;
      this.documento_cliente = documentoCliente;
      this.tipo_documento = tipoDocumento;
      this.nombre_proyecto = nombre_proyecto;
      this.nombre = nombre;
      this.cliente = cliente;
      this.manzana = manzana;
      this.lote = lote;
      this.telefono = telefono;
      this.celulares = celulares;
    }
  }