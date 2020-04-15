import { Component, OnInit } from "@angular/core";
import { CompanyDetails } from "../../models/CompanyDetails";
import { ActivatedRoute } from "../../../../node_modules/@angular/router";

@Component({
  selector: "app-companydetails",
  templateUrl: "./companydetails.component.html",
  styleUrls: ["./companydetails.component.css"],
})
export class CompanydetailsComponent implements OnInit {
  companyDetail: CompanyDetails;
  companyId: any;

  constructor() {}

  ngOnInit() {}
}
