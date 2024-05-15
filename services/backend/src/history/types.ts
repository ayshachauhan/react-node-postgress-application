export type GetHistoryParams = {
  practiceId: string;
  userId: string;
};

export type GetHistoryByIdParams = GetHistoryParams & { id: string };

export type GetCalendarBySurgeryTypeIdParams = GetCalendarsParams & {
  surgeryConfigurationId: string;
};

export type CreateHistoryParams = Required<GetHistoryParams>;

export type UpdateCalendarParams = GetCalendarByIdParams;

export type UpdateCalendarsParams = GetCalendarsParams;
