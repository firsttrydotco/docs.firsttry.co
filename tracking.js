// Custom PostHog tracking for First Try Docs
// Note: PostHog is initialized by Mintlify via docs.json integration
// This file only adds custom event tracking

(function() {
  // Wait for Mintlify's PostHog to be fully loaded
  function waitForPostHog(callback, attempts) {
    attempts = attempts || 0;
    if (attempts > 50) {
      console.warn('PostHog not available after 5s, custom tracking disabled');
      return;
    }
    if (window.posthog && typeof window.posthog.capture === 'function') {
      callback();
    } else {
      setTimeout(function() { waitForPostHog(callback, attempts + 1); }, 100);
    }
  }

  waitForPostHog(function() {
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
  });
})();
