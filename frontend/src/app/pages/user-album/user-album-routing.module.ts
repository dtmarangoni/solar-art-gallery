import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserAlbumComponent } from './user-album.component';

const routes: Routes = [{ path: '', component: UserAlbumComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserAlbumRoutingModule {}
