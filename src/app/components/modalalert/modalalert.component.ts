import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

@Component({
  selector: "app-modalalert",
  templateUrl: "./modalalert.component.html",
  styleUrls: ["./modalalert.component.css"],
})
export class ModalalertComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<ModalalertComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {}

  onNoClick(): void {
    this.dialogRef.close("Do Not Delete");
  }
  onYesClick(): void {
    this.dialogRef.close("Delete");
  }
}
