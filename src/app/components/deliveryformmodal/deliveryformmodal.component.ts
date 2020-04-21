import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from "@angular/material";
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";

import { ServerService } from "src/app/service/server.service";

@Component({
  selector: "app-deliveryformmodal",
  templateUrl: "./deliveryformmodal.component.html",
  styleUrls: ["./deliveryformmodal.component.css"],
})
export class DeliveryformmodalComponent implements OnInit {
  deliveryForm: FormGroup;
  loading: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<DeliveryformmodalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private server: ServerService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    console.log(this.data);
    this.deliveryForm = this.fb.group({
      _id: this.data._id,
      deliveryCustomer: this.data.deliveryCustomer,
      tonnes: this.data.tonnes,
      freightCompany: this.data.freightCompany,
      orderNumber: this.data.orderNumber,
      notes: this.data.notes,
      emailSentToCarrier: this.data.emailSentToCarrier,
      cbhOuttunrNumber: this.data.cbhOuttunrNumber,
      purchaseNumber: this.data.purchaseNumber,
      settled: this.data.settled,
      dailyDelivery: this.data.dailyDelivery,
    });
  }

  onSubmit() {
    const data = this.deliveryForm.value;
    const id = this.deliveryForm.value._id;
    this.loading = true;
    this.server.request("PUT", `/api/v1/deliveries/${id}`, data).subscribe(
      (res) => {
        this.loading = false;
        this.snackBar.open("Data has been updated", "Close", {
          duration: 3000,
        });
        this.dialogRef.close(data);
      },
      (err) => {
        this.snackBar.open(err.error.error, "Close", {
          duration: 3000,
        });
      }
    );
  }
}
