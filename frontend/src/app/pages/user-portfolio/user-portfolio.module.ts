import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserPortfolioRoutingModule } from './user-portfolio-routing.module';
import { UserPortfolioComponent } from './user-portfolio.component';
import { UserAlbumsComponent } from '../../components/user-albums/user-albums.component';
import { ComponentsModule } from '../../shared/components/components.module';

@NgModule({
  declarations: [UserPortfolioComponent, UserAlbumsComponent],
  imports: [CommonModule, UserPortfolioRoutingModule, ComponentsModule],
})
export class UserPortfolioModule {}
