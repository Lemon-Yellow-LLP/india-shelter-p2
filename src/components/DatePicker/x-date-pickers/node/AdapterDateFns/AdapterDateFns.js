"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AdapterDateFns = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _addDays = _interopRequireDefault(require("date-fns/addDays"));
var _addSeconds = _interopRequireDefault(require("date-fns/addSeconds"));
var _addMinutes = _interopRequireDefault(require("date-fns/addMinutes"));
var _addHours = _interopRequireDefault(require("date-fns/addHours"));
var _addWeeks = _interopRequireDefault(require("date-fns/addWeeks"));
var _addMonths = _interopRequireDefault(require("date-fns/addMonths"));
var _addYears = _interopRequireDefault(require("date-fns/addYears"));
var _differenceInYears = _interopRequireDefault(require("date-fns/differenceInYears"));
var _differenceInQuarters = _interopRequireDefault(require("date-fns/differenceInQuarters"));
var _differenceInMonths = _interopRequireDefault(require("date-fns/differenceInMonths"));
var _differenceInWeeks = _interopRequireDefault(require("date-fns/differenceInWeeks"));
var _differenceInDays = _interopRequireDefault(require("date-fns/differenceInDays"));
var _differenceInHours = _interopRequireDefault(require("date-fns/differenceInHours"));
var _differenceInMinutes = _interopRequireDefault(require("date-fns/differenceInMinutes"));
var _differenceInSeconds = _interopRequireDefault(require("date-fns/differenceInSeconds"));
var _differenceInMilliseconds = _interopRequireDefault(require("date-fns/differenceInMilliseconds"));
var _eachDayOfInterval = _interopRequireDefault(require("date-fns/eachDayOfInterval"));
var _endOfDay = _interopRequireDefault(require("date-fns/endOfDay"));
var _endOfWeek = _interopRequireDefault(require("date-fns/endOfWeek"));
var _endOfYear = _interopRequireDefault(require("date-fns/endOfYear"));
var _format = _interopRequireDefault(require("date-fns/format"));
var _getDate = _interopRequireDefault(require("date-fns/getDate"));
var _getDaysInMonth = _interopRequireDefault(require("date-fns/getDaysInMonth"));
var _getHours = _interopRequireDefault(require("date-fns/getHours"));
var _getMinutes = _interopRequireDefault(require("date-fns/getMinutes"));
var _getMonth = _interopRequireDefault(require("date-fns/getMonth"));
var _getSeconds = _interopRequireDefault(require("date-fns/getSeconds"));
var _getMilliseconds = _interopRequireDefault(require("date-fns/getMilliseconds"));
var _getWeek = _interopRequireDefault(require("date-fns/getWeek"));
var _getYear = _interopRequireDefault(require("date-fns/getYear"));
var _isAfter = _interopRequireDefault(require("date-fns/isAfter"));
var _isBefore = _interopRequireDefault(require("date-fns/isBefore"));
var _isEqual = _interopRequireDefault(require("date-fns/isEqual"));
var _isSameDay = _interopRequireDefault(require("date-fns/isSameDay"));
var _isSameYear = _interopRequireDefault(require("date-fns/isSameYear"));
var _isSameMonth = _interopRequireDefault(require("date-fns/isSameMonth"));
var _isSameHour = _interopRequireDefault(require("date-fns/isSameHour"));
var _isValid = _interopRequireDefault(require("date-fns/isValid"));
var _parse = _interopRequireDefault(require("date-fns/parse"));
var _setDate = _interopRequireDefault(require("date-fns/setDate"));
var _setHours = _interopRequireDefault(require("date-fns/setHours"));
var _setMinutes = _interopRequireDefault(require("date-fns/setMinutes"));
var _setMonth = _interopRequireDefault(require("date-fns/setMonth"));
var _setSeconds = _interopRequireDefault(require("date-fns/setSeconds"));
var _setMilliseconds = _interopRequireDefault(require("date-fns/setMilliseconds"));
var _setYear = _interopRequireDefault(require("date-fns/setYear"));
var _startOfDay = _interopRequireDefault(require("date-fns/startOfDay"));
var _startOfMonth = _interopRequireDefault(require("date-fns/startOfMonth"));
var _endOfMonth = _interopRequireDefault(require("date-fns/endOfMonth"));
var _startOfWeek = _interopRequireDefault(require("date-fns/startOfWeek"));
var _startOfYear = _interopRequireDefault(require("date-fns/startOfYear"));
var _parseISO = _interopRequireDefault(require("date-fns/parseISO"));
var _formatISO = _interopRequireDefault(require("date-fns/formatISO"));
var _isWithinInterval = _interopRequireDefault(require("date-fns/isWithinInterval"));
var _enUS = _interopRequireDefault(require("date-fns/locale/en-US"));
var _longFormatters = _interopRequireDefault(require("date-fns/_lib/format/longFormatters"));
/* eslint-disable class-methods-use-this */

// @ts-ignore

const formatTokenMap = {
  // Year
  y: {
    sectionType: 'year',
    contentType: 'digit',
    maxLength: 4
  },
  yy: 'year',
  yyy: {
    sectionType: 'year',
    contentType: 'digit',
    maxLength: 4
  },
  yyyy: 'year',
  // Month
  M: {
    sectionType: 'month',
    contentType: 'digit',
    maxLength: 2
  },
  MM: 'month',
  MMMM: {
    sectionType: 'month',
    contentType: 'letter'
  },
  MMM: {
    sectionType: 'month',
    contentType: 'letter'
  },
  L: {
    sectionType: 'month',
    contentType: 'digit',
    maxLength: 2
  },
  LL: 'month',
  LLL: {
    sectionType: 'month',
    contentType: 'letter'
  },
  LLLL: {
    sectionType: 'month',
    contentType: 'letter'
  },
  // Day of the month
  d: {
    sectionType: 'day',
    contentType: 'digit',
    maxLength: 2
  },
  dd: 'day',
  do: {
    sectionType: 'day',
    contentType: 'digit-with-letter'
  },
  // Day of the week
  E: {
    sectionType: 'weekDay',
    contentType: 'letter'
  },
  EE: {
    sectionType: 'weekDay',
    contentType: 'letter'
  },
  EEE: {
    sectionType: 'weekDay',
    contentType: 'letter'
  },
  EEEE: {
    sectionType: 'weekDay',
    contentType: 'letter'
  },
  EEEEE: {
    sectionType: 'weekDay',
    contentType: 'letter'
  },
  i: {
    sectionType: 'weekDay',
    contentType: 'digit',
    maxLength: 1
  },
  ii: 'weekDay',
  iii: {
    sectionType: 'weekDay',
    contentType: 'letter'
  },
  iiii: {
    sectionType: 'weekDay',
    contentType: 'letter'
  },
  e: {
    sectionType: 'weekDay',
    contentType: 'digit',
    maxLength: 1
  },
  ee: 'weekDay',
  eee: {
    sectionType: 'weekDay',
    contentType: 'letter'
  },
  eeee: {
    sectionType: 'weekDay',
    contentType: 'letter'
  },
  eeeee: {
    sectionType: 'weekDay',
    contentType: 'letter'
  },
  eeeeee: {
    sectionType: 'weekDay',
    contentType: 'letter'
  },
  c: {
    sectionType: 'weekDay',
    contentType: 'digit',
    maxLength: 1
  },
  cc: 'weekDay',
  ccc: {
    sectionType: 'weekDay',
    contentType: 'letter'
  },
  cccc: {
    sectionType: 'weekDay',
    contentType: 'letter'
  },
  ccccc: {
    sectionType: 'weekDay',
    contentType: 'letter'
  },
  cccccc: {
    sectionType: 'weekDay',
    contentType: 'letter'
  },
  // Meridiem
  a: 'meridiem',
  aa: 'meridiem',
  aaa: 'meridiem',
  // Hours
  H: {
    sectionType: 'hours',
    contentType: 'digit',
    maxLength: 2
  },
  HH: 'hours',
  h: {
    sectionType: 'hours',
    contentType: 'digit',
    maxLength: 2
  },
  hh: 'hours',
  // Minutes
  m: {
    sectionType: 'minutes',
    contentType: 'digit',
    maxLength: 2
  },
  mm: 'minutes',
  // Seconds
  s: {
    sectionType: 'seconds',
    contentType: 'digit',
    maxLength: 2
  },
  ss: 'seconds'
};
const defaultFormats = {
  year: 'yyyy',
  month: 'LLLL',
  monthShort: 'MMM',
  dayOfMonth: 'd',
  weekday: 'EEEE',
  weekdayShort: 'EEEEEE',
  hours24h: 'HH',
  hours12h: 'hh',
  meridiem: 'aa',
  minutes: 'mm',
  seconds: 'ss',
  fullDate: 'PP',
  fullDateWithWeekday: 'PPPP',
  keyboardDate: 'P',
  shortDate: 'MMM d',
  normalDate: 'd MMMM',
  normalDateWithWeekday: 'EEE, MMM d',
  monthAndYear: 'LLLL yyyy',
  monthAndDate: 'MMMM d',
  fullTime: 'p',
  fullTime12h: 'hh:mm aa',
  fullTime24h: 'HH:mm',
  fullDateTime: 'PP p',
  fullDateTime12h: 'PP hh:mm aa',
  fullDateTime24h: 'PP HH:mm',
  keyboardDateTime: 'P p',
  keyboardDateTime12h: 'P hh:mm aa',
  keyboardDateTime24h: 'P HH:mm'
};

/**
 * Based on `@date-io/date-fns`
 *
 * MIT License
 *
 * Copyright (c) 2017 Dmitriy Kovalenko
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
class AdapterDateFns {
  constructor({
    locale: _locale,
    formats
  } = {}) {
    this.isMUIAdapter = true;
    this.isTimezoneCompatible = false;
    this.lib = 'date-fns';
    this.locale = void 0;
    this.formats = void 0;
    this.formatTokenMap = formatTokenMap;
    this.escapedCharacters = {
      start: "'",
      end: "'"
    };
    this.date = value => {
      if (typeof value === 'undefined') {
        return new Date();
      }
      if (value === null) {
        return null;
      }
      return new Date(value);
    };
    this.dateWithTimezone = value => {
      return this.date(value);
    };
    this.getTimezone = () => {
      return 'default';
    };
    this.setTimezone = value => {
      return value;
    };
    this.toJsDate = value => {
      return value;
    };
    this.parseISO = isoString => {
      return (0, _parseISO.default)(isoString);
    };
    this.toISO = value => {
      return (0, _formatISO.default)(value, {
        format: 'extended'
      });
    };
    this.parse = (value, format) => {
      if (value === '') {
        return null;
      }
      return (0, _parse.default)(value, format, new Date(), {
        locale: this.locale
      });
    };
    this.getCurrentLocaleCode = () => {
      return this.locale?.code || 'en-US';
    };
    // Note: date-fns input types are more lenient than this adapter, so we need to expose our more
    // strict signature and delegate to the more lenient signature. Otherwise, we have downstream type errors upon usage.
    this.is12HourCycleInCurrentLocale = () => {
      if (this.locale) {
        return /a/.test(this.locale.formatLong.time());
      }

      // By default, date-fns is using en-US locale with am/pm enabled
      return true;
    };
    this.expandFormat = format => {
      const longFormatRegexp = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g;

      // @see https://github.com/date-fns/date-fns/blob/master/src/format/index.js#L31
      return format.match(longFormatRegexp).map(token => {
        const firstCharacter = token[0];
        if (firstCharacter === 'p' || firstCharacter === 'P') {
          const longFormatter = _longFormatters.default[firstCharacter];
          const locale = this.locale || _enUS.default;
          return longFormatter(token, locale.formatLong, {});
        }
        return token;
      }).join('');
    };
    this.getFormatHelperText = format => {
      return this.expandFormat(format).replace(/(aaa|aa|a)/g, '(a|p)m').toLocaleLowerCase();
    };
    this.isNull = value => {
      return value === null;
    };
    this.isValid = value => {
      return (0, _isValid.default)(this.date(value));
    };
    this.format = (value, formatKey) => {
      return this.formatByString(value, this.formats[formatKey]);
    };
    this.formatByString = (value, formatString) => {
      return (0, _format.default)(value, formatString, {
        locale: this.locale
      });
    };
    this.formatNumber = numberToFormat => {
      return numberToFormat;
    };
    this.getDiff = (value, comparing, unit) => {
      switch (unit) {
        case 'years':
          return (0, _differenceInYears.default)(value, this.date(comparing));
        case 'quarters':
          return (0, _differenceInQuarters.default)(value, this.date(comparing));
        case 'months':
          return (0, _differenceInMonths.default)(value, this.date(comparing));
        case 'weeks':
          return (0, _differenceInWeeks.default)(value, this.date(comparing));
        case 'days':
          return (0, _differenceInDays.default)(value, this.date(comparing));
        case 'hours':
          return (0, _differenceInHours.default)(value, this.date(comparing));
        case 'minutes':
          return (0, _differenceInMinutes.default)(value, this.date(comparing));
        case 'seconds':
          return (0, _differenceInSeconds.default)(value, this.date(comparing));
        default:
          {
            return (0, _differenceInMilliseconds.default)(value, this.date(comparing));
          }
      }
    };
    this.isEqual = (value, comparing) => {
      if (value === null && comparing === null) {
        return true;
      }
      return (0, _isEqual.default)(value, comparing);
    };
    this.isSameYear = (value, comparing) => {
      return (0, _isSameYear.default)(value, comparing);
    };
    this.isSameMonth = (value, comparing) => {
      return (0, _isSameMonth.default)(value, comparing);
    };
    this.isSameDay = (value, comparing) => {
      return (0, _isSameDay.default)(value, comparing);
    };
    this.isSameHour = (value, comparing) => {
      return (0, _isSameHour.default)(value, comparing);
    };
    this.isAfter = (value, comparing) => {
      return (0, _isAfter.default)(value, comparing);
    };
    this.isAfterYear = (value, comparing) => {
      return (0, _isAfter.default)(value, (0, _endOfYear.default)(comparing));
    };
    this.isAfterDay = (value, comparing) => {
      return (0, _isAfter.default)(value, (0, _endOfDay.default)(comparing));
    };
    this.isBefore = (value, comparing) => {
      return (0, _isBefore.default)(value, comparing);
    };
    this.isBeforeYear = (value, comparing) => {
      return (0, _isBefore.default)(value, (0, _startOfYear.default)(comparing));
    };
    this.isBeforeDay = (value, comparing) => {
      return (0, _isBefore.default)(value, (0, _startOfDay.default)(comparing));
    };
    this.isWithinRange = (value, [start, end]) => {
      return (0, _isWithinInterval.default)(value, {
        start,
        end
      });
    };
    this.startOfYear = value => {
      return (0, _startOfYear.default)(value);
    };
    this.startOfMonth = value => {
      return (0, _startOfMonth.default)(value);
    };
    this.startOfWeek = value => {
      return (0, _startOfWeek.default)(value, {
        locale: this.locale
      });
    };
    this.startOfDay = value => {
      return (0, _startOfDay.default)(value);
    };
    this.endOfYear = value => {
      return (0, _endOfYear.default)(value);
    };
    this.endOfMonth = value => {
      return (0, _endOfMonth.default)(value);
    };
    this.endOfWeek = value => {
      return (0, _endOfWeek.default)(value, {
        locale: this.locale
      });
    };
    this.endOfDay = value => {
      return (0, _endOfDay.default)(value);
    };
    this.addYears = (value, amount) => {
      return (0, _addYears.default)(value, amount);
    };
    this.addMonths = (value, amount) => {
      return (0, _addMonths.default)(value, amount);
    };
    this.addWeeks = (value, amount) => {
      return (0, _addWeeks.default)(value, amount);
    };
    this.addDays = (value, amount) => {
      return (0, _addDays.default)(value, amount);
    };
    this.addHours = (value, amount) => {
      return (0, _addHours.default)(value, amount);
    };
    this.addMinutes = (value, amount) => {
      return (0, _addMinutes.default)(value, amount);
    };
    this.addSeconds = (value, amount) => {
      return (0, _addSeconds.default)(value, amount);
    };
    this.getYear = value => {
      return (0, _getYear.default)(value);
    };
    this.getMonth = value => {
      return (0, _getMonth.default)(value);
    };
    this.getDate = value => {
      return (0, _getDate.default)(value);
    };
    this.getHours = value => {
      return (0, _getHours.default)(value);
    };
    this.getMinutes = value => {
      return (0, _getMinutes.default)(value);
    };
    this.getSeconds = value => {
      return (0, _getSeconds.default)(value);
    };
    this.getMilliseconds = value => {
      return (0, _getMilliseconds.default)(value);
    };
    this.setYear = (value, year) => {
      return (0, _setYear.default)(value, year);
    };
    this.setMonth = (value, month) => {
      return (0, _setMonth.default)(value, month);
    };
    this.setDate = (value, date) => {
      return (0, _setDate.default)(value, date);
    };
    this.setHours = (value, hours) => {
      return (0, _setHours.default)(value, hours);
    };
    this.setMinutes = (value, minutes) => {
      return (0, _setMinutes.default)(value, minutes);
    };
    this.setSeconds = (value, seconds) => {
      return (0, _setSeconds.default)(value, seconds);
    };
    this.setMilliseconds = (value, milliseconds) => {
      return (0, _setMilliseconds.default)(value, milliseconds);
    };
    this.getDaysInMonth = value => {
      return (0, _getDaysInMonth.default)(value);
    };
    this.getNextMonth = value => {
      return (0, _addMonths.default)(value, 1);
    };
    this.getPreviousMonth = value => {
      return (0, _addMonths.default)(value, -1);
    };
    this.getMonthArray = value => {
      const firstMonth = (0, _startOfYear.default)(value);
      const monthArray = [firstMonth];
      while (monthArray.length < 12) {
        const prevMonth = monthArray[monthArray.length - 1];
        monthArray.push(this.getNextMonth(prevMonth));
      }
      return monthArray;
    };
    this.mergeDateAndTime = (dateParam, timeParam) => {
      return this.setSeconds(this.setMinutes(this.setHours(dateParam, this.getHours(timeParam)), this.getMinutes(timeParam)), this.getSeconds(timeParam));
    };
    this.getWeekdays = () => {
      const now = new Date();
      return (0, _eachDayOfInterval.default)({
        start: (0, _startOfWeek.default)(now, {
          locale: this.locale
        }),
        end: (0, _endOfWeek.default)(now, {
          locale: this.locale
        })
      }).map(day => this.formatByString(day, 'EEEEEE'));
    };
    this.getWeekArray = value => {
      const start = (0, _startOfWeek.default)((0, _startOfMonth.default)(value), {
        locale: this.locale
      });
      const end = (0, _endOfWeek.default)((0, _endOfMonth.default)(value), {
        locale: this.locale
      });
      let count = 0;
      let current = start;
      const nestedWeeks = [];
      while ((0, _isBefore.default)(current, end)) {
        const weekNumber = Math.floor(count / 7);
        nestedWeeks[weekNumber] = nestedWeeks[weekNumber] || [];
        nestedWeeks[weekNumber].push(current);
        current = (0, _addDays.default)(current, 1);
        count += 1;
      }
      return nestedWeeks;
    };
    this.getWeekNumber = value => {
      return (0, _getWeek.default)(value, {
        locale: this.locale
      });
    };
    this.getYearRange = (start, end) => {
      const startDate = (0, _startOfYear.default)(start);
      const endDate = (0, _endOfYear.default)(end);
      const years = [];
      let current = startDate;
      while ((0, _isBefore.default)(current, endDate)) {
        years.push(current);
        current = (0, _addYears.default)(current, 1);
      }
      return years;
    };
    this.getMeridiemText = ampm => {
      return ampm === 'am' ? 'AM' : 'PM';
    };
    this.locale = _locale;
    this.formats = (0, _extends2.default)({}, defaultFormats, formats);
  }
}
exports.AdapterDateFns = AdapterDateFns;