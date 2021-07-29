import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserPortfolioRoutingModule } from './user-portfolio-routing.module';
import { UserPortfolioComponent } from './user-portfolio.component';
import { UserAlbumsComponent } from '../../components/user-albums/user-albums.component';
import { MaterialDesignBootstrapModule } from '../../shared/material-design-bootstrap/material-design-bootstrap.module';

@NgModule({
  declarations: [UserPortfolioComponent, UserAlbumsComponent],
  imports: [
    CommonModule,
    UserPortfolioRoutingModule,
    MaterialDesignBootstrapModule,
  ],
})
export class UserPortfolioModule {}
