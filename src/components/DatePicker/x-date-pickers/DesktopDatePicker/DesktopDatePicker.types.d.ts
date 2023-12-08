import {
  UseDesktopPickerSlotsComponent,
  ExportedUseDesktopPickerSlotsComponentsProps,
  DesktopOnlyPickerProps,
} from '@mui/x-date-pickers/internals/hooks/useDesktopPicker';
import {
  BaseDatePickerProps,
  BaseDatePickerSlotsComponent,
  BaseDatePickerSlotsComponentsProps,
} from '@mui/x-date-pickers/DatePicker/shared';
import { MakeOptional } from '@mui/x-date-pickers/internals/models/helpers';
import { DateView } from '@mui/x-date-pickers/models';
import { UncapitalizeObjectKeys } from '@mui/x-date-pickers/internals/utils/slots-migration';
export interface DesktopDatePickerSlotsComponent<TDate>
  extends BaseDatePickerSlotsComponent<TDate>,
    MakeOptional<UseDesktopPickerSlotsComponent<TDate, DateView>, 'Field' | 'OpenPickerIcon'> {}
export interface DesktopDatePickerSlotsComponentsProps<TDate>
  extends BaseDatePickerSlotsComponentsProps<TDate>,
    ExportedUseDesktopPickerSlotsComponentsProps<TDate, DateView> {}
export interface DesktopDatePickerProps<TDate>
  extends BaseDatePickerProps<TDate>,
    DesktopOnlyPickerProps<TDate> {
  /**
   * Years rendered per row.
   * @default 4
   */
  yearsPerRow?: 3 | 4;
  /**
   * Overridable components.
   * @default {}
   * @deprecated Please use `slots`.
   */
  components?: DesktopDatePickerSlotsComponent<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   * @deprecated Please use `slotProps`.
   */
  componentsProps?: DesktopDatePickerSlotsComponentsProps<TDate>;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: UncapitalizeObjectKeys<DesktopDatePickerSlotsComponent<TDate>>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: DesktopDatePickerSlotsComponentsProps<TDate>;
}
