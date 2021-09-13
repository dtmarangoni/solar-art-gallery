import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserAlbumRoutingModule } from './user-album-routing.module';
import { UserAlbumComponent } from './user-album.component';
import { UserArtsComponent } from '../../components/user-arts/user-arts.component';
import { ComponentsModule } from '../../shared/components/components.module';

@NgModule({
  declarations: [UserAlbumComponent, UserArtsComponent],
  imports: [CommonModule, UserAlbumRoutingModule, ComponentsModule],
})
export class UserAlbumModule {}
