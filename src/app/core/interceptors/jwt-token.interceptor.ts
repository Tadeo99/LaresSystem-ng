import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';

import { LoaderService } from '@core/services';

import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { environment } from '@environments/environments';

@Injectable()
export class JwtTokenInterceptor implements HttpInterceptor {
  private totalRequests = 0;

  constructor(public loaderService: LoaderService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.totalRequests++;
    this.loaderService.show();
    if (
      request.url.startsWith(environment.urlService) ||
      request.url.startsWith(environment.AngApiPath) ||
      request.url.startsWith(environment.urlServiceSunat)||
      request.url.startsWith(environment.urlSperant)
    ) {
      var access_token = localStorage.getItem('token');
      if (access_token) {
        console.log(access_token);
        if(request.url.startsWith(environment.urlSperant)){
          request = request.clone({
            setHeaders: { Authorization: 'mocpzudRVQ94rJNntDt3X41qdQ2HB61B96mZJTay' },
          });
        }else{
          request = request.clone({
            setHeaders: { Authorization: `Bearer ${access_token}` },
          });
        }
        return next.handle(request).pipe(
          finalize(() => {
            this.totalRequests--;
            if (this.totalRequests === 0) this.loaderService.hide();
          })
        );
      } else {
        return next.handle(request).pipe(
          finalize(() => {
            this.totalRequests--;
            if (this.totalRequests === 0) this.loaderService.hide();
          })
        );
      }
    } else {
      return next.handle(request).pipe(
        finalize(() => {
          this.totalRequests--;
          if (this.totalRequests === 0) this.loaderService.hide();
        })
      );
    }
  }
}
