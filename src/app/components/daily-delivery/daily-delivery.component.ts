import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ServerService } from "src/app/service/server.service";
import { WeeklyBookings } from "../../models/WeeklyBookings";
import { DailyDeliveries } from "../../models/DailyDeliveries";
import { MatSnackBar } from "@angular/material";
import { Deliveries } from "src/app/models/Deliveries";
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";

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

  formDay: FormGroup;

  constructor(
    private activeRoute: ActivatedRoute,
    private server: ServerService,
    private snackBar: MatSnackBar,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.formDay = this.fb.group({
      dayOfWeek: ["", Validators.required],
      tonnes: ["", Validators.required],
      note: [""],
    });

    this.activeRoute.params.subscribe((params) => (this.id = params.id));

    this.weeklyDataOnLoad();
  }

  getDelivery(data) {
    const id = data._id;
    this.showTable = false;
    console.log(data);
    this.server
      .request("GET", `/api/v1/dailydeliveryrequest/${data._id}/deliveries`)
      .subscribe(
        (res: any) => {
          this.deliveries = res.data;
          console.log(res.data);
          this.showTable = true;
        },
        (err) => {
          console.log(err);
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
    const iCData = this.formDay.value;
    const data = {
      dayOfWeek: iCData.dayOfWeek,
      plannedTonnes: iCData.tonnes,
      note: iCData.note,
      weeklyRequests: this.id,
    };
    const _id = this.id;
    //const submitData = data.push(this.id);

    this.server
      .request(
        "POST",
        `/api/v1/WeeklyBookingRequest/${_id}/dailyDeliveryRequest`,
        data
      )
      .subscribe(
        (res: any) => {
          this.weeklyDataOnLoad();
          this.showDayForm();
        },
        (err) => {
          console.log(err);
          this.snackBar.open(err.error.error, "Close", { duration: 3000 });
        }
      );
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
    console.log("working....");
    this.server.request("GET", "/api/v1/customers").subscribe((res: any) => {
      this.formCustomerList = res;
      console.log(this.formCustomerList);
    });
  }
}
