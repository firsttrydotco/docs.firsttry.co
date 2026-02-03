// Initialize PostHog stub (queue for events before PostHog loads)
!function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host.replace(/\.i\./,".").replace(/\.com$/,".com/static/array.js"),(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys onSessionId setPersonProperties".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);

// Initialize with same config as Mintlify
posthog.init('phc_pxd53viYzYm5cBw7gEjhVO6ZamIGyaXQ7aM0gwzwUqs', {
  api_host: 'https://eu.i.posthog.com',
  persistence: 'localStorage',
  capture_pageview: false, // Mintlify already captures pageviews
  capture_pageleave: false
});

(function() {
  var scrollTracked = false;
  var timeTracked = false;
  var pageUrl = window.location.href;
  var pageTitle = document.title;

  // 1. Track Scroll 75%
  function getScrollPercent() {
    var h = document.documentElement;
    var b = document.body;
    var st = 'scrollTop';
    var sh = 'scrollHeight';
    var clientHeight = h.clientHeight || b.clientHeight;
    var scrollHeight = Math.max(h[sh] || 0, b[sh] || 0);
    var scrollTop = h[st] || b[st] || 0;
    if (scrollHeight <= clientHeight) return 100;
    return (scrollTop / (scrollHeight - clientHeight)) * 100;
  }

  window.addEventListener('scroll', function() {
    if (!scrollTracked && getScrollPercent() >= 75) {
      scrollTracked = true;
      posthog.capture('Scroll 75%', {
        page_url: pageUrl,
        page_title: pageTitle
      });
    }
  });

  // 2. Track Time on Page > 2 min
  setTimeout(function() {
    if (!timeTracked && document.visibilityState !== 'hidden') {
      timeTracked = true;
      posthog.capture('Time on Page > 2 min', {
        page_url: pageUrl,
        page_title: pageTitle
      });
    }
  }, 120000);

  // 3. Track CTA Clicks
  document.addEventListener('click', function(e) {
    var target = e.target.closest('a, button');
    if (!target) return;

    var isCTA = false;
    var ctaName = '';
    var href = target.href || '';
    var text = (target.textContent || '').trim();
    var className = (target.className || '').toLowerCase();

    // Topbar CTA button (Work with me)
    if (text.includes('Work with me') || (href && href.includes('mailto:tim@firsttry.co'))) {
      isCTA = true;
      ctaName = 'Topbar CTA - Work with me';
    }

    // Links to external action pages (mailto, calendly, typeform)
    if (!isCTA && href) {
      if (href.includes('mailto:') || href.includes('calendly') || href.includes('typeform')) {
        isCTA = true;
        ctaName = text || 'External CTA';
      }
    }

    // Any element with CTA-like keywords
    if (!isCTA) {
      var ctaKeywords = ['cta', 'get started', 'sign up', 'contact', 'book', 'schedule'];
      var lowerText = text.toLowerCase();
      for (var i = 0; i < ctaKeywords.length; i++) {
        if (lowerText.includes(ctaKeywords[i]) || className.includes(ctaKeywords[i])) {
          isCTA = true;
          ctaName = text;
          break;
        }
      }
    }

    if (isCTA) {
      posthog.capture('Clic CTA', {
        cta_name: ctaName,
        cta_url: href || null,
        page_url: pageUrl,
        page_title: pageTitle
      });
    }
  });

  // Handle SPA navigation (Mintlify uses Next.js)
  var lastUrl = pageUrl;
  new MutationObserver(function() {
    if (window.location.href !== lastUrl) {
      lastUrl = window.location.href;
      pageUrl = lastUrl;
      pageTitle = document.title;
      scrollTracked = false;
      // Don't reset timeTracked - it's per session visit
    }
  }).observe(document.body, { childList: true, subtree: true });
})();
