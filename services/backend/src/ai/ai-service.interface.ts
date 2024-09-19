export interface AIService {
  doSMSChat(data: { phoneNumber: string; question: string }): Promise<string>;
}
