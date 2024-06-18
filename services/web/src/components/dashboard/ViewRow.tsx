import { Checkbox } from 'baseui/checkbox';
import React from 'react';

function ViewRow({ selectedSurgery, viewBillingColumn }) {
  const selectedOptions = selectedSurgery.selectedSurgeryOptions;
  const selectedOptionHeader: string[] = Object.keys(selectedOptions);

  return (
    <div className="flex gap-2 p-2.5 text-xs border-b">
      <div className="flex-1">
        <p>
          <span className="font-bold">Date: </span>
          <span>{selectedSurgery.date}</span>
        </p>
        <p>
          <span className="font-bold">Home Location: </span>
          <span>{selectedSurgery.home}</span>
        </p>
        <p>
          <span className="font-bold">Appointment Status: </span>
          <span>{selectedSurgery.status}</span>
        </p>
        <p>
          <span className="font-bold">Waitlist: </span>
          <span>{selectedSurgery.waitlist}</span>
        </p>
        <p>
          <span className="font-bold">#: </span>
          <span>{selectedSurgery.surgeryOrder}</span>
        </p>
      </div>
      <div className="flex-1">
        <p>
          <span className="font-bold">Last Name: </span>
          <span>{selectedSurgery.firstName}</span>
        </p>
        <p>
          <span className="font-bold">First Name: </span>
          <span>{selectedSurgery.lastName}</span>
        </p>
        <p>
          <span className="font-bold">MRN: </span>
          <span>{selectedSurgery.mrn}</span>
        </p>
        <p>
          <span className="font-bold">Phone number: </span>
          <span>{selectedSurgery.phoneNumber}</span>
        </p>
        <p className="flex items-center">
          <span className="font-bold">Referrer: </span>
          <span>{selectedSurgery.referrer}</span>
          <span>
            {selectedSurgery.referrerVerified && (
              <Checkbox
                checked={true}
                overrides={{
                  Checkmark: {
                    style: ({ $checked }) => ({
                      backgroundColor: $checked
                        ? 'rgba(34, 197, 94, 1)'
                        : 'white',
                      borderColor: $checked
                        ? 'rgba(34, 197, 94, 1)'
                        : 'rgba(113, 113, 122, 1)',
                      width: '12px',
                      height: '12px',
                      borderRadius: '2px',
                      borderWidth: '2px',
                    }),
                  },
                }}
              />
            )}
          </span>
        </p>
      </div>
      <div className="flex-1">
        <p>
          <span className="font-bold">Surgery: </span>
          <span>{selectedSurgery.surgery}</span>
        </p>
        <p>
          <span className="font-bold">Body Part: </span>
          <span>{selectedSurgery.bodyPart}</span>
        </p>
        {selectedOptionHeader.map((option, i) => (
          <p key={i}>
            <span className="font-bold">{option.split('-')[0]}: </span>
            <span>{selectedOptions[option].value}</span>
          </p>
        ))}

        <p>
          <span className="font-bold">Notes: </span>
          <span>{selectedSurgery.details}</span>
        </p>
        {selectedSurgery.selectedChecklistOptions
          ? Object.keys(selectedSurgery.selectedChecklistOptions).map(
              (checkList, i) => (
                <p key={i}>
                  <span className="font-bold">{checkList}: </span>
                  <span>
                    {selectedSurgery.selectedChecklistOptions[checkList].value}
                  </span>
                </p>
              ),
            )
          : null}
      </div>
      <div className="flex-1">
        {viewBillingColumn && (
          <p>
            <span className="font-bold">Prof: </span>
            <span>{selectedSurgery.prof}</span>
          </p>
        )}
        {viewBillingColumn && (
          <p>
            <span className="font-bold">Hospital: </span>
            <span>{selectedSurgery.hospital}</span>
          </p>
        )}
        <p>
          <span className="font-bold">Insurance: </span>
          <span>{selectedSurgery.insurance}</span>
        </p>
        {}
        <p>
          <span className="font-bold">Contact Info: </span>
          <span>{selectedSurgery.email}</span>
        </p>
      </div>
    </div>
  );
}

export default ViewRow;
