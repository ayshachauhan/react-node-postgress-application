export interface InsuranceTypeResponse {
  id: string;
  practiceId: string;
  name: string;
}

export interface CreateInsuranceTypeInterface {
  practiceId: string;
  name: string;
}
