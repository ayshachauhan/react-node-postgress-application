import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import {
  EmailLogEntity,
  EmailVariables,
  EvalEmailEntity,
  IEmailLog,
  IEval,
  IPractice,
  ISurgery,
  SurgeryEmailEntity,
} from '@packages/entities';
import { ENVIRONMENT_VARIABLES } from 'src/enums/environment.enums';
// import { EvalsService } from 'src/evals/evals.service';
import { SurgeryService } from 'src/surgery/surgery.service';
import { TemplatesService } from 'src/templates/templates.service';
import { TransporterService } from 'src/transporter';
import { SystemTemplates } from 'src/transporter/transporter.types';
import {
  formatHeaderDate,
  setToMidnight,
  toLowerCase,
  toPascalCase,
} from 'src/utils';
import { Repository } from 'typeorm';

export type SystemGeneratedMailData = {
  subject: string;
  text: string;
  systemTemplate: SystemTemplates;
};

@Injectable()
export class EmailHandlerService {
  constructor(
    @InjectRepository(EmailLogEntity)
    private emailLogRepository: Repository<EmailLogEntity>,
    @InjectRepository(EvalEmailEntity)
    private evalEmailRepository: Repository<EvalEmailEntity>,
    @InjectRepository(SurgeryEmailEntity)
    private surgeryEmailRepository: Repository<SurgeryEmailEntity>,
    @Inject(forwardRef(() => TemplatesService))
    private templateService: TemplatesService,
    @Inject(forwardRef(() => TransporterService))
    private transporterService: TransporterService,
    // @Inject(forwardRef(() => EvalsService))s
    // private evalService: EvalsService,
    @Inject(forwardRef(() => SurgeryService))
    private surgeryService: SurgeryService,
    private readonly configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  getFrontEndBaseUrl() {
    return this.configService.get(ENVIRONMENT_VARIABLES.FRONT_END_BASE_URL);
  }

  async checkAndMakeDoctorEmailContent(
    practice: IPractice,
    entity: IEval | ISurgery,
    systemGeneratedMailData?: SystemGeneratedMailData,
    fromEval?: boolean,
    messageType?: string,
  ): Promise<void> {
    const mailVariables = await this.makeEmailVariable(
      entity,
      practice,
      messageType,
    );

    const emailLogsEntries: Partial<IEmailLog>[] = [];
    if (systemGeneratedMailData) {
      const systemTemplateName = systemGeneratedMailData.systemTemplate;
      const entry: Partial<IEmailLog> = {
        practice: practice,
        expectedDate: new Date(),
        status: 'pending',
        data: {
          body: this.transporterService.readTemplates(systemTemplateName),
          ...mailVariables,
          subject: systemGeneratedMailData.subject,
          text: systemGeneratedMailData.text,
          to: mailVariables.doc_email_address,
        },
      };
      emailLogsEntries.push(entry);
    }

    const { staffEmails } = practice.emailData;
    if (staffEmails) {
      const systemTemplateName = fromEval
        ? SystemTemplates.NOTIFY_STAFF_EVAL_BOOKED
        : SystemTemplates.NOTIFY_STAFF_SURGERY_BOOKED;

      const subject: string = `A new ${
        fromEval ? 'eval' : 'surgery'
      } added to your practice ${practice.name}`;

      const entry: Partial<IEmailLog> = {
        practice: practice,
        expectedDate: new Date(),
        status: 'pending',
        data: {
          body: this.transporterService.readTemplates(systemTemplateName),
          ...mailVariables,
          subject,
          text: '',
        },
      };

      staffEmails.forEach((staffEmail: string) => {
        const staffMailEntry: Partial<IEmailLog> = {
          ...entry,
          data: { ...entry.data, to: staffEmail },
        };
        emailLogsEntries.push(staffMailEntry);
      });
    }

    // creating entries for cron job
    const dbEmailLogEntries =
      await this.emailLogRepository.save(emailLogsEntries);

    if (fromEval) {
      // creating entries in eval email log table
      const evalEmailEntries = dbEmailLogEntries.map((ele) => ({
        eval: entity,
        emailLog: ele,
      }));
      await this.evalEmailRepository.save(evalEmailEntries);
    } else {
      // creating entries in surgery email log table
      const surgeryEmailEntries = dbEmailLogEntries.map((ele) => ({
        surgery: entity,
        emailLog: ele,
      }));
      await this.surgeryEmailRepository.save(surgeryEmailEntries);
    }
  }

  // Type guard to check if entity is ISurgery
  isSurgery(entity: IEval | ISurgery): entity is ISurgery {
    return (entity as ISurgery).count !== undefined;
  }

  async checkAndMakeEmailContent(
    practice: IPractice,
    entity: IEval | ISurgery,
    systemGeneratedMailData?: SystemGeneratedMailData,
    fromEval?: boolean,
    messageType?: string,
  ): Promise<void> {
    let bookingTemplateFound: boolean = false;
    const mailVariables = await this.makeEmailVariable(
      entity,
      practice,
      messageType,
    );
    const surgeryConfigId = entity.surgeryConfiguration.id;
    const filter = {
      surgeryConfigId,
      ...(fromEval && { messageType: 'evaluation' }),
    };
    const templates = await this.templateService.getFilteredTemplates(filter);
    const { adminEmails } = practice.emailData;
    const ccAdminEmails: string =
      adminEmails && adminEmails.length ? `${adminEmails}` : '';

    const emailLogsEntries: Partial<IEmailLog>[] = [];

    if (templates.length) {
      templates.forEach((template) => {
        const today = new Date();
        const entry: Partial<IEmailLog> = {
          practice: practice,
          expectedDate: entity.date,
          status: 'pending',
          data: {
            to: mailVariables.pt_email_address,
            subject: template.emailSubject
              ? this.mailVariableManipulator(template.emailSubject)
              : '',
            body: template.emailBody
              ? this.mailVariableManipulator(template.emailBody)
              : '',
            attachment: template.emailAttachment
              ? template.emailAttachment
              : '',
            text: template.messageText
              ? this.mailVariableManipulator(template.messageText)
              : '',
            ...mailVariables,
            '1stCataract': template.email1stCataract
              ? this.mailVariableManipulator(template.email1stCataract)
              : '',
            '2ndCataract': template.email2ndCataract
              ? this.mailVariableManipulator(template.email2ndCataract)
              : '',
            cc: ccAdminEmails,
          },
          attachment: template.emailAttachment,
        };

        const surgeryDate = new Date(entity.date);
        if (template.messageType === 'preop') {
          let cataract = '';
          if (this.isSurgery(entity) && entity?.count === 1) {
            cataract = template.email1stCataract;
          }
          if (this.isSurgery(entity) && entity?.count === 2) {
            cataract = template.email2ndCataract;
          }
          entry.data = {
            ...entry.data,
            cataract_variable: cataract,
            messageType: 'Preop',
          };
          surgeryDate.setDate(surgeryDate.getDate() + template.dateOffset);
          entry.expectedDate = surgeryDate;
          entry.status =
            setToMidnight(surgeryDate) < setToMidnight(today)
              ? 'completed'
              : 'pending';
          emailLogsEntries.push(entry);
        } else if (template.messageType === 'postop') {
          let cataract = '';
          if (this.isSurgery(entity) && entity?.count === 1) {
            cataract = template.email1stCataract;
          }
          if (this.isSurgery(entity) && entity?.count === 2) {
            cataract = template.email2ndCataract;
          }
          entry.data = {
            ...entry.data,
            cataract_variable: cataract,
            messageType: 'Postop',
          };
          surgeryDate.setDate(surgeryDate.getDate() + template.dateOffset);
          entry.expectedDate = surgeryDate;
          entry.status =
            setToMidnight(surgeryDate) < setToMidnight(today)
              ? 'completed'
              : 'pending';
          emailLogsEntries.push(entry);
        } else if (template.messageType === 'booking') {
          bookingTemplateFound = true;
          surgeryDate.setDate(surgeryDate.getDate() + template.dateOffset);
          entry.expectedDate = new Date();
          entry.data = {
            ...entry.data,
            messageType: 'Booking',
          };
          emailLogsEntries.push(entry);
        } else if (template.messageType === 'referrer') {
          //
        } else if (template.messageType === 'pcp') {
          //
        } else if (template.messageType === 'evaluation' && fromEval) {
          bookingTemplateFound = true;
          surgeryDate.setDate(surgeryDate.getDate() + template.dateOffset);
          entry.expectedDate = new Date();
          entry.data = {
            ...entry.data,
            messageType: 'Evaluation',
          };
          emailLogsEntries.push(entry);
        }
      });
    }

    if (!bookingTemplateFound && systemGeneratedMailData) {
      const systemTemplateName = systemGeneratedMailData.systemTemplate;
      const entry: Partial<IEmailLog> = {
        practice: practice,
        expectedDate: new Date(),
        status: 'pending',
        data: {
          body: this.transporterService.readTemplates(systemTemplateName),
          ...mailVariables,
          subject: systemGeneratedMailData.subject,
          text: systemGeneratedMailData.text,
          to: mailVariables.pt_email_address,
          cc: ccAdminEmails,
        },
      };
      emailLogsEntries.push(entry);
    }

    // creating entries for cron job
    const dbEmailLogEntries =
      await this.emailLogRepository.save(emailLogsEntries);

    if (fromEval) {
      // creating entries in eval email log table
      const evalEmailEntries = dbEmailLogEntries.map((ele) => ({
        eval: entity,
        emailLog: ele,
      }));
      await this.evalEmailRepository.save(evalEmailEntries);
    } else {
      // creating entries in surgery email log table
      const surgeryEmailEntries = dbEmailLogEntries.map((ele) => ({
        surgery: entity,
        emailLog: ele,
      }));
      await this.surgeryEmailRepository.save(surgeryEmailEntries);
    }
  }

  async checkAndMakeReferrerEmailContent(
    practice: IPractice,
    entity: IEval | ISurgery,
    systemGeneratedMailData?: SystemGeneratedMailData,
    fromEval?: boolean,
    messageType?: string,
  ) {
    let referrerTemplateFound: boolean = false;
    const mailVariables = await this.makeEmailVariable(
      entity,
      practice,
      messageType,
    );
    const surgeryConfigId = entity.surgeryConfiguration.id;
    const referrerTemplates = await this.templateService.getFilteredTemplates({
      surgeryConfigId,
      messageType: 'referrer',
    });

    const emailLogsEntries: Partial<IEmailLog>[] = [];

    const randomIndex = Math.floor(Math.random() * referrerTemplates.length);
    const referrerTemplate = referrerTemplates[randomIndex];
    if (
      referrerTemplate &&
      Object.keys(referrerTemplate).length &&
      mailVariables?.referrerEmail
    ) {
      referrerTemplateFound = true;
      const entry: Partial<IEmailLog> = {
        practice: practice,
        expectedDate: new Date(),
        status: 'pending',
        data: {
          to: mailVariables?.referrerEmail,
          subject: referrerTemplate.emailSubject
            ? this.mailVariableManipulator(referrerTemplate.emailSubject)
            : '',
          body: referrerTemplate.emailBody
            ? this.mailVariableManipulator(referrerTemplate.emailBody)
            : this.transporterService.readTemplates(
                SystemTemplates.NOTIFY_REFERRER,
              ),
          attachment: referrerTemplate.emailAttachment
            ? referrerTemplate.emailAttachment
            : '',
          text: referrerTemplate.messageText
            ? this.mailVariableManipulator(referrerTemplate.messageText)
            : '',
          ...mailVariables,
          '1stCataract': referrerTemplate.email1stCataract
            ? this.mailVariableManipulator(referrerTemplate.email1stCataract)
            : '',
          '2ndCataract': referrerTemplate.email2ndCataract
            ? this.mailVariableManipulator(referrerTemplate.email2ndCataract)
            : '',
        },
        attachment: referrerTemplate.emailAttachment,
      };
      emailLogsEntries.push(entry);
    }

    if (
      !referrerTemplateFound &&
      mailVariables?.referrerEmail &&
      systemGeneratedMailData
    ) {
      const systemTemplateName = systemGeneratedMailData.systemTemplate;
      const entry: Partial<IEmailLog> = {
        practice: practice,
        expectedDate: new Date(),
        status: 'pending',
        data: {
          body: this.transporterService.readTemplates(systemTemplateName),
          ...mailVariables,
          subject: systemGeneratedMailData.subject,
          text: systemGeneratedMailData.text,
          to: mailVariables?.referrerEmail,
        },
      };
      emailLogsEntries.push(entry);
    }

    // Use the generic function to save email logs
    await this.saveEmailLogs(emailLogsEntries, entity, fromEval);
  }

  async checkAndMakePCPEmailContent(
    practice: IPractice,
    entity: IEval | ISurgery,
    systemGeneratedMailData?: SystemGeneratedMailData,
    fromEval?: boolean,
    messageType?: string,
  ) {
    let pcpTemplateFound: boolean = false;
    const mailVariables = await this.makeEmailVariable(
      entity,
      practice,
      messageType,
    );
    const surgeryConfigId = entity.surgeryConfiguration.id;
    const pcpTemplates = await this.templateService.getFilteredTemplates({
      surgeryConfigId,
      messageType: 'pcp',
    });

    const emailLogsEntries: Partial<IEmailLog>[] = [];

    const randomIndex = Math.floor(Math.random() * pcpTemplates.length);
    const pcpTemplate = pcpTemplates[randomIndex];
    if (
      pcpTemplate &&
      Object.keys(pcpTemplate).length &&
      mailVariables?.pcpEmail
    ) {
      pcpTemplateFound = true;
      const entry: Partial<IEmailLog> = {
        practice: practice,
        expectedDate: new Date(),
        status: 'pending',
        data: {
          to: mailVariables?.pcpEmail,
          subject: pcpTemplate.emailSubject
            ? this.mailVariableManipulator(pcpTemplate.emailSubject)
            : '',
          body: pcpTemplate.emailBody
            ? this.mailVariableManipulator(pcpTemplate.emailBody)
            : this.transporterService.readTemplates(SystemTemplates.NOTIFY_PCP),
          attachment: pcpTemplate.emailAttachment
            ? pcpTemplate.emailAttachment
            : '',
          text: pcpTemplate.messageText
            ? this.mailVariableManipulator(pcpTemplate.messageText)
            : '',
          ...mailVariables,
          '1stCataract': pcpTemplate.email1stCataract
            ? this.mailVariableManipulator(pcpTemplate.email1stCataract)
            : '',
          '2ndCataract': pcpTemplate.email2ndCataract
            ? this.mailVariableManipulator(pcpTemplate.email2ndCataract)
            : '',
        },
        attachment: pcpTemplate.emailAttachment,
      };
      emailLogsEntries.push(entry);
    }

    if (
      !pcpTemplateFound &&
      mailVariables?.pcpEmail &&
      systemGeneratedMailData
    ) {
      const systemTemplateName = systemGeneratedMailData.systemTemplate;
      const entry: Partial<IEmailLog> = {
        practice: practice,
        expectedDate: new Date(),
        status: 'pending',
        data: {
          body: this.transporterService.readTemplates(systemTemplateName),
          ...mailVariables,
          subject: systemGeneratedMailData.subject,
          text: systemGeneratedMailData.text,
          to: mailVariables?.pcpEmail,
        },
      };
      emailLogsEntries.push(entry);
    }

    // Use the generic function to save email logs
    await this.saveEmailLogs(emailLogsEntries, entity, fromEval);
  }

  async saveEmailLogs(
    emailLogsEntries: Partial<IEmailLog>[],
    entity: IEval | ISurgery,
    fromEval?: boolean,
  ) {
    // Save email log entries to the email log repository to send the email.
    const dbEmailLogEntries =
      await this.emailLogRepository.save(emailLogsEntries);

    // Save entries to the appropriate repository based on the entity type
    if (fromEval) {
      const evalEmailEntries = dbEmailLogEntries.map((ele) => ({
        eval: entity,
        emailLog: ele,
      }));
      await this.evalEmailRepository.save(evalEmailEntries);
    } else {
      const surgeryEmailEntries = dbEmailLogEntries.map((ele) => ({
        surgery: entity,
        emailLog: ele,
      }));
      await this.surgeryEmailRepository.save(surgeryEmailEntries);
    }
  }

  mailVariableManipulator(str: string): string {
    return str.replaceAll('[', '{{').replaceAll(']', '}}');
  }

  async makeEmailVariable(
    entity: IEval | ISurgery,
    practice: IPractice,
    messageType,
  ): Promise<EmailVariables> {
    const {
      patient: {
        firstName: patientFirstName,
        lastName: patientLastName,
        email: patientEmail,
        mrn,
        phoneNumber,
      },
      doctor: {
        firstName: doctorFirstName,
        lastName: doctorLastName,
        email: doctorEmail,
        contactNumber: doctorPhoneNumber,
      },
      surgeryConfiguration: { name },
      date,
      bodyPart,
      insuranceType,
    } = entity;

    const practiceHomeName = entity?.practiceHome?.name ?? '';

    const { allCataractDates, allCaseType, allCases } =
      await this.findValueOfMailVariable(entity);

    const mailVariables: EmailVariables = {
      surgery_type: name,
      fname: patientFirstName,
      lname: patientLastName,
      mrn: String(mrn),
      pt_email_address: patientEmail,
      doc_email_address: doctorEmail,
      doctorFirstname: doctorFirstName,
      doctorLastname: doctorLastName,
      surgery_date: String(date),
      pt_email_notify: `You have received an email at ${patientEmail} with more details`,
      laterality: toLowerCase(bodyPart),
      Laterality: toPascalCase(bodyPart),
      pod1_location: practiceHomeName,
      cataract_variable: '',
      all_cases: allCases.join(),
      all_cataract_dates: allCataractDates.join(),
      all_case_type: allCaseType.join(),
      phoneNumber: phoneNumber,
      practiceName: practice.name,
      insuranceType: insuranceType ? insuranceType.name : '',
      referrerFname: entity?.referrer?.firstName,
      referrerLname: entity?.referrer?.lastName,
      referrerEmail: entity?.referrer?.email,
      pcpFname: entity?.pcp?.firstName,
      pcpLname: entity?.pcp?.lastName,
      pcpEmail: entity?.pcp?.email,
      doctorPhoneNumber: doctorPhoneNumber,
      messageType: messageType,
    };

    return mailVariables;
  }

  async findValueOfMailVariable(
    entity: IEval | ISurgery,
  ): Promise<Record<string, string[]>> {
    const {
      patient: { id: patientId },
    } = entity;

    const allCaseType: string[] = [];
    /*
    
    FOR FUTURE USE
    this code may be beneficial for future use to add upcoming evals in variable
    
    */
    // const upcomingEvals = await this.evalService.findEvalByPatient(
    //   patientId,
    //   new Date(),
    // );

    // allCaseType.push(...makeAllCaseArray(upcomingEvals));

    const patientAllSurgeries =
      await this.surgeryService.findSurgeryByPatient(patientId);

    const upcomingSurgeries = patientAllSurgeries.filter(
      (surgery: ISurgery) => new Date(surgery.date) > new Date(),
    );
    allCaseType.push(...makeAllCaseArray(upcomingSurgeries));

    return {
      allCataractDates: allCaseType.filter((ele) =>
        toLowerCase(ele).includes('cataract'),
      ),
      allCaseType,
      allCases: makeAllCaseArray(patientAllSurgeries),
    };
  }

  async sendVideoToPatient(
    data: Record<string, string>,
    practice: IPractice,
  ): Promise<void> {
    const { adminEmails } = practice.emailData;
    const ccAdminEmails: string =
      adminEmails && adminEmails.length ? `${adminEmails}` : '';
    const entry: Partial<IEmailLog> = {
      practice,
      expectedDate: new Date(),
      status: 'pending',
      data: {
        ...data,
        to: data.email,
        body: await this.transporterService.compileTemplate(
          await this.transporterService.readTemplates(
            SystemTemplates.SEND_VIDEO_TO_PATIENT,
          ),
          {
            ...data,
            links: data?.links?.split(','),
            patientName: `${data.fname} ${data.lname}`,
          },
        ),
        patientName: `${data.fname} ${data.lname}`,
        subject: 'Surgery Videos.',
        text: '',
        messageType: 'Video Sent to Patient',
        pt_email_address: data.email,
        cc: ccAdminEmails,
      },
    };
    await this.emailLogRepository.save(entry);
  }

  async updateEmailLogsByPatientMrn(oldPatientMrn: number, newPayload) {
    if (oldPatientMrn) {
      const query = `
          SELECT * FROM email_logs 
          WHERE data->>'mrn' = $1 
          AND status = $2
        `;
      const emailLogsByPatientEmail = await this.emailLogRepository.query(
        query,
        [oldPatientMrn, 'pending'],
      );
      if (emailLogsByPatientEmail.length > 0) {
        await Promise.all(
          emailLogsByPatientEmail.map(async (log) => {
            log.data.pt_email_address = newPayload.email;
            log.data.phoneNumber = newPayload.phoneNumber;
            log.data.firstName = newPayload.firstName;
            log.data.lastName = newPayload.lastName;
            await this.emailLogRepository.save(log);
          }),
        );
      }
    }
  }

  async checkAndMakeSurgeryUpdateEmailContent(
    practice: IPractice,
    entity: ISurgery,
    messageType: string,
  ) {
    const emailLogsEntries: Partial<IEmailLog>[] = [];
    const mailVariables = await this.makeEmailVariable(
      entity,
      practice,
      messageType,
    );

    const { staffEmails, operatingRoomEmails } = practice.emailData;
    if (staffEmails || operatingRoomEmails) {
      const sendEmailArray: string[] = [...staffEmails, ...operatingRoomEmails];
      const systemTemplateName = SystemTemplates.NOTIFY_STAFF_SURGERY_UPDATED;

      const subject: string = `A surgery is updated
      in your practice: ${practice.name}`;

      const entry: Partial<IEmailLog> = {
        practice: practice,
        expectedDate: new Date(),
        status: 'pending',
        data: {
          body: this.transporterService.readTemplates(systemTemplateName),
          ...mailVariables,
          subject,
          text: '',
        },
      };

      sendEmailArray.forEach((email: string) => {
        const staffMailEntry: Partial<IEmailLog> = {
          ...entry,
          data: { ...entry.data, to: email },
        };
        emailLogsEntries.push(staffMailEntry);
      });

      // creating entries for cron job
      const dbEmailLogEntries =
        await this.emailLogRepository.save(emailLogsEntries);

      const surgeryEmailEntries = dbEmailLogEntries.map((ele) => ({
        surgery: entity,
        emailLog: ele,
      }));
      await this.surgeryEmailRepository.save(surgeryEmailEntries);
    }
  }

  async fetchAndMarkMailAsRead(id: string, token: string): Promise<void> {
    const jwtResponse = await this.jwtService.verify(token);
    if (jwtResponse) {
      await this.emailLogRepository.update(id, {
        isRead: true,
      });
    }
  }

  async checkAndMakeReviewEmailContent(
    practice: IPractice,
    data: Record<string, string>,
    systemGeneratedMailData?: SystemGeneratedMailData,
    messageType?: string,
  ): Promise<void> {
    const emailLogsEntries: Partial<IEmailLog>[] = [];
    if (systemGeneratedMailData) {
      const systemTemplateName = systemGeneratedMailData.systemTemplate;
      const entry: Partial<IEmailLog> = {
        practice: practice,
        expectedDate: new Date(),
        status: 'pending',
        data: {
          body: this.transporterService.readTemplates(systemTemplateName),
          subject: systemGeneratedMailData.subject,
          text: systemGeneratedMailData.text,
          messageType: messageType || '',
          ...data,
        },
      };
      emailLogsEntries.push(entry);
    }

    await this.emailLogRepository.save(emailLogsEntries);
  }
}

const makeAllCaseArray = (dataArray: IEval[] | ISurgery[]) => {
  const caseArray: string[] = [];
  dataArray.forEach((ele: IEval | ISurgery) =>
    caseArray.push(
      makeAllCaseString(ele.bodyPart, ele.surgeryConfiguration.name, ele.date),
    ),
  );
  return caseArray;
};

const makeAllCaseString = (
  bodyPart: string,
  surgery: string,
  date: Date,
): string =>
  `${bodyPart + ' ' + surgery + ' | ' + formatHeaderDate(String(date))}`;
