import { withStyle } from 'baseui';
import { Spinner } from 'baseui/spinner';
import React from 'react';

const ExtraLargeSpinner = withStyle(Spinner, {
  width: '96px',
  height: '96px',
  borderLeftWidth: '12px',
  borderRightWidth: '12px',
  borderTopWidth: '12px',
  borderBottomWidth: '12px',
  borderTopColor: '#299479',
  margin: 'auto',
});

const Loader = () => (
  <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
    <ExtraLargeSpinner />
  </div>
);

export default Loader;
