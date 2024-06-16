import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'modal-show-boleta',
  templateUrl: './modal-show-boleta.component.html',
  styleUrls: ['./modal-show-boleta.component.scss'],
})
export class ModalShowBoletaComponent {
  linkPdf: SafeResourceUrl | undefined;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private modalRef: MatDialogRef<ModalShowBoletaComponent>,
    private sanitizer: DomSanitizer
  ) {
    this.linkPdf = this.data.linkPdf ? this.sanitizer.bypassSecurityTrustResourceUrl(this.data.linkPdf) : undefined;
  }

  ngOnInit() {
    //this.linkPdf = this.data.linkPdf ? this.sanitizer.bypassSecurityTrustResourceUrl(this.data.linkPdf) : undefined;
  }

  redirect(): void {
    this.modalRef.close();
  }
}
