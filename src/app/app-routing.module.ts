import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomepageComponent } from "./components/homepage/homepage.component";
import { LoginComponent } from "./components/login/login.component";
import { CompanydetailsComponent } from "./components/companydetails/companydetails.component";
import { AuthGuardService as AuthGuard } from "./service/auth-guard.service";
import { DailyDeliveryComponent } from "./components/daily-delivery/daily-delivery.component";

//canActivate: [AuthGuard]
const routes: Routes = [
  { path: "", component: HomepageComponent, canActivate: [AuthGuard] },
  { path: "login", component: LoginComponent },
  {
    path: "weeklybooking/:slug/dailydeliver/:id",
    component: DailyDeliveryComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  exports: [RouterModule],

  imports: [RouterModule.forRoot(routes)],
  declarations: [],
})
export class AppRoutingModule {}
