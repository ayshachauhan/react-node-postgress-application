import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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
import { EvalsService } from 'src/evals/evals.service';
import { SurgeryService } from 'src/surgery/surgery.service';
import { TemplatesService } from 'src/templates/templates.service';
import { TransporterService } from 'src/transporter';
import { SystemTemplates } from 'src/transporter/transporter.types';
import { formatHeaderDate, toLowerCase, toPascalCase } from 'src/utils';
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
    @Inject(forwardRef(() => EvalsService))
    private evalService: EvalsService,
    @Inject(forwardRef(() => SurgeryService))
    private surgeryService: SurgeryService,
    private readonly configService: ConfigService,
  ) {}

  getFrontEndBaseUrl() {
    return this.configService.get(ENVIRONMENT_VARIABLES.FRONT_END_BASE_URL);
  }

  async checkAndMakeDoctorEmailContent(
    practice: IPractice,
    entity: IEval | ISurgery,
    systemGeneratedMailData?: SystemGeneratedMailData,
    fromEval?: boolean,
  ): Promise<void> {
    const mailVariables = await this.makeEmailVariable(entity, practice);

    const emailLogsEntries: Partial<IEmailLog>[] = [];
    if (systemGeneratedMailData) {
      const systemTemplateName = systemGeneratedMailData.systemTemplate;
      const entry: Partial<IEmailLog> = {
        practice: practice,
        expectedDate: entity.date,
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
        expectedDate: entity.date,
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

  async checkAndMakeEmailContent(
    practice: IPractice,
    entity: IEval | ISurgery,
    systemGeneratedMailData?: SystemGeneratedMailData,
    fromEval?: boolean,
  ): Promise<void> {
    let bookingTemplateFound: boolean = false;
    const mailVariables = await this.makeEmailVariable(entity, practice);
    const surgeryConfigId = entity.surgeryConfiguration.id;
    const templates = await this.templateService.getFilteredTemplates({
      surgeryConfigId,
    });

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
          },
          attachment: template.emailAttachment,
        };

        const surgeryDate = new Date(entity.date);
        if (template.messageType === 'preop') {
          surgeryDate.setDate(surgeryDate.getDate() - template.dateOffset);
          entry.expectedDate = surgeryDate;
          entry.status = surgeryDate < today ? 'completed' : 'pending';
          emailLogsEntries.push(entry);
        } else if (template.messageType === 'postop') {
          surgeryDate.setDate(surgeryDate.getDate() + template.dateOffset);
          entry.expectedDate = surgeryDate;
          entry.status = surgeryDate < today ? 'completed' : 'pending';
          emailLogsEntries.push(entry);
        } else if (template.messageType === 'booking') {
          bookingTemplateFound = true;
          surgeryDate.setDate(surgeryDate.getDate() + template.dateOffset);
          entry.expectedDate = surgeryDate;
          emailLogsEntries.push(entry);
        } else if (template.messageType === 'referrer') {
          //
        } else if (template.messageType === 'pcp') {
          //
        }
      });
    }

    if (!bookingTemplateFound && systemGeneratedMailData) {
      const systemTemplateName = systemGeneratedMailData.systemTemplate;
      const entry: Partial<IEmailLog> = {
        practice: practice,
        expectedDate: entity.date,
        status: 'pending',
        data: {
          body: this.transporterService.readTemplates(systemTemplateName),
          ...mailVariables,
          subject: systemGeneratedMailData.subject,
          text: systemGeneratedMailData.text,
          to: mailVariables.pt_email_address,
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

  mailVariableManipulator(str: string): string {
    return str.replaceAll('[', '{{').replaceAll(']', '}}');
  }

  async makeEmailVariable(
    entity: IEval | ISurgery,
    practice: IPractice,
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
      },
      surgeryConfiguration: { name },
      date,
      bodyPart,
      practiceHome: { name: practiceHomeName },
      insuranceType,
    } = entity;

    const { allCataractDates, allCaseType } =
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
      all_cases: makeAllCaseString(bodyPart, name, date),
      all_cataract_dates: allCataractDates.join(),
      all_case_type: allCaseType.join(),
      phoneNumber: phoneNumber,
      practiceName: practice.name,
      insuranceType: insuranceType ? insuranceType.name : '',
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
    const upcomingEvals = await this.evalService.findEvalByPatient(
      patientId,
      new Date(),
    );

    allCaseType.push(...makeAllCaseArray(upcomingEvals));

    const upcomingSurgeries = await this.surgeryService.findSurgeryByPatient(
      patientId,
      new Date(),
    );
    allCaseType.push(...makeAllCaseArray(upcomingSurgeries));

    return {
      allCataractDates: allCaseType.filter((ele) =>
        toLowerCase(ele).includes('cataract'),
      ),
      allCaseType,
    };
  }

  async sendVideoToPatient(
    data: Record<string, string>,
    practice: IPractice,
  ): Promise<void> {
    const entry: Partial<IEmailLog> = {
      practice,
      expectedDate: new Date(),
      status: 'pending',
      data: {
        to: data.email,
        body: this.transporterService.readTemplates(
          SystemTemplates.SEND_VIDEO_TO_PATIENT,
        ),
        patientName: `${data.firstName} ${data.lastName}`,
        links: data.links,
        subject: 'Surgery Videos.',
        text: '',
        pt_email_address: data.email,
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
  ) {
    const emailLogsEntries: Partial<IEmailLog>[] = [];
    const mailVariables = await this.makeEmailVariable(entity, practice);

    const { staffEmails, operatingRoomEmails } = practice.emailData;
    if (staffEmails || operatingRoomEmails) {
      const sendEmailArray: string[] = [...staffEmails, ...operatingRoomEmails];
      const systemTemplateName = SystemTemplates.NOTIFY_STAFF_SURGERY_UPDATED;

      const subject: string = `A surgery is updated
      in your practice: ${practice.name}`;

      const entry: Partial<IEmailLog> = {
        practice: practice,
        expectedDate: entity.date,
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
  `${bodyPart + ' ' + surgery + ' | ' + formatHeaderDate(String(date))})`;
