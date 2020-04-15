import { Component, OnInit } from "@angular/core";
import { WeeklyBookings } from "../../models/WeeklyBookings";
import {
  MatTableDataSource,
  MatSnackBar,
} from "../../../../node_modules/@angular/material";
import { ServerService } from "src/app/service/server.service";

import { Router } from "@angular/router";

@Component({
  selector: "app-homepage",
  templateUrl: "./homepage.component.html",
  styleUrls: ["./homepage.component.css"],
})
export class HomepageComponent implements OnInit {
  displayedColumns = [
    "weekCommencing",
    "domesticCustomer",
    "saleContractNo",
    "grade",
    "tonnesRequired",
    "plannedTonnes",
    "reference",
    "id",
  ];
  dataSource: MatTableDataSource<WeeklyBookings>;
  weeklyBookings: any;

  constructor(
    private server: ServerService,
    private snackbar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit() {
    const request = this.server
      .request("GET", "/api/v1/WeeklyBookingRequest")
      .subscribe(
        (res: any) => {
          if (res.success === false) {
            this.snackbar.open(res.error, "", {
              duration: 2000,
            });
          } else {
            this.weeklyBookings = res;
            this.dataSource = new MatTableDataSource(this.weeklyBookings.data);
          }
        },
        (err) => {
          const errorMsg = err.error.error;
          this.snackbar.open(errorMsg, "close", { duration: 2000 });

          if (err.status === 401) {
            //this.router.navigate(["/login"]);
          }
        }
      );
  }

  onEdit(booking) {
    const _id = booking._id;
    const url = booking.slug;

    this.router.navigate([`weeklybooking/${url}/dailydeliver/${_id}`]);
  }
}
