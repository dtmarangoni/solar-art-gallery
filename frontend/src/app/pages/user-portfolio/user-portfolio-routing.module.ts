import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserPortfolioComponent } from './user-portfolio.component';

const routes: Routes = [{ path: '', component: UserPortfolioComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserPortfolioRoutingModule {}
