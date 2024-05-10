export interface SurgeryResponse {
  id: string;
  practiceId: string;
  surgeryTypeId: string;
  practiceHomeId: string;
  insuranceTypeId?: string;
  insuranceDetails?: string;
  date: Date;
  mrn: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  pcp?: string;
  referrer?: string;
  lensType: string;
}
