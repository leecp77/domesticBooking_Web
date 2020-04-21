import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ServerService } from "src/app/service/server.service";
import { WeeklyBookings } from "../../models/WeeklyBookings";
import { DailyDeliveries } from "../../models/DailyDeliveries";
import { MatSnackBar, MatDialog } from "@angular/material";
import { Deliveries } from "src/app/models/Deliveries";
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { ModalalertComponent } from "../modalalert/modalalert.component";
import { DeliveryformmodalComponent } from "../deliveryformmodal/deliveryformmodal.component";

@Component({
  selector: "app-daily-delivery",
  templateUrl: "./daily-delivery.component.html",
  styleUrls: ["./daily-delivery.component.css"],
})
export class DailyDeliveryComponent implements OnInit {
  id: string;
  weeklyBookings: WeeklyBookings[];
  customer: string;
  saleContractNo: string;
  plannedTonnes: number;
  dailyDeliveries: DailyDeliveries;
  grade: string;
  tonnesRequired: number;
  weekCommencing: Date;
  reference: string;
  createdAt: string;
  deliveries: Deliveries;
  showTable: boolean = true;
  newDayForm: boolean;
  formCustomerList: any;
  editButton: boolean = false;
  dailyRequestId: string;
  formDay: FormGroup;
  deliveryForm: FormGroup;
  dailydeliveryrequest: string;

  constructor(
    private activeRoute: ActivatedRoute,
    private server: ServerService,
    private snackBar: MatSnackBar,
    private router: Router,
    private fb: FormBuilder,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.formDay = this.fb.group({
      dayOfWeek: ["", Validators.required],
      plannedTonnes: ["", Validators.required],
      note: [""],
    });

    this.activeRoute.params.subscribe((params) => (this.id = params.id));

    this.weeklyDataOnLoad();
  }

  getDelivery(data) {
    this.server
      .request("GET", `/api/v1/dailydeliveryrequest/${data}/deliveries`)
      .subscribe(
        (res: any) => {
          this.deliveries = res.data;
          this.showTable = true;
        },
        (err) => {
          const errorMsg = err.statusText;
          this.snackBar.open(`The Request URL was ${errorMsg}`, "close", {
            duration: 2000,
          });

          if (err.status === 401) {
            //this.router.navigate(["/login"]);
          }
        }
      );
  }

  showDayForm() {
    if (!this.newDayForm) {
      this.newDayForm = true;
    } else {
      this.newDayForm = false;
    }
  }

  saveDayData() {
    this.editButton = false;
    const iCData = this.formDay.value;
    const data = {
      dayOfWeek: iCData.dayOfWeek,
      plannedTonnes: iCData.plannedTonnes,
      note: iCData.note,
      weeklyRequests: this.id,
    };
    const _id = this.id;
    this.showDayForm();
    const buttonId = document.getElementById("edit");
    if (!buttonId) {
      this.server
        .request(
          "POST",
          `/api/v1/WeeklyBookingRequest/${_id}/dailyDeliveryRequest`,
          data
        )
        .subscribe(
          (res: any) => {
            this.snackBar.open(
              "Data have been updated. Refreshing data....",
              "Close",
              {
                duration: 3000,
              }
            );
            this.formDay.reset();
            this.weeklyDataOnLoad();
          },
          (err) => {
            this.snackBar.open(err.error.error, "Close", { duration: 3000 });
          }
        );
    } else {
      this.dailyDeliveries = undefined;
      this.editButton = false;
      this.server
        .request(
          "PUT",
          `/api/v1/dailydeliveryrequest/${this.dailyRequestId}`,
          data
        )
        .subscribe(
          (res: any) => {
            this.formDay.reset();

            this.weeklyDataOnLoad();

            this.snackBar.open(
              "Data have been updated. Refreshing data....",
              "Close",
              {
                duration: 3000,
              }
            );
          },
          (err) => {
            this.snackBar.open(err.error.error, "Close", { duration: 3000 });
          }
        );
    }
  }

  weeklyDataOnLoad() {
    this.server
      .request("GET", `/api/v1/WeeklyBookingRequest/${this.id}`)
      .subscribe(
        (res: any) => {
          this.dailyDeliveries = res.data.dailyRequest;
          this.customer = res.data.domesticCustomer;
          this.saleContractNo = res.data.saleContractNo;
          this.plannedTonnes = res.data.plannedTonnes;
          this.tonnesRequired = res.data.tonnesRequired;
          this.weekCommencing = res.data.weekCommencing;
          this.grade = res.data.grade;
          this.reference = res.data.reference;
          this.createdAt = res.data.createdAt;
          // console.log(res);
        },
        (err) => {
          this.router.navigate(["/login"]);
          const errorMsg = err.error.error;
          this.snackBar.open(errorMsg, "close", { duration: 2000 });
        }
      );
  }

  customerList() {
    this.server.request("GET", "/api/v1/customers").subscribe((res: any) => {
      this.formCustomerList = res;
    });
  }

  editDelivery(data) {
    this.editButton = false;
    this.showDayForm();
    this.formDay.setValue({
      dayOfWeek: data.dayOfWeek,
      plannedTonnes: data.plannedTonnes,
      note: data.note,
    });
    this.dailyRequestId = data._id;

    this.editButton = true;
  }

  deleteDelivery(data) {
    const dialogRef = this.dialog.open(ModalalertComponent, { width: "25%" });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === "Delete") {
        this.dailyDeliveries = undefined;
        this.server
          .request("DELETE", `/api/v1/dailydeliveryrequest/${data._id}`)
          .subscribe(
            (res: any) => {
              this.weeklyDataOnLoad();
              this.snackBar.open("Data has been deleted", "Close", {
                duration: 3000,
              });
            },
            (err) => {
              this.snackBar.open(err.error.error, "Close", {
                duration: 3000,
              });
            }
          );
      }
    });
  }

  selectForDeliveryForm(tableData) {
    const dialogRef = this.dialog.open(
      DeliveryformmodalComponent,

      {
        data: tableData,
        width: "40%",
      }
    );

    dialogRef.afterClosed().subscribe((result) => {
      this.dailydeliveryrequest = result.dailyDelivery._id;
      console.log(result.dailyDelivery._id);
      this.getDelivery(this.dailydeliveryrequest);
    });
  }
}
