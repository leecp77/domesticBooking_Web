import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { ServerService } from "./server.service";
import { MatSnackBar } from "@angular/material";
import { JwtHelperService } from "@auth0/angular-jwt";
import { CookieService } from "ngx-cookie-service";

const jwtHelper = new JwtHelperService();

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  private token: string;

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  constructor(
    private router: Router,
    private server: ServerService,
    private snackBar: MatSnackBar,
    public jwtHelper: JwtHelperService,
    public cookieService: CookieService
  ) {
    console.log("Auth Service");
    const userData = this.cookieService.get("token");

    if (userData) {
      console.log("Logged in from memory");
      this.token = userData;
      this.server.setLoggedIn(true, this.token);
      this.loggedIn.next(true);
    }
  }

  public isAuthenticated(): boolean {
    const token = this.cookieService.get("token");
    return !this.jwtHelper.isTokenExpired(token);
  }

  login(user) {
    if (user.email !== "" && user.password !== "") {
      return this.server
        .request("POST", "/api/v1/auth/login", {
          email: user.email,
          password: user.password,
        })
        .subscribe((response: any) => {
          if (response.success === true && response.token !== undefined) {
            this.token = response.token;
            this.server.setLoggedIn(true, this.token);
            this.loggedIn.next(true);
            const userData = {
              token: this.token,
            };
            this.cookieService.set("token", this.token, 0.5);
            //localStorage.setItem("token", JSON.stringify(userData));
            this.router.navigateByUrl("/");
            this.snackBar.open("Successfully Logged In", "Close", {
              duration: 2000,
            });
          }
        });
    }
  }

  logout() {
    this.server.setLoggedIn(false);
    //delete this.token;
    this.cookieService.deleteAll();

    this.loggedIn.next(false);
    //localStorage.clear();
    this.router.navigate(["/login"]);
  }
}
