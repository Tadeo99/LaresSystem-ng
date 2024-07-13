import { Component, OnInit, Input } from '@angular/core';
import { UsuarioService } from 'src/shared/usuarioService';
import { Usuario } from 'src/shared/models/common/clases/usuario';

interface AccordionItem {
  id: string;
  title: string;
  content: string;
}

@Component({
  selector: 'app-preguntas-frecuentes',
  templateUrl: './preguntas.component.html',
  styleUrls: ['./preguntas.component.css'],
})
export class PreguntasFrecuentesComponent implements OnInit {
  @Input() contratoSeleccionado: any;
  datos: any;
  usuario: Usuario | null;
  tipoDocumento: any;
  numDocumento: any;
  showAll: boolean = false;
  accordionItems: AccordionItem[] = [
    { id: 'collapseSeis', title: '¿Dónde debo pagar mi cuota mensual?', content: 'Lares enviará un aviso preventivo al cliente, indicándole en que entidad bancaria deberá realizar el abono correspondiente. En caso no reciba el aviso preventivo, el cliente deberá comunicarse a la central telefónica de Lares, a fin de que se le brinde dicha información.' },
    { id: 'collapseSiete', title: '¿Cuánto es la mora diaria por cada día de retraso? ¿A base de qué se calcula?', content: 'El interés moratorio diario se calculará en base al monto de la letra, según las consideraciones que constan en el Contrato/Compromiso.' },
    { id: 'collapseOcho', title: 'Si quiero utilizar el libro de reclamaciones, ¿dónde lo hago?', content: 'Contamos con un libro de reclamaciones en cada oficina de ventas de nuestros proyectos, así como en las oficinas centrales de Lares, el cual se encuentra al alcance de cualquier cliente que lo solicite, de ser el caso. No obstante, usted puede presentar su reclamo a través de nuestra web.' },
    { id: 'collapseNueve', title: '¿Cuáles son los requisitos para realizar una cesión?', content: 'Contenido de la cuarta pregunta' },
    { id: 'collapseOnce', title: '¿A partir de cuándo puedo firmar la Minuta de Compraventa? ¿Cuáles son los requisitos?', content: 'Una vez que se culmine con el abono de todas las sumas adeudadas por el cliente, y hayan sido culminadas las obras y/o las gestiones municipales y registrales que según su contrato correspondan, Lares podrá emitir la correspondiente minuta de compraventa y lo citará para su firma. Es requisito que al momento de la firma presente copia de su DNI.' },
    { id: 'collapseDoce', title: 'Soy peruano, vivo en el extranjero, y deseo realizar la firma de mi contrato/compromiso mediante un representante, ¿qué debo presentar?', content: 'El representante deberá presentar un poder específico que lo faculte expresamente a suscribir contratos/compromisos de compraventa de bienes inmueble y letras de cambio en caso de adquirir con financiamiento directo. Dicho poder deberá estar validado por el consulado correspondiente e inscrito en Registros Públicos.' },
    { id: 'collapseTrece', title: 'Soy extranjero, vivo en el Perú y deseo realizar la firma de mi contrato/compromiso, ¿qué debo presentar?', content: 'En caso de ser extranjero, para poder suscribir un contrato/compromiso, deberá presentar su carnet de extranjería vigente. En caso de no contar con carnet de extranjería, deberá realizar el pago de "Permiso para firmar contratos" otorgado por migraciones y presentar el comprobante vigente correspondiente.' },
    { id: 'collapseCatorce', title: 'Cuando me entreguen mi lote, ¿los servicios básicos ya se encontrarán habilitados?', content: 'Los inmuebles se entregarán con la dotación de servicios conforme se haya acordado en cada contrato. El Cliente tramitará su suministro -que incluirá la instalación de los contómetros respectivos- con la Junta/Asociación de Propietarios o con Lares, de acuerdo a como corresponda. Es probable que al momento de la entrega del inmueble las Empresas Prestadoras de Servicios (EPS) no se encuentren operando en la zona del proyecto, por lo que en dicho caso Lares y/o la Junta/Asociación de Propietarios administrará las soluciones propias instaladas para la dotación de los mismos.' },
    { id: 'collapseQuince', title: 'Se me perdió mi contrato y deseo una copia, ¿qué debo hacer?', content: 'En caso de pérdida del contrato/compromiso, usted podrá obtener una copia simple escaneada de su contrato a través de la pestaña Mis Trámites. En caso el cliente tuviera interés en una copia legalizada del contrato, deberá coordinar directamente con el equipo postventa de LARES para gestionarlo, asumiendo previamente los costos relacionados a la legalización y remisión de documentos. Asimismo, el cliente deberá realizar una denuncia policial que acredite la pérdida del contrato para su seguridad. ' },
    { id: 'collapseDiezSeis', title: 'Ya estoy próximo a cancelar el total de mi lote, ¿Ustedes me entregan mi título de propiedad?', content: 'El título de propiedad es el documento con el cual nuestros clientes pueden demostrar ser propietarios de su respectivo inmueble. Para ello aplican los contratos de compraventa, la minuta de compraventa y/o la escritura pública que contenga la mencionada minuta, de acuerdo a cada proyecto y status del mismo. Sin perjuicio de ello, es obligación del cliente suscribir el documento que acredita el título de propiedad y que genera Lares, conforme lo indique el contrato.' },
    { id: 'collapseDiezSiete', title: '¿Puedo tener acceso a mi estado de cuenta?', content: 'El cliente puede descargar en cualquier momento su estado de cuenta, en la plataforma web, a la cual accederá a través de su cuenta y clave respectiva. Eventualmente el estado de cuentas podría no recoger la información de los pagos más recientes.' },
    { id: 'collapseDiezNueve', title: '¿Quién se encarga del mantenimiento de las áreas públicas de mi urbanización?', content: 'Lares se hará cargo del mantenimiento de las zonas comunes de las etapas que aún no han sido entregadas a la Municipalidad correspondiente. No obstante, desde la entrega de los terrenos en nuestros condominios, el cliente deberá pagar el costo del mantenimiento que la administración del condominio determine en función a los servicios prestados.' },
    { id: 'collapseVeinte', title: '¿Qué implica que me hayan notificado con una carta de resolución del contrato?', content: 'Lares enviará por vía notarial, la carta de resolución de contrato al domicilio contractual del cliente, solo en caso que el cliente incumpla con las obligaciones de pago pactadas en su contrato y/o compromiso. En tal sentido, con la recepción de dicha carta notarial el contrato/compromiso quedará resuelto automáticamente y de pleno derecho, siendo aplicable ' },
  ];
  visibleAccordionItems: AccordionItem[];

  constructor(private usuarioService: UsuarioService) {
    this.visibleAccordionItems = this.accordionItems.slice(0, 5);
  }

  ngOnInit(): void {
    this.usuario = this.usuarioService.getUsuario();
    this.recuperarParametros();
  }

  recuperarParametros() {
    this.tipoDocumento = this.usuario?.tipoDocumento;
    this.numDocumento = this.usuario?.documentoCliente;
  }

  toggleAccordion(id: string) {
    const element = document.getElementById(id);
    if (element) {
      element.classList.toggle('show');
    }
  }

  toggleShowAll() {
    this.showAll = !this.showAll;
    if (this.showAll) {
      this.visibleAccordionItems = this.accordionItems;
    } else {
      this.visibleAccordionItems = this.accordionItems.slice(0, 5);
    }
  }
}
