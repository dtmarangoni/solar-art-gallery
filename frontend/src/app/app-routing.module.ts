import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { AuthGuard } from '@auth0/auth0-angular';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import('./pages/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'album/:id',
    loadChildren: () =>
      import('./pages/album/album.module').then((m) => m.AlbumModule),
  },
  {
    path: 'portfolio/albums/:id',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./pages/user-album/user-album.module').then(
        (m) => m.UserAlbumModule
      ),
  },
  {
    path: 'portfolio/albums',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./pages/user-portfolio/user-portfolio.module').then(
        (m) => m.UserPortfolioModule
      ),
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
