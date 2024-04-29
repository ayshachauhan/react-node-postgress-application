export type GetCalendarsParams = {
  practiceId: string;
  userId: string;
};

export type GetCalendarByIdParams = GetCalendarsParams & { id: string };

export type GetCalendarBySurgeryTypeIdParams = GetCalendarsParams & {
  surgeryTypeId: string;
};

export type CreateCalendarParams = Required<GetCalendarsParams>;

export type UpdateCalendarParams = GetCalendarByIdParams;
