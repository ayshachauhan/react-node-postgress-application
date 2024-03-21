export interface User {
  userName: string;
  firstName: string;
  lastName: string;
  fullName: string;
  url: string;
  status: string;
  type: string;
  isSuperAdmin: boolean;
  iat: number;
  exp: number;
  userPractices: UserPractice[];
}

export interface UserPractice {
  id: string;
  dateCreated: string;
  dateUpdated: string;
  practice: Practice;
}

export interface Practice {
  id: string;
  dateCreated: string;
  dateUpdated: string;
  name: string;
}
