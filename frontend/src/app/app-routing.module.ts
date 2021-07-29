import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';

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
    path: 'portfolio/albums',
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
