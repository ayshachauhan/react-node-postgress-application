export type CalendarsPayload = {
  practiceId: string;
  surgeryTypeId?: string;
  userId: string;
  month?: string;
  option?: string;
  loggedInUserId?: string;
};

export type GetCalendarsPayload = CalendarsPayload;

export type CreateCalendarPayload = {
  maxSlots: number;
  bookedSlots: number;
  bookedHours: string;
  date: Date;
} & Required<CalendarsPayload>;

export type GetCalendarByIdPayload = { id: string } & CalendarsPayload;

export type UpdateCalendarPayload = {
  maxSlots: number;
  bookedSlots: number;
  bookedHours: string;
  id: string;
} & CalendarsPayload;

export type UpdateCalendarsPayload = {
  practiceId: string;
  userId: string;
  data: {
    maxSlots: number;
    bookedSlots: number;
    bookedHours: string;
    id: string;
  }[];
};
