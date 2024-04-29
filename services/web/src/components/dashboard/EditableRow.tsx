import TextInput from '@root/components/TextInput';
import React from 'react';

function EditableRow({ row, handleEditFormChange, handleCancelClick }) {
  return (
    <tr>
      <td>
        <TextInput
          type="text"
          name="name"
          value={row.name}
          onChange={handleEditFormChange(row.id)}
        />
      </td>
      <td>
        <TextInput
          type="text"
          name="age"
          value={row.age}
          onChange={handleEditFormChange(row.id)}
        />
      </td>
      <td>
        <TextInput
          type="text"
          name="name"
          value={row.name}
          onChange={handleEditFormChange(row.id)}
        />
      </td>
      <td>
        <TextInput
          type="text"
          name="name"
          value={row.name}
          onChange={handleEditFormChange(row.id)}
        />
      </td>
      <td>
        <TextInput
          type="text"
          name="name"
          value={row.name}
          onChange={handleEditFormChange(row.id)}
        />
      </td>
      <td>
        <TextInput
          type="text"
          name="name"
          value={row.name}
          onChange={handleEditFormChange(row.id)}
        />
      </td>
      <td>
        <TextInput
          type="text"
          name="name"
          value={row.name}
          onChange={handleEditFormChange(row.id)}
        />
      </td>

      <td>
        <TextInput
          type="text"
          name="name"
          value={row.name}
          onChange={handleEditFormChange(row.id)}
        />
      </td>
      <td>
        <TextInput
          type="text"
          name="name"
          value={row.name}
          onChange={handleEditFormChange(row.id)}
        />
      </td>
      <td>
        <TextInput
          type="text"
          name="name"
          value={row.name}
          onChange={handleEditFormChange(row.id)}
        />
      </td>
      <td>
        <TextInput
          type="text"
          name="name"
          value={row.name}
          onChange={handleEditFormChange(row.id)}
        />
      </td>
      <td>
        <TextInput
          type="text"
          name="name"
          value={row.name}
          onChange={handleEditFormChange(row.id)}
        />
      </td>

      <td>
        <button type="submit">Save</button>
        <button type="button" onClick={handleCancelClick}>
          Cancel
        </button>
      </td>
    </tr>
  );
}

export default EditableRow;
