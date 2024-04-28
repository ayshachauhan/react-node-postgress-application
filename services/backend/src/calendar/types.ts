export type GetCalendarsParams = {
  practiceId: string;
  userId: string;
  surgeryTypeId: string;
};

export type GetCalendarByIdParams = GetCalendarsParams & { id: string };

export type CreateCalendarParams = GetCalendarsParams;

export type UpdateCalendarParams = GetCalendarByIdParams;
