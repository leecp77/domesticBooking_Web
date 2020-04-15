export interface WeeklyBookings {
  _id: string;
  domesticCustomer: string;
  saleContractNo: number;
  grade: string;
  tonnesRequired: number;
  weekCommencing: Date;
  emailSent: boolean;
  reference: string;
  user: string;
  settled: boolean;
}
