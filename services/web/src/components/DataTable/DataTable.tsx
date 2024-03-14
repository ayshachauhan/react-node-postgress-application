'use client';

import {
  SortableHeadCell,
  StyledBody,
  StyledCell,
  StyledHead,
  StyledRow,
  StyledTable,
} from 'baseui/table';
import React from 'react';

export type ColumnConfig<T extends object> = {
  id: string;
  title: string;
  accessor: keyof T | ((row: T) => JSX.Element | string);
  Component?: React.ComponentType<{ row: T }>;
  sortable?: boolean;
  width?: number;
};

type Props<T extends object> = {
  data: T[];
  columns: ColumnConfig<T>[];
};

function DataTable<T extends object>({ data, columns }: Props<T>) {
  const dataToRender = data;

  const _renderTableCell = (
    row: T,
    column: ColumnConfig<T>,
    rowIndex: number,
  ) => {
    const { Component, accessor, id } = column;
    const colValue =
      typeof accessor === 'function' ? accessor(row) : row[accessor];

    return (
      <StyledCell
        key={`row-${rowIndex}-col-${id as string}`}
        $style={{ maxWidth: column.width ? `${column.width}px` : 'initial' }}
      >
        {Component ? <Component row={row} /> : <>{colValue}</>}
      </StyledCell>
    );
  };

  return (
    <StyledTable className="data-table">
      <StyledHead className="data-table_header">
        {columns.map((column) => (
          <SortableHeadCell
            key={`head-${column.id}`}
            title={column.title}
            direction={null}
          />
        ))}
      </StyledHead>

      <StyledBody className="data-table_body">
        {dataToRender.map((row, rowIndex) => {
          return (
            <StyledRow key={`row-${rowIndex}`} className="data-table_body-row">
              {columns.map((cell) => _renderTableCell(row, cell, rowIndex))}
            </StyledRow>
          );
        })}
      </StyledBody>
    </StyledTable>
  );
}

export default DataTable;
