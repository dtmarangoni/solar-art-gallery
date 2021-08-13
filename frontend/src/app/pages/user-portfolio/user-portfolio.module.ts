import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { UserPortfolioRoutingModule } from './user-portfolio-routing.module';
import { UserPortfolioComponent } from './user-portfolio.component';
import { UserAlbumsComponent } from '../../components/user-albums/user-albums.component';
import { ConfirmModalComponent } from '../../components/confirm-modal/confirm-modal.component';
import { AddModalComponent } from '../../components/add-modal/add-modal.component';
import { EditModalComponent } from '../../components/edit-modal/edit-modal.component';
import { MaterialDesignBootstrapModule } from '../../shared/material-design-bootstrap/material-design-bootstrap.module';

@NgModule({
  declarations: [
    UserPortfolioComponent,
    UserAlbumsComponent,
    ConfirmModalComponent,
    AddModalComponent,
    EditModalComponent,
  ],
  imports: [
    CommonModule,
    UserPortfolioRoutingModule,
    ReactiveFormsModule,
    MaterialDesignBootstrapModule,
  ],
})
export class UserPortfolioModule {}
