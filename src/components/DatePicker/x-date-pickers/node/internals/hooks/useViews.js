"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useViews = useViews;
var React = _interopRequireWildcard(require("react"));
var _useEventCallback = _interopRequireDefault(require("@mui/utils/useEventCallback"));
var _utils = require("@mui/utils");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
let warnedOnceNotValidView = false;
function useViews({
  onChange,
  onViewChange,
  openTo,
  view: inView,
  views,
  autoFocus,
  focusedView: inFocusedView,
  onFocusedViewChange
}) {
  if (process.env.NODE_ENV !== 'production') {
    if (!warnedOnceNotValidView) {
      if (inView != null && !views.includes(inView)) {
        console.warn(`MUI: \`view="${inView}"\` is not a valid prop.`, `It must be an element of \`views=["${views.join('", "')}"]\`.`);
        warnedOnceNotValidView = true;
      }
      if (inView == null && openTo != null && !views.includes(openTo)) {
        console.warn(`MUI: \`openTo="${openTo}"\` is not a valid prop.`, `It must be an element of \`views=["${views.join('", "')}"]\`.`);
        warnedOnceNotValidView = true;
      }
    }
  }
  const previousOpenTo = React.useRef(openTo);
  const previousViews = React.useRef(views);
  const defaultView = React.useRef(views.includes(openTo) ? openTo : views[0]);
  const [view, setView] = (0, _utils.unstable_useControlled)({
    name: 'useViews',
    state: 'view',
    controlled: inView,
    default: defaultView.current
  });
  const defaultFocusedView = React.useRef(autoFocus ? view : null);
  const [focusedView, setFocusedView] = (0, _utils.unstable_useControlled)({
    name: 'useViews',
    state: 'focusedView',
    controlled: inFocusedView,
    default: defaultFocusedView.current
  });
  React.useEffect(() => {
    // Update the current view when `openTo` or `views` props change
    if (previousOpenTo.current && previousOpenTo.current !== openTo || previousViews.current && previousViews.current.some(previousView => !views.includes(previousView))) {
      setView(views.includes(openTo) ? openTo : views[0]);
      previousViews.current = views;
      previousOpenTo.current = openTo;
    }
  }, [openTo, setView, view, views]);
  const viewIndex = views.indexOf(view);
  const previousView = views[viewIndex - 1] ?? null;
  const nextView = views[viewIndex + 1] ?? null;
  const handleFocusedViewChange = (0, _useEventCallback.default)((viewToFocus, hasFocus) => {
    if (hasFocus) {
      // Focus event
      setFocusedView(viewToFocus);
    } else {
      // Blur event
      setFocusedView(prevFocusedView => viewToFocus === prevFocusedView ? null : prevFocusedView // If false the blur is due to view switching
      );
    }

    onFocusedViewChange?.(viewToFocus, hasFocus);
  });
  const handleChangeView = (0, _useEventCallback.default)(newView => {
    if (newView === view) {
      return;
    }
    setView(newView);
    handleFocusedViewChange(newView, true);
    if (onViewChange) {
      onViewChange(newView);
    }
  });
  const goToNextView = (0, _useEventCallback.default)(() => {
    if (nextView) {
      handleChangeView(nextView);
    }
    handleFocusedViewChange(nextView, true);
  });
  const setValueAndGoToNextView = (0, _useEventCallback.default)((value, currentViewSelectionState, selectedView) => {
    const isSelectionFinishedOnCurrentView = currentViewSelectionState === 'finish';
    const hasMoreViews = selectedView ?
    // handles case like `DateTimePicker`, where a view might return a `finish` selection state
    // but we it's not the final view given all `views` -> overall selection state should be `partial`.
    views.indexOf(selectedView) < views.length - 1 : Boolean(nextView);
    const globalSelectionState = isSelectionFinishedOnCurrentView && hasMoreViews ? 'partial' : currentViewSelectionState;
    onChange(value, globalSelectionState);
    if (isSelectionFinishedOnCurrentView) {
      goToNextView();
    }
  });
  const setValueAndGoToView = (0, _useEventCallback.default)((value, newView, selectedView) => {
    onChange(value, newView ? 'partial' : 'finish', selectedView);
    if (newView) {
      handleChangeView(newView);
      handleFocusedViewChange(newView, true);
    }
  });
  return {
    view,
    setView: handleChangeView,
    focusedView,
    setFocusedView: handleFocusedViewChange,
    nextView,
    previousView,
    // Always return up to date default view instead of the initial one (i.e. defaultView.current)
    defaultView: views.includes(openTo) ? openTo : views[0],
    goToNextView,
    setValueAndGoToNextView,
    setValueAndGoToView
  };
}