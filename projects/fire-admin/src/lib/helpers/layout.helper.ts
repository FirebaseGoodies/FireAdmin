//import * as $ from 'jquery'; // throw "Cannot call a namespace ('$')" error on build
declare var $: any;
import 'bootstrap';

$.extend($.easing, {
  easeOutSine: function(e, t, a, r, n) {
    return r * Math.sin((t / n) * (Math.PI / 2)) + a;
  }
});

export function initLayout() {
  function t() {
    var e = $(".nav-wrapper"), t = e.height();
    e[0] && e[0].scrollHeight > t ? e.css("overflowY", "auto") : e.css("overflowY", "none");
  }
  $(window).resize(t);
  t();
}

export function initDropdown() {
  ($(".dropdown-toggle") as any).dropdown();
  var e = { duration: 270, easing: "easeOutSine" };
  $(":not(.main-sidebar--icons-only) .dropdown").on(
    "show.bs.dropdown",
    function() {
      $(this)
        .find(".dropdown-menu")
        .first()
        .stop(!0, !0)
        .slideDown(e);
    }
  );
  $(":not(.main-sidebar--icons-only) .dropdown").on(
    "hide.bs.dropdown",
    function() {
      $(this)
        .find(".dropdown-menu")
        .first()
        .stop(!0, !0)
        .slideUp(e);
    }
  );
}

export function toggleSidebar() {
  if ($(".header-navbar").length) {
    ($(".header-navbar") as any).collapse("toggle");
  } else {
    $(".main-sidebar").toggleClass("open");
  }
}
