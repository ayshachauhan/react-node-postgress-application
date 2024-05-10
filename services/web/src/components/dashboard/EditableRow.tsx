import Button from '@root/components/Button';
import TextInput from '@root/components/TextInput';
import React from 'react';

function EditableRow({ row, handleEditFormChange, handleCancelClick }) {
  return (
    <form>
      <div className="flex gap-2 px-2.5 items-center text-xs">
        <div className="py-2 w-20">
          <TextInput
            name="date"
            value={row.date}
            onChange={handleEditFormChange(row.id)}
            overrides={{
              Root: {
                style: {
                  heightOverride: '40px',
                },
              },
            }}
          />
        </div>
        <div className="py-2 px-1.5 w-20">
          <TextInput
            name="home"
            value={row.home}
            onChange={handleEditFormChange(row.id)}
          />
        </div>
        <div className="py-2 px-1.5 w-20">
          <TextInput
            name="round"
            value={row.home}
            onChange={handleEditFormChange(row.id)}
          />
        </div>
        <div className="py-2 w-20">
          <TextInput
            name="status"
            value={row.status}
            onChange={handleEditFormChange(row.id)}
          />
        </div>
        <div className="py-2 w-20">
          <TextInput
            name="lastName"
            value={row.lastName}
            onChange={handleEditFormChange(row.id)}
          />
        </div>
        <div className="py-2 w-20">
          <TextInput
            name="firstName"
            value={row.firstName}
            onChange={handleEditFormChange(row.id)}
          />
        </div>
        <div className="py-2 w-20">
          <TextInput
            name="mrn"
            value={row.mrn}
            onChange={handleEditFormChange(row.id)}
          />
        </div>
        <div className="py-2 w-20">
          <TextInput
            name="eye"
            value={row.eye}
            onChange={handleEditFormChange(row.id)}
          />
        </div>
        <div className="py-2 w-20">
          <TextInput
            name="surgery"
            value={row.surgery}
            onChange={handleEditFormChange(row.id)}
          />
        </div>
        <div className="py-2 px-1.5 w-20">
          <TextInput
            name="am"
            value={row.am}
            onChange={handleEditFormChange(row.id)}
          />
        </div>
        <div className="py-2 w-20">
          <TextInput
            name="femto"
            value={row.femto}
            onChange={handleEditFormChange(row.id)}
          />
        </div>
        <div className="py-2 px-1.5 w-20">
          <TextInput
            name="ora"
            value={row.ora}
            onChange={handleEditFormChange(row.id)}
          />
        </div>
        <div className="py-2 w-20">
          <TextInput
            name="lens"
            value={row.lens}
            onChange={handleEditFormChange(row.id)}
          />
        </div>
        <div className="py-2 w-20">
          <TextInput
            name="implant"
            value={row.implant}
            onChange={handleEditFormChange(row.id)}
          />
        </div>
        <div className="py-2 w-20">
          <TextInput
            name="details"
            value={row.details}
            onChange={handleEditFormChange(row.id)}
          />
        </div>
        <div className="py-2 w-20">
          <TextInput
            name="hash"
            value={row.hash}
            onChange={handleEditFormChange(row.id)}
          />
        </div>
        <div className="py-2 w-20">
          <TextInput
            name="calcs"
            value={row.calcs}
            onChange={handleEditFormChange(row.id)}
          />
        </div>
        <div className="py-2 w-20">
          <TextInput
            name="auth"
            value={row.auth}
            onChange={handleEditFormChange(row.id)}
          />
        </div>
        <div className="py-2 w-20">
          <TextInput
            name="hp"
            value={row.hp}
            onChange={handleEditFormChange(row.id)}
          />
        </div>
        <div className="py-2 w-20">
          <TextInput
            name="consent"
            value={row.consent}
            onChange={handleEditFormChange(row.id)}
          />
        </div>
        <div className="py-2 w-20">
          <TextInput
            name="prof"
            value={row.prof}
            onChange={handleEditFormChange(row.id)}
          />
        </div>
        <div className="py-2 w-20">
          <TextInput
            name="hospital"
            value={row.hospital}
            onChange={handleEditFormChange(row.id)}
          />
        </div>
        <div className="py-2 w-20">
          <TextInput
            name="insurance"
            value={row.insurance}
            onChange={handleEditFormChange(row.id)}
          />
        </div>
        <div className="flex items-center gap-2 py-2 w-40">
          <Button kind="primary" title="Update" width={60} height={10} />
          <Button
            onClick={handleCancelClick}
            type="button"
            kind="tertiary"
            title="Cancel"
            width={60}
            height={10}
            style={{
              backgroundColor: 'rgba(212, 212, 216, 1)',
              color: 'black',
            }}
          />
        </div>
      </div>
    </form>
  );
}

export default EditableRow;
