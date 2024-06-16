import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ModalBoletaComponent } from './modal-show-boleta/modal-boleta.component';
import { ModalShowBoletaComponent } from './modal-show-boleta/successful-message/modal-show-boleta.component';
import { SafeUrlPipe } from 'src/shared/components/pipes/SafeUrlPipe';
@NgModule({
  declarations: [
    ModalBoletaComponent,ModalShowBoletaComponent, SafeUrlPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    MatIconModule,
    MatDialogModule,
    MatSlideToggleModule
   
  ],
  exports: [
    ModalBoletaComponent,ModalShowBoletaComponent
  ],
  providers: [
  ]
})

export class SharedPages { }
