/* Alerts — Banner + Lightbox + Conversion Tracking */
(function(){

  /* --- Banner --- */
  var banner = document.getElementById('alert-banner');
  if (banner) {
    var slug = banner.dataset.slug;
    if (!sessionStorage.getItem('alert_banner_' + slug)) {
      document.body.classList.add('has-alert-banner');
      alertImpression('banner', slug);
    } else {
      banner.remove();
    }
  }

  /* --- Lightbox --- */
  var lb = document.getElementById('alert-lb');
  if (lb) {
    var slug = lb.dataset.slug;
    var trigger = parseInt(lb.dataset.trigger) || 40;
    if (!sessionStorage.getItem('alert_lb_' + slug)) {
      var fired = false;
      window.addEventListener('scroll', function() {
        if (fired) return;
        var pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
        if (pct >= trigger) {
          fired = true;
          lb.classList.add('show');
          alertImpression('lightbox', slug);
          lb.addEventListener('click', function(e) {
            if (e.target === lb) alertDismiss('lightbox');
          });
        }
      });
    } else {
      lb.remove();
    }
  }

})();

/* --- Dismiss --- */
function alertDismiss(type) {
  if (type === 'banner') {
    var el = document.getElementById('alert-banner');
    if (el) {
      el.classList.add('dismissed');
      sessionStorage.setItem('alert_banner_' + el.dataset.slug, '1');
      setTimeout(function() {
        el.remove();
        document.body.classList.remove('has-alert-banner');
      }, 350);
    }
  }
  if (type === 'lightbox') {
    var el = document.getElementById('alert-lb');
    if (el) {
      el.classList.add('dismissed');
      sessionStorage.setItem('alert_lb_' + el.dataset.slug, '1');
      setTimeout(function() { el.remove(); }, 350);
    }
  }
}

/* --- Conversion Tracking --- */
function alertImpression(type, slug) {
  /* GA4 event */
  if (typeof gtag === 'function') {
    gtag('event', 'alert_impression', {
      alert_type: type,
      post_slug: slug
    });
  }
  /* Local counter */
  var key = 'alert_stats_' + type + '_' + slug;
  var stats = JSON.parse(localStorage.getItem(key) || '{"impressions":0,"clicks":0}');
  stats.impressions++;
  localStorage.setItem(key, JSON.stringify(stats));
}

function alertTrack(type, slug) {
  /* GA4 event */
  if (typeof gtag === 'function') {
    gtag('event', 'alert_click', {
      alert_type: type,
      post_slug: slug
    });
  }
  /* Local counter */
  var key = 'alert_stats_' + type + '_' + slug;
  var stats = JSON.parse(localStorage.getItem(key) || '{"impressions":0,"clicks":0}');
  stats.clicks++;
  localStorage.setItem(key, JSON.stringify(stats));
}
