import { UseDateFieldProps, UseDateFieldParams } from './DateField.types';
export declare const useDateField: <TDate, TChildProps extends {}>({
  props: inProps,
  inputRef,
}: UseDateFieldParams<
  TDate,
  TChildProps
>) => import('@mui/x-date-pickers/internals/hooks/useField').UseFieldResponse<
  Omit<
    TChildProps &
      Omit<
        UseDateFieldProps<TDate>,
        'format' | keyof import('@mui/x-date-pickers/internals').BaseDateValidationProps<any>
      > &
      Required<
        Pick<
          UseDateFieldProps<TDate>,
          'format' | keyof import('@mui/x-date-pickers/internals').BaseDateValidationProps<any>
        >
      >,
    keyof UseDateFieldProps<TDate>
  >
>;
