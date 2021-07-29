import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { AlbumsGridComponent } from '../../components/albums-grid/albums-grid.component';
import { MaterialDesignBootstrapModule } from '../../shared/material-design-bootstrap/material-design-bootstrap.module';

@NgModule({
  declarations: [HomeComponent, AlbumsGridComponent],
  imports: [CommonModule, HomeRoutingModule, MaterialDesignBootstrapModule],
})
export class HomeModule {}
