import _objectWithoutPropertiesLoose from '@babel/runtime/helpers/esm/objectWithoutPropertiesLoose';
import _extends from '@babel/runtime/helpers/esm/extends';
const _excluded = [
  'value',
  'isLandscape',
  'onChange',
  'toolbarFormat',
  'toolbarPlaceholder',
  'views',
];
import * as React from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import { styled, useThemeProps } from '@mui/material/styles';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import { PickersToolbar } from '@mui/x-date-pickers/internals/components/PickersToolbar';
import { useLocaleText, useUtils } from '@mui/x-date-pickers/internals/hooks/useUtils';
import { getDatePickerToolbarUtilityClass } from './datePickerToolbarClasses';
import { resolveDateFormat } from '@mui/x-date-pickers/internals/utils/date-utils';
import { jsx as _jsx } from 'react/jsx-runtime';
const useUtilityClasses = (ownerState) => {
  const { classes } = ownerState;
  const slots = {
    root: ['root'],
    title: ['title'],
  };
  return composeClasses(slots, getDatePickerToolbarUtilityClass, classes);
};
const DatePickerToolbarRoot = styled(PickersToolbar, {
  name: 'MuiDatePickerToolbar',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})({});

/**
 * @ignore - do not document.
 */
const DatePickerToolbarTitle = styled(Typography, {
  name: 'MuiDatePickerToolbar',
  slot: 'Title',
  overridesResolver: (_, styles) => styles.title,
})(({ ownerState }) =>
  _extends(
    {},
    ownerState.isLandscape && {
      margin: 'auto 16px auto auto',
    },
  ),
);
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
const DatePickerToolbar = /*#__PURE__*/ React.forwardRef(function DatePickerToolbar(inProps, ref) {
  const props = useThemeProps({
    props: inProps,
    name: 'MuiDatePickerToolbar',
  });
  const { value, isLandscape, toolbarFormat, toolbarPlaceholder = '––', views } = props,
    other = _objectWithoutPropertiesLoose(props, _excluded);
  const utils = useUtils();
  const localeText = useLocaleText();
  const classes = useUtilityClasses(props);
  const dateText = React.useMemo(() => {
    if (!value) {
      return toolbarPlaceholder;
    }
    const formatFromViews = resolveDateFormat(
      utils,
      {
        format: toolbarFormat,
        views,
      },
      true,
    );
    return utils.formatByString(value, formatFromViews);
  }, [value, toolbarFormat, toolbarPlaceholder, utils, views]);
  const ownerState = props;
  return /*#__PURE__*/ _jsx(
    DatePickerToolbarRoot,
    _extends(
      {
        ref: ref,
        toolbarTitle: localeText.datePickerToolbarTitle,
        isLandscape: isLandscape,
        className: classes.root,
      },
      other,
      {
        children: /*#__PURE__*/ _jsx(DatePickerToolbarTitle, {
          variant: 'h4',
          align: isLandscape ? 'left' : 'center',
          ownerState: ownerState,
          className: classes.title,
          children: dateText,
        }),
      },
    ),
  );
});
process.env.NODE_ENV !== 'production'
  ? (DatePickerToolbar.propTypes = {
      // ----------------------------- Warning --------------------------------
      // | These PropTypes are generated from the TypeScript type definitions |
      // | To update them edit the TypeScript types and run "yarn proptypes"  |
      // ----------------------------------------------------------------------
      classes: PropTypes.object,
      /**
       * className applied to the root component.
       */
      className: PropTypes.string,
      disabled: PropTypes.bool,
      /**
       * If `true`, show the toolbar even in desktop mode.
       * @default `true` for Desktop, `false` for Mobile.
       */
      hidden: PropTypes.bool,
      isLandscape: PropTypes.bool.isRequired,
      onChange: PropTypes.func.isRequired,
      /**
       * Callback called when a toolbar is clicked
       * @template TView
       * @param {TView} view The view to open
       */
      onViewChange: PropTypes.func.isRequired,
      readOnly: PropTypes.bool,
      sx: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
        PropTypes.func,
        PropTypes.object,
      ]),
      titleId: PropTypes.string,
      /**
       * Toolbar date format.
       */
      toolbarFormat: PropTypes.string,
      /**
       * Toolbar value placeholder—it is displayed when the value is empty.
       * @default "––"
       */
      toolbarPlaceholder: PropTypes.node,
      value: PropTypes.any,
      /**
       * Currently visible picker view.
       */
      view: PropTypes.oneOf(['day', 'month', 'year']).isRequired,
      views: PropTypes.arrayOf(PropTypes.oneOf(['day', 'month', 'year']).isRequired).isRequired,
    })
  : void 0;
export { DatePickerToolbar };
