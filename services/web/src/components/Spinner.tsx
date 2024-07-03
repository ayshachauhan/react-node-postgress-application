import { withStyle } from 'baseui';
import { Spinner } from 'baseui/spinner';

export const ExtraLargeSpinner = withStyle(Spinner, {
  width: '96px',
  height: '96px',
  borderLeftWidth: '12px',
  borderRightWidth: '12px',
  borderTopWidth: '12px',
  borderBottomWidth: '12px',
  borderTopColor: '#299479',
  margin: 'auto',
});
