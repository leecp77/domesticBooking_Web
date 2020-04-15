import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NavbarComponent } from "./components/navbar/navBar.component";
import { LayoutModule } from "@angular/cdk/layout";
import { CookieService } from "ngx-cookie-service";

import { HomepageComponent } from "./components/homepage/homepage.component";
import { HttpClientModule } from "@angular/common/http";
import { AppRoutingModule } from "./app-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { ServerService } from "./service/server.service";
import { AppMaterialModule } from "./app-material.module";
import { CompanydetailsComponent } from "./components/companydetails/companydetails.component";
import { LoginComponent } from "./components/login/login.component";
import { JwtHelperService, JWT_OPTIONS } from "@auth0/angular-jwt";
import { AuthGuardService } from "./service/auth-guard.service";
import { DailyDeliveryComponent } from "./components/daily-delivery/daily-delivery.component";

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomepageComponent,
    CompanydetailsComponent,
    LoginComponent,
    DailyDeliveryComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    LayoutModule,
    AppMaterialModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    ServerService,
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    JwtHelperService,
    AuthGuardService,
    CookieService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
