import { Point } from "./Geom";

export var ElementUtil = {
  pageOffset: function(element: HTMLElement): Point {
    var w = window;
    var d = document.documentElement;
    // https://stackoverflow.com/questions/442404/retrieve-the-position-x-y-of-an-html-element
    // https://stackoverflow.com/a/3464890/2496170
    return new Point(
      element.offsetLeft -
        (w.pageXOffset || d.scrollLeft) -
        (d.clientLeft || 0),
      element.offsetTop - (w.pageYOffset || d.scrollTop) - (d.clientTop || 0)
    );
  },
  cancelDuplicateEvent: function(fn, threshhold?, scope?) {
    if (typeof threshhold !== "number") threshhold = 100;
    var last = 0;
    return function() {
      var now = +new Date();
      if (now >= last + threshhold) {
        last = now;
        fn.apply(scope || this, arguments);
      }
    };
  }
};
