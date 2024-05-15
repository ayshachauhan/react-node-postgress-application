export type GetCalendarsParams = {
  practiceId: string;
  userId: string;
};

export type GetCalendarByIdParams = GetCalendarsParams & { id: string };

export type GetCalendarBySurgeryTypeIdParams = GetCalendarsParams & {
  surgeryConfigurationId: string;
};

export type CreateCalendarParams = Required<GetCalendarsParams>;

export type UpdateCalendarParams = GetCalendarByIdParams;

export type UpdateCalendarsParams = GetCalendarsParams;
