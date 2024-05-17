export interface CreateEvalInterface {
  practiceId: string;
  surgeryConfigurationId: string;
  practiceHomeId: string;
  insuranceTypeId?: string;
  insuranceDetails?: string;
  date: Date;
  mrn: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  pcp?: string;
  referrerId?: string;
  details?: string;
  status: string;
  bodyPart: string;
  doctorId: string;
}

export interface EvalResponse {
  id: string;
  practiceId: string;
  surgeryTypeId: string;
  practiceHomeId: string;
  insuranceTypeId?: string;
  insuranceDetails?: string;
  date: Date;
  mrn: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  pcp?: string;
  referrerId?: string;
}
