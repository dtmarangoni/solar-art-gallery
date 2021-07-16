import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { PublicAlbumsComponent } from '../../components/public-albums/public-albums.component';

@NgModule({
  declarations: [HomeComponent, PublicAlbumsComponent],
  imports: [CommonModule, HomeRoutingModule],
})
export class HomeModule {}
