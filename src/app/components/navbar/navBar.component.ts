import { Component } from "@angular/core";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { Observable } from "rxjs";

import { AuthService } from "src/app/service/auth.service";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"],
})
export class NavbarComponent {
  notLoggedIn: Boolean = false;

  constructor(private authService: AuthService) {
    if (!this.authService.isAuthenticated()) {
      this.notLoggedIn = false;
    } else {
      this.notLoggedIn = true;
    }
  }

  onLogout() {
    console.log("logout");
    this.authService.logout();
  }
}
