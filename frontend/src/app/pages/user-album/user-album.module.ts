import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { UserAlbumRoutingModule } from './user-album-routing.module';
import { UserAlbumComponent } from './user-album.component';
import { UserArtsComponent } from '../../components/user-arts/user-arts.component';
import { MaterialDesignBootstrapModule } from '../../shared/material-design-bootstrap/material-design-bootstrap.module';

@NgModule({
  declarations: [UserAlbumComponent, UserArtsComponent],
  imports: [
    CommonModule,
    UserAlbumRoutingModule,
    ReactiveFormsModule,
    MaterialDesignBootstrapModule,
  ],
})
export class UserAlbumModule {}
