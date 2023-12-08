import _extends from '@babel/runtime/helpers/esm/extends';
import {
  singleItemFieldValueManager,
  singleItemValueManager,
} from '@mui/x-date-pickers/internals/utils/valueManagers';
import { useField } from '@mui/x-date-pickers/internals/hooks/useField';
import { validateDate } from '@mui/x-date-pickers/internals/utils/validation/validateDate';
import { applyDefaultDate } from '@mui/x-date-pickers/internals/utils/date-utils';
import { useUtils, useDefaultDates } from '@mui/x-date-pickers/internals/hooks/useUtils';
import { splitFieldInternalAndForwardedProps } from '@mui/x-date-pickers/internals/utils/fields';
const useDefaultizedDateField = (props) => {
  var _props$disablePast, _props$disableFuture, _props$format;
  const utils = useUtils();
  const defaultDates = useDefaultDates();
  return _extends({}, props, {
    disablePast: (_props$disablePast = props.disablePast) != null ? _props$disablePast : false,
    disableFuture:
      (_props$disableFuture = props.disableFuture) != null ? _props$disableFuture : false,
    format: (_props$format = props.format) != null ? _props$format : utils.formats.keyboardDate,
    minDate: applyDefaultDate(utils, props.minDate, defaultDates.minDate),
    maxDate: applyDefaultDate(utils, props.maxDate, defaultDates.maxDate),
  });
};
export const useDateField = ({ props: inProps, inputRef }) => {
  const props = useDefaultizedDateField(inProps);
  const { forwardedProps, internalProps } = splitFieldInternalAndForwardedProps(props, 'date');
  return useField({
    inputRef,
    forwardedProps,
    internalProps,
    valueManager: singleItemValueManager,
    fieldValueManager: singleItemFieldValueManager,
    validator: validateDate,
    valueType: 'date',
  });
};
