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
  title: string | React.ReactNode;
  accessor: keyof T | ((row: T) => JSX.Element | string);
  Component?: React.ComponentType<{ row: T }>;
  sortable?: boolean;
  width?: number;
  cellStyle?:
    | React.CSSProperties
    | ((cellValue: number) => React.CSSProperties);
};

type Props<T extends object> = {
  data: T[];
  columns: ColumnConfig<T>[];
};

function DataTable<T extends object>({ data, columns }: Props<T>) {
  const dataToRender = data;

  const renderTableCell = (
    row: T,
    column: ColumnConfig<T>,
    rowIndex: number,
  ) => {
    const { Component, accessor, id } = column;
    const colValue =
      typeof accessor === 'function' ? accessor(row) : row[accessor];

    let style: React.CSSProperties = {};
    if (typeof column.cellStyle === 'function') {
      style = column.cellStyle(colValue as number);
    } else {
      style = column.cellStyle || {};
    }

    type StyleObject = {
      [key: string]: string | number;
    };

    const maxWidthStyle: StyleObject = {
      maxWidth: column.width ? `${column.width}px` : 'initial',
      ...style,
    };

    return (
      <StyledCell
        key={`row-${rowIndex}-col-${id as string}`}
        $style={maxWidthStyle}
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
          const isLastRow = rowIndex === dataToRender.length - 1;
          return (
            <StyledRow
              key={`row-${rowIndex}`}
              className="data-table_body-row"
              style={{ borderBottom: isLastRow ? 'none' : undefined }}
            >
              {columns.map((cell) => renderTableCell(row, cell, rowIndex))}
            </StyledRow>
          );
        })}
      </StyledBody>
    </StyledTable>
  );
}

export default DataTable;
