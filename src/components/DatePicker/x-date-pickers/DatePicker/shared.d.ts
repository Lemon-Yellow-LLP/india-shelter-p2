import * as React from 'react';
import { DefaultizedProps } from '@mui/x-date-pickers/internals/models/helpers';
import {
  DateCalendarSlotsComponent,
  DateCalendarSlotsComponentsProps,
  ExportedDateCalendarProps,
} from '@mui/x-date-pickers/DateCalendar/DateCalendar.types';
import { DateValidationError, DateView } from '@mui/x-date-pickers/models';
import { BasePickerInputProps } from '@mui/x-date-pickers/internals/models/props/basePickerProps';
import { BaseDateValidationProps, UncapitalizeObjectKeys } from '@mui/x-date-pickers/internals';
import { LocalizedComponent } from '@mui/x-date-pickers/locales/utils/pickersLocaleTextApi';
import { DatePickerToolbarProps, ExportedDatePickerToolbarProps } from './DatePickerToolbar';
import { PickerViewRendererLookup } from '@mui/x-date-pickers/internals/hooks/usePicker/usePickerViews';
import { DateViewRendererProps } from '@mui/x-date-pickers/dateViewRenderers';
export interface BaseDatePickerSlotsComponent<TDate> extends DateCalendarSlotsComponent<TDate> {
  /**
   * Custom component for the toolbar rendered above the views.
   * @default DatePickerToolbar
   */
  Toolbar?: React.JSXElementConstructor<DatePickerToolbarProps<TDate>>;
}
export interface BaseDatePickerSlotsComponentsProps<TDate>
  extends DateCalendarSlotsComponentsProps<TDate> {
  toolbar?: ExportedDatePickerToolbarProps;
}
export interface BaseDatePickerProps<TDate>
  extends BasePickerInputProps<TDate | null, TDate, DateView, DateValidationError>,
    ExportedDateCalendarProps<TDate> {
  /**
   * Overridable components.
   * @default {}
   * @deprecated Please use `slots`.
   */
  components?: BaseDatePickerSlotsComponent<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   * @deprecated Please use `slotProps`.
   */
  componentsProps?: BaseDatePickerSlotsComponentsProps<TDate>;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: UncapitalizeObjectKeys<BaseDatePickerSlotsComponent<TDate>>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: BaseDatePickerSlotsComponentsProps<TDate>;
  /**
   * Define custom view renderers for each section.
   * If `null`, the section will only have field editing.
   * If `undefined`, internally defined view will be the used.
   */
  viewRenderers?: Partial<
    PickerViewRendererLookup<TDate | null, DateView, DateViewRendererProps<TDate, DateView>, {}>
  >;
}
type UseDatePickerDefaultizedProps<
  TDate,
  Props extends BaseDatePickerProps<TDate>,
> = LocalizedComponent<
  TDate,
  Omit<
    DefaultizedProps<Props, 'views' | 'openTo' | keyof BaseDateValidationProps<TDate>>,
    'components' | 'componentsProps'
  >
>;
export declare function useDatePickerDefaultizedProps<
  TDate,
  Props extends BaseDatePickerProps<TDate>,
>(props: Props, name: string): UseDatePickerDefaultizedProps<TDate, Props>;
export {};
