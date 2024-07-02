import { formatHeaderDate } from '@root/utils';

export const makeAllCaseString = (bodyPart, surgery, date) => {
  return `${
    bodyPart + ' ' + surgery + ' | ' + formatHeaderDate(String(date))
  })`;
};

export const makeAllCaseArray = (dataArray) => {
  const caseArray: string[] = [];
  dataArray.forEach((ele) => {
    const data = makeAllCaseString(
      ele?.bodyPart,
      ele?.surgeryConfiguration?.name,
      ele?.date,
    );
    caseArray.push(data);
  });
  return caseArray;
};

export const findValueOfMailVariable = (upcompingSurgeries) => {
  const allCaseType: string[] = [];
  allCaseType.push(...makeAllCaseArray(upcompingSurgeries));

  return {
    allCataractDates: allCaseType.filter((ele) =>
      ele.toLowerCase().includes('cataract'),
    ),
    allCaseType,
  };
};

export const replacePlaceholders = (text, data) => {
  if (data && text) {
    return text.replace(/\[(\w+)\]/g, (_, key) => data[key] || _);
  }
};

// Function to pick a random surgery data
export const getRandomSurgeryData = (surgeries) => {
  if (surgeries.length === 0) {
    return null;
  }
  const randomIndex = Math.floor(Math.random() * surgeries.length);
  return formatSurgeryData(surgeries[randomIndex], surgeries);
};

export function filterUpcomingSurgeries(data) {
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  return data.filter((item) => {
    const itemDate = new Date(item.date);
    itemDate.setHours(0, 0, 0, 0);
    return itemDate >= currentDate;
  });
}

export const formatSurgeryData = (surgery, allSurgeries) => {
  const { allCataractDates, allCaseType } =
    findValueOfMailVariable(allSurgeries);
  return {
    fname: surgery?.patient?.firstName,
    lname: surgery?.patient?.lastName,
    mrn: surgery?.patient?.mrn,
    pt_email_address: surgery?.patient?.email,
    doc_email_address: surgery?.doctor?.email,
    doctorFirstname: surgery?.doctor?.firstName,
    doctorLastname: surgery?.doctor?.lastName,
    surgery_date: formatHeaderDate(surgery?.date),
    pt_email_notify: `You have received an email at ${surgery?.patient?.email} with more details`,
    laterality: surgery?.bodyPart.toLowerCase(),
    Laterality: surgery?.bodyPart,
    surgery_type: surgery?.surgeryConfiguration?.name,
    pod1_location: surgery?.practiceHome?.name,
    cataract_variable: '',
    all_cases: `${
      surgery?.bodyPart +
      ' ' +
      surgery?.surgeryConfiguration?.name +
      ' | ' +
      surgery?.date
    }`,
    all_cataract_dates: allCataractDates.join(),
    all_case_type: allCaseType.join(),
  };
};
