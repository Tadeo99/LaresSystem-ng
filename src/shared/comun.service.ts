import { Injectable } from '@angular/core';
import { DataService } from '@core/services';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class CommunserviceService {
  // Conectar Frontend con Backend

  constructor(private dataService: DataService) {}

  // iniciar emision
  login(request: any): Observable<any> {
    const pathService = environment.urlService + 'login';
    this.dataService.set(pathService);
    return this.dataService.execPostJson(request);
  }

  getObtenerNumOperaciones(request: any): Observable<any> {
    const pathService = environment.urlService + 'numberOperations';
    this.dataService.set(pathService);
    return this.dataService.execGetJson(request);
  }

  obtenerComprobante(request: any): Observable<any> {
    const pathService = environment.urlServiceDigitechso + 'v1/awpp/portalpropietario/representacionimpresacomprobante';
    this.dataService.set(pathService);
    return this.dataService.execPostJson(request);
  }

}
