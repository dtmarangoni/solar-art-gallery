import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlbumRoutingModule } from './album-routing.module';
import { AlbumComponent } from './album.component';
import { ArtsSidebarComponent } from '../../components/arts-sidebar/arts-sidebar.component';
import { ArtsCarouselComponent } from '../../components/arts-carousel/arts-carousel.component';
import { ComponentsModule } from '../../shared/components/components.module';

@NgModule({
  declarations: [AlbumComponent, ArtsSidebarComponent, ArtsCarouselComponent],
  imports: [CommonModule, AlbumRoutingModule, ComponentsModule],
})
export class AlbumModule {}
