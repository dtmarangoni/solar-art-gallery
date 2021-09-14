import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { DelConfirmModalComponent } from '../../components/del-confirm-modal/del-confirm-modal.component';
import { AddModalComponent } from '../../components/add-modal/add-modal.component';
import { EditModalComponent } from '../../components/edit-modal/edit-modal.component';
import { LoadingSpinnerComponent } from '../../components/loading-spinner/loading-spinner.component';
import { ErrorModalComponent } from '../../components/error-modal/error-modal.component';
import { MaterialDesignBootstrapModule } from '../material-design-bootstrap/material-design-bootstrap.module';

@NgModule({
  declarations: [
    DelConfirmModalComponent,
    AddModalComponent,
    EditModalComponent,
    LoadingSpinnerComponent,
    ErrorModalComponent,
  ],
  imports: [CommonModule, ReactiveFormsModule, MaterialDesignBootstrapModule],
  exports: [
    ReactiveFormsModule,
    MaterialDesignBootstrapModule,
    DelConfirmModalComponent,
    AddModalComponent,
    EditModalComponent,
    LoadingSpinnerComponent,
    ErrorModalComponent,
  ],
})
export class ComponentsModule {}
