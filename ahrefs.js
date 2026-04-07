// Ahrefs Web Analytics for First Try Docs
// Mintlify auto-includes top-level .js files globally on the docs site.

(function() {
  var AHREFS_SCRIPT_ID = 'ahrefs-web-analytics';

  if (document.getElementById(AHREFS_SCRIPT_ID)) return;

  var ahrefsScript = document.createElement('script');
  ahrefsScript.id = AHREFS_SCRIPT_ID;
  ahrefsScript.src = 'https://analytics.ahrefs.com/analytics.js';
  ahrefsScript.setAttribute('data-key', 'bTTMgK9Y0ZSdoA2/lDrvhg');
  document.head.appendChild(ahrefsScript);
})();
