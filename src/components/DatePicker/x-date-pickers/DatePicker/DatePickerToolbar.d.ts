import * as React from 'react';
import { SxProps, Theme } from '@mui/material/styles';
import {
  BaseToolbarProps,
  ExportedBaseToolbarProps,
} from '@mui/x-date-pickers/internals/models/props/toolbar';
import { DateView } from '@mui/x-date-pickers/models';
import { DatePickerToolbarClasses } from './datePickerToolbarClasses';
export interface DatePickerToolbarProps<TDate> extends BaseToolbarProps<TDate | null, DateView> {
  classes?: Partial<DatePickerToolbarClasses>;
  sx?: SxProps<Theme>;
}
export interface ExportedDatePickerToolbarProps extends ExportedBaseToolbarProps {}
type DatePickerToolbarComponent = (<TDate>(
  props: DatePickerToolbarProps<TDate> & React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element) & {
  propTypes?: any;
};
/**
 * Demos:
 *
 * - [DatePicker](https://mui.com/x/react-date-pickers/date-picker/)
 * - [Custom components](https://mui.com/x/react-date-pickers/custom-components/)
 *
 * API:
 *
 * - [DatePickerToolbar API](https://mui.com/x/api/date-pickers/date-picker-toolbar/)
 */
declare const DatePickerToolbar: DatePickerToolbarComponent;
export { DatePickerToolbar };
