"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AdapterLuxon = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _luxon = require("luxon");
/* eslint-disable class-methods-use-this */

const formatTokenMap = {
  // Year
  y: {
    sectionType: 'year',
    contentType: 'digit',
    maxLength: 4
  },
  yy: 'year',
  yyyy: {
    sectionType: 'year',
    contentType: 'digit',
    maxLength: 4
  },
  // Month
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
  M: {
    sectionType: 'month',
    contentType: 'digit',
    maxLength: 2
  },
  MM: 'month',
  MMM: {
    sectionType: 'month',
    contentType: 'letter'
  },
  MMMM: {
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
  // Day of the week
  c: {
    sectionType: 'weekDay',
    contentType: 'digit',
    maxLength: 1
  },
  ccc: {
    sectionType: 'weekDay',
    contentType: 'letter'
  },
  cccc: {
    sectionType: 'weekDay',
    contentType: 'letter'
  },
  E: {
    sectionType: 'weekDay',
    contentType: 'digit',
    maxLength: 2
  },
  EEE: {
    sectionType: 'weekDay',
    contentType: 'letter'
  },
  EEEE: {
    sectionType: 'weekDay',
    contentType: 'letter'
  },
  // Meridiem
  a: 'meridiem',
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
  weekday: 'cccc',
  weekdayShort: 'ccccc',
  hours24h: 'HH',
  hours12h: 'hh',
  meridiem: 'a',
  minutes: 'mm',
  seconds: 'ss',
  fullDate: 'DD',
  fullDateWithWeekday: 'DDDD',
  keyboardDate: 'D',
  shortDate: 'MMM d',
  normalDate: 'd MMMM',
  normalDateWithWeekday: 'EEE, MMM d',
  monthAndYear: 'LLLL yyyy',
  monthAndDate: 'MMMM d',
  fullTime: 't',
  fullTime12h: 'hh:mm a',
  fullTime24h: 'HH:mm',
  fullDateTime: 'ff',
  fullDateTime12h: 'DD, hh:mm a',
  fullDateTime24h: 'DD, T',
  keyboardDateTime: 'D t',
  keyboardDateTime12h: 'D hh:mm a',
  keyboardDateTime24h: 'D T'
};

/**
 * Based on `@date-io/luxon`
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
class AdapterLuxon {
  constructor({
    locale,
    formats
  } = {}) {
    this.isMUIAdapter = true;
    this.isTimezoneCompatible = true;
    this.lib = 'luxon';
    this.locale = void 0;
    this.formats = void 0;
    this.escapedCharacters = {
      start: "'",
      end: "'"
    };
    this.formatTokenMap = formatTokenMap;
    this.setLocaleToValue = value => {
      const expectedLocale = this.getCurrentLocaleCode();
      if (expectedLocale === value.locale) {
        return value;
      }
      return value.setLocale(expectedLocale);
    };
    this.date = value => {
      if (typeof value === 'undefined') {
        return _luxon.DateTime.local();
      }
      if (value === null) {
        return null;
      }
      if (typeof value === 'string') {
        // @ts-ignore
        return _luxon.DateTime.fromJSDate(new Date(value), {
          locale: this.locale
        });
      }
      if (_luxon.DateTime.isDateTime(value)) {
        return value;
      }

      // @ts-ignore
      return _luxon.DateTime.fromJSDate(value, {
        locale: this.locale
      });
    };
    this.dateWithTimezone = (value, timezone) => {
      if (value === null) {
        return null;
      }
      if (typeof value === 'undefined') {
        // @ts-ignore
        return _luxon.DateTime.fromJSDate(new Date(), {
          locale: this.locale,
          zone: timezone
        });
      }

      // @ts-ignore
      return _luxon.DateTime.fromISO(value, {
        locale: this.locale,
        zone: timezone
      });
    };
    this.getTimezone = value => {
      // When using the system zone, we want to return "system", not something like "Europe/Paris"
      if (value.zone.type === 'system') {
        return 'system';
      }
      return value.zoneName;
    };
    this.setTimezone = (value, timezone) => {
      if (!value.zone.equals(_luxon.Info.normalizeZone(timezone))) {
        return value.setZone(timezone);
      }
      return value;
    };
    this.toJsDate = value => {
      return value.toJSDate();
    };
    this.parseISO = isoString => {
      return _luxon.DateTime.fromISO(isoString);
    };
    this.toISO = value => {
      return value.toUTC().toISO({
        format: 'extended'
      });
    };
    this.parse = (value, formatString) => {
      if (value === '') {
        return null;
      }
      return _luxon.DateTime.fromFormat(value, formatString, {
        locale: this.locale
      });
    };
    this.getCurrentLocaleCode = () => {
      return this.locale;
    };
    /* istanbul ignore next */
    this.is12HourCycleInCurrentLocale = () => {
      if (typeof Intl === 'undefined' || typeof Intl.DateTimeFormat === 'undefined') {
        return true; // Luxon defaults to en-US if Intl not found
      }

      return Boolean(new Intl.DateTimeFormat(this.locale, {
        hour: 'numeric'
      })?.resolvedOptions()?.hour12);
    };
    this.expandFormat = format => {
      // Extract escaped section to avoid extending them
      const longFormatRegexp = /''|'(''|[^'])+('|$)|[^']*/g;
      return format.match(longFormatRegexp).map(token => {
        const firstCharacter = token[0];
        if (firstCharacter === "'") {
          return token;
        }
        return _luxon.DateTime.expandFormat(token, {
          locale: this.locale
        });
      }).join('')
      // The returned format can contain `yyyyy` which means year between 4 and 6 digits.
      // This value is supported by luxon parser but not luxon formatter.
      // To avoid conflicts, we replace it by 4 digits which is enough for most use-cases.
      .replace('yyyyy', 'yyyy');
    };
    this.getFormatHelperText = format => {
      return this.expandFormat(format).replace(/(a)/g, '(a|p)m').toLocaleLowerCase();
    };
    this.isNull = value => {
      return value === null;
    };
    this.isValid = value => {
      if (_luxon.DateTime.isDateTime(value)) {
        return value.isValid;
      }
      if (value === null) {
        return false;
      }
      return this.isValid(this.date(value));
    };
    this.format = (value, formatKey) => {
      return this.formatByString(value, this.formats[formatKey]);
    };
    this.formatByString = (value, format) => {
      return value.setLocale(this.locale).toFormat(format);
    };
    this.formatNumber = numberToFormat => {
      return numberToFormat;
    };
    this.getDiff = (value, comparing, unit) => {
      if (typeof comparing === 'string') {
        comparing = _luxon.DateTime.fromJSDate(new Date(comparing));
      }
      if (unit) {
        return Math.floor(value.diff(comparing).as(unit));
      }
      return value.diff(comparing).as('millisecond');
    };
    this.isEqual = (value, comparing) => {
      if (value === null && comparing === null) {
        return true;
      }

      // Make sure that null will not be passed to this.date
      if (value === null || comparing === null) {
        return false;
      }
      return +this.date(value) === +this.date(comparing);
    };
    this.isSameYear = (value, comparing) => {
      const comparingInValueTimezone = this.setTimezone(comparing, this.getTimezone(value));
      return value.hasSame(comparingInValueTimezone, 'year');
    };
    this.isSameMonth = (value, comparing) => {
      const comparingInValueTimezone = this.setTimezone(comparing, this.getTimezone(value));
      return value.hasSame(comparingInValueTimezone, 'month');
    };
    this.isSameDay = (value, comparing) => {
      const comparingInValueTimezone = this.setTimezone(comparing, this.getTimezone(value));
      return value.hasSame(comparingInValueTimezone, 'day');
    };
    this.isSameHour = (value, comparing) => {
      const comparingInValueTimezone = this.setTimezone(comparing, this.getTimezone(value));
      return value.hasSame(comparingInValueTimezone, 'hour');
    };
    this.isAfter = (value, comparing) => {
      return value > comparing;
    };
    this.isAfterYear = (value, comparing) => {
      const comparingInValueTimezone = this.setTimezone(comparing, this.getTimezone(value));
      const diff = value.diff(comparingInValueTimezone.endOf('year'), 'years').toObject();
      return diff.years > 0;
    };
    this.isAfterDay = (value, comparing) => {
      const comparingInValueTimezone = this.setTimezone(comparing, this.getTimezone(value));
      const diff = value.diff(comparingInValueTimezone.endOf('day'), 'days').toObject();
      return diff.days > 0;
    };
    this.isBefore = (value, comparing) => {
      return value < comparing;
    };
    this.isBeforeYear = (value, comparing) => {
      const comparingInValueTimezone = this.setTimezone(comparing, this.getTimezone(value));
      const diff = value.diff(comparingInValueTimezone.startOf('year'), 'years').toObject();
      return diff.years < 0;
    };
    this.isBeforeDay = (value, comparing) => {
      const comparingInValueTimezone = this.setTimezone(comparing, this.getTimezone(value));
      const diff = value.diff(comparingInValueTimezone.startOf('day'), 'days').toObject();
      return diff.days < 0;
    };
    this.isWithinRange = (value, [start, end]) => {
      return value.equals(start) || value.equals(end) || this.isAfter(value, start) && this.isBefore(value, end);
    };
    this.startOfYear = value => {
      return value.startOf('year');
    };
    this.startOfMonth = value => {
      return value.startOf('month');
    };
    this.startOfWeek = value => {
      return value.startOf('week');
    };
    this.startOfDay = value => {
      return value.startOf('day');
    };
    this.endOfYear = value => {
      return value.endOf('year');
    };
    this.endOfMonth = value => {
      return value.endOf('month');
    };
    this.endOfWeek = value => {
      return value.endOf('week');
    };
    this.endOfDay = value => {
      return value.endOf('day');
    };
    this.addYears = (value, amount) => {
      return value.plus({
        years: amount
      });
    };
    this.addMonths = (value, amount) => {
      return value.plus({
        months: amount
      });
    };
    this.addWeeks = (value, amount) => {
      return value.plus({
        weeks: amount
      });
    };
    this.addDays = (value, amount) => {
      return value.plus({
        days: amount
      });
    };
    this.addHours = (value, amount) => {
      return value.plus({
        hours: amount
      });
    };
    this.addMinutes = (value, amount) => {
      return value.plus({
        minutes: amount
      });
    };
    this.addSeconds = (value, amount) => {
      return value.plus({
        seconds: amount
      });
    };
    this.getYear = value => {
      return value.get('year');
    };
    this.getMonth = value => {
      // See https://github.com/moment/luxon/blob/master/docs/moment.md#major-functional-differences
      return value.get('month') - 1;
    };
    this.getDate = value => {
      return value.get('day');
    };
    this.getHours = value => {
      return value.get('hour');
    };
    this.getMinutes = value => {
      return value.get('minute');
    };
    this.getSeconds = value => {
      return value.get('second');
    };
    this.getMilliseconds = value => {
      return value.get('millisecond');
    };
    this.setYear = (value, year) => {
      return value.set({
        year
      });
    };
    this.setMonth = (value, month) => {
      return value.set({
        month: month + 1
      });
    };
    this.setDate = (value, date) => {
      return value.set({
        day: date
      });
    };
    this.setHours = (value, hours) => {
      return value.set({
        hour: hours
      });
    };
    this.setMinutes = (value, minutes) => {
      return value.set({
        minute: minutes
      });
    };
    this.setSeconds = (value, seconds) => {
      return value.set({
        second: seconds
      });
    };
    this.setMilliseconds = (value, milliseconds) => {
      return value.set({
        millisecond: milliseconds
      });
    };
    this.getDaysInMonth = value => {
      return value.daysInMonth;
    };
    this.getNextMonth = value => {
      return value.plus({
        months: 1
      });
    };
    this.getPreviousMonth = value => {
      return value.minus({
        months: 1
      });
    };
    this.getMonthArray = value => {
      const firstMonth = value.startOf('year');
      const monthArray = [firstMonth];
      while (monthArray.length < 12) {
        const prevMonth = monthArray[monthArray.length - 1];
        monthArray.push(this.addMonths(prevMonth, 1));
      }
      return monthArray;
    };
    this.mergeDateAndTime = (dateParam, timeParam) => {
      return dateParam.set({
        second: timeParam.second,
        hour: timeParam.hour,
        minute: timeParam.minute
      });
    };
    this.getWeekdays = () => {
      return _luxon.Info.weekdaysFormat('narrow', {
        locale: this.locale
      });
    };
    this.getWeekArray = value => {
      const cleanValue = this.setLocaleToValue(value);
      const {
        days
      } = cleanValue.endOf('month').endOf('week').diff(cleanValue.startOf('month').startOf('week'), 'days').toObject();
      const weeks = [];
      new Array(Math.round(days)).fill(0).map((_, i) => i).map(day => cleanValue.startOf('month').startOf('week').plus({
        days: day
      })).forEach((v, i) => {
        if (i === 0 || i % 7 === 0 && i > 6) {
          weeks.push([v]);
          return;
        }
        weeks[weeks.length - 1].push(v);
      });
      return weeks;
    };
    this.getWeekNumber = value => {
      return value.weekNumber;
    };
    this.getYearRange = (start, end) => {
      const startDate = start.startOf('year');
      const endDate = end.endOf('year');
      let current = startDate;
      const years = [];
      while (current < endDate) {
        years.push(current);
        current = current.plus({
          year: 1
        });
      }
      return years;
    };
    this.getMeridiemText = ampm => {
      return _luxon.Info.meridiems({
        locale: this.locale
      }).find(v => v.toLowerCase() === ampm.toLowerCase());
    };
    this.locale = locale || 'en-US';
    this.formats = (0, _extends2.default)({}, defaultFormats, formats);
  }
}
exports.AdapterLuxon = AdapterLuxon;