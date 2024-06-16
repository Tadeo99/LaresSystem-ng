import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modalCloseSource = new Subject<void>();
  modalClose$ = this.modalCloseSource.asObservable();

  modalClosed() {
    this.modalCloseSource.next();
  }
}