"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPickersLayoutUtilityClass = getPickersLayoutUtilityClass;
exports.pickersLayoutClasses = void 0;
var _utils = require("@mui/utils");
function getPickersLayoutUtilityClass(slot) {
  return (0, _utils.unstable_generateUtilityClass)('MuiPickersLayout', slot);
}
const pickersLayoutClasses = exports.pickersLayoutClasses = (0, _utils.unstable_generateUtilityClasses)('MuiPickersLayout', ['root', 'landscape', 'contentWrapper', 'toolbar', 'actionBar', 'shortcuts']);