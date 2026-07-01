/* ============================================================
   EarthGrit – referrals.js
   Lightweight Ambassador / Referral tracking for static sites
   ------------------------------------------------------------
   PURPOSE
   - Read ?ref=emma style referral links
   - Validate the referral ID safely
   - Store only the minimum data needed for attribution
   - Respect cookie consent where available
   - Avoid overwriting an existing referral by default
   - Expose reusable helper functions for future integrations

   SAFE FOR STATIC GITHUB PAGES
   - No backend required
   - No authentication required
   - No frameworks
   - No external dependencies

   IMPORTANT
   1. Add this file as a normal external script in index.html
   2. Load it BEFORE analytics.js if analytics.js may need its helpers,
      or AFTER analytics.js if you only need the consent key.
   3. Do NOT add inline script blocks to index.html.

   TODO
   - Replace AMBASSADOR_GOOGLE_FORM_URL with your real Google Form URL
   - Update privacy.html with a referral tracking section
   ============================================================ */

(function () {
  'use strict';

  /* ============================================================
     CONFIG
     ============================================================ */
  var REFERRAL_CONFIG = {
    REF_PARAM: 'ref',
    STORAGE_KEY: 'earthgritReferral',
    EXPIRY_DAYS: 30,

    /* By default, keep the first valid referral and ignore later ones.
       Change to true if you later want "last referral wins". */
    ALLOW_REFERRAL_OVERWRITE: false,

    /* Set to true if referral storage should only happen after consent.
       This is the safer default for non-essential attribution storage. */
    REQUIRE_CONSENT_FOR_REFERRAL_STORAGE: true,

    /* Your existing site documentation references cookieConsent in localStorage.
       Adjust this key only if analytics.js uses a different one. */
    CONSENT_STORAGE_KEY: 'cookieConsent',

    /* Accepted consent values. Edit if your analytics.js stores different strings. */
    ACCEPT_VALUES: ['accepted', 'accept', 'yes', 'true'],
    DECLINE_VALUES: ['declined', 'decline', 'no', 'false'],

    /* Replace this with your actual Google Form URL later. */
    AMBASSADOR_GOOGLE_FORM_URL: 'https://forms.gle/gh6QiDjiY3iXaMT3A',

    /* Optional query parameter cleanup after capture */
    REMOVE_REF_FROM_URL_AFTER_CAPTURE: false,

    /* Validation rule: letters, numbers, underscore, hyphen only */
    REFERRAL_ID_REGEX: /^[a-zA-Z0-9_-]{2,50}$/,

    /* Future-ready placeholders */
    INTEGRATIONS: {
      googleSheetsEnabled: false,
      googleAppsScriptEndpoint: '',
      stripeEnabled: false,
      shopifyEnabled: false,
      wooCommerceEnabled: false,
      restApiEndpoint: ''
    }
  };

  /* ============================================================
     INTERNAL HELPERS
     ============================================================ */
  function nowMs() {
    return Date.now();
  }

  function daysToMs(days) {
    return days * 24 * 60 * 60 * 1000;
  }

  function safeJsonParse(value) {
    if (!value) return null;
    try {
      return JSON.parse(value);
    } catch (err) {
      return null;
    }
  }

  function normaliseConsentValue(value) {
    if (value === null || value === undefined) return '';
    return String(value).trim().toLowerCase();
  }

  function getConsentValue() {
    try {
      return localStorage.getItem(REFERRAL_CONFIG.CONSENT_STORAGE_KEY);
    } catch (err) {
      return null;
    }
  }

  function isConsentAccepted() {
    var value = normaliseConsentValue(getConsentValue());
    return REFERRAL_CONFIG.ACCEPT_VALUES.indexOf(value) !== -1;
  }

  function isConsentDeclined() {
    var value = normaliseConsentValue(getConsentValue());
    return REFERRAL_CONFIG.DECLINE_VALUES.indexOf(value) !== -1;
  }

  function hasReferralConsent() {
    if (!REFERRAL_CONFIG.REQUIRE_CONSENT_FOR_REFERRAL_STORAGE) {
      return true;
    }
    return isConsentAccepted();
  }

  function getQueryParam(name) {
    try {
      var url = new URL(window.location.href);
      return url.searchParams.get(name);
    } catch (err) {
      return null;
    }
  }

  function removeQueryParam(paramName) {
    try {
      var url = new URL(window.location.href);
      if (!url.searchParams.has(paramName)) return;
      url.searchParams.delete(paramName);
      window.history.replaceState({}, document.title, url.toString());
    } catch (err) {
      /* no-op */
    }
  }

  function buildReferralRecord(refId) {
    var savedAt = nowMs();
    return {
      referralId: refId,
      savedAt: savedAt,
      expiresAt: savedAt + daysToMs(REFERRAL_CONFIG.EXPIRY_DAYS)
    };
  }

  function isReferralRecordExpired(record) {
    if (!record || !record.expiresAt) return true;
    return nowMs() > Number(record.expiresAt);
  }

  function readStoredReferralRecord() {
    try {
      var raw = localStorage.getItem(REFERRAL_CONFIG.STORAGE_KEY);
      var parsed = safeJsonParse(raw);
      if (!parsed) return null;

      if (
        typeof parsed.referralId !== 'string' ||
        typeof parsed.savedAt !== 'number' ||
        typeof parsed.expiresAt !== 'number'
      ) {
        localStorage.removeItem(REFERRAL_CONFIG.STORAGE_KEY);
        return null;
      }

      if (!isValidReferralId(parsed.referralId)) {
        localStorage.removeItem(REFERRAL_CONFIG.STORAGE_KEY);
        return null;
      }

      if (isReferralRecordExpired(parsed)) {
        localStorage.removeItem(REFERRAL_CONFIG.STORAGE_KEY);
        return null;
      }

      return parsed;
    } catch (err) {
      return null;
    }
  }

  /* ============================================================
     PUBLIC REFERRAL HELPERS
     ============================================================ */

  function isValidReferralId(refId) {
    if (typeof refId !== 'string') return false;
    var value = refId.trim();
    return REFERRAL_CONFIG.REFERRAL_ID_REGEX.test(value);
  }

  function saveReferral(refId, options) {
    options = options || {};

    if (!isValidReferralId(refId)) {
      return {
        ok: false,
        reason: 'invalid_referral_id'
      };
    }

    if (!hasReferralConsent()) {
      return {
        ok: false,
        reason: 'consent_not_granted'
      };
    }

    var cleanRefId = refId.trim();
    var existing = readStoredReferralRecord();
    var allowOverwrite = typeof options.allowOverwrite === 'boolean'
      ? options.allowOverwrite
      : REFERRAL_CONFIG.ALLOW_REFERRAL_OVERWRITE;

    /* Default rule:
       - If a referral already exists, keep it.
       - Change ALLOW_REFERRAL_OVERWRITE to true if you want new referral links
         to replace the existing one later. */
    if (existing && !allowOverwrite) {
      return {
        ok: true,
        reason: 'existing_referral_preserved',
        referral: existing
      };
    }

    var record = buildReferralRecord(cleanRefId);

    try {
      localStorage.setItem(REFERRAL_CONFIG.STORAGE_KEY, JSON.stringify(record));
      return {
        ok: true,
        reason: existing ? 'referral_overwritten' : 'referral_saved',
        referral: record
      };
    } catch (err) {
      return {
        ok: false,
        reason: 'storage_failed'
      };
    }
  }

  function getReferral() {
    var record = readStoredReferralRecord();
    return record ? record.referralId : null;
  }

  function getReferralRecord() {
    return readStoredReferralRecord();
  }

  function clearReferral() {
    try {
      localStorage.removeItem(REFERRAL_CONFIG.STORAGE_KEY);
      return true;
    } catch (err) {
      return false;
    }
  }

  function getReferralAge() {
    var record = readStoredReferralRecord();
    if (!record) return null;
    return nowMs() - record.savedAt;
  }

  function getReferralAgeDays() {
    var age = getReferralAge();
    if (age === null) return null;
    return age / daysToMs(1);
  }

  function getReferralExpiryDate() {
    var record = readStoredReferralRecord();
    if (!record) return null;
    return new Date(record.expiresAt);
  }

  function getReferralRemainingDays() {
    var record = readStoredReferralRecord();
    if (!record) return null;
    var remaining = record.expiresAt - nowMs();
    if (remaining <= 0) return 0;
    return remaining / daysToMs(1);
  }

  function captureReferralFromUrl() {
    var refFromUrl = getQueryParam(REFERRAL_CONFIG.REF_PARAM);

    if (!refFromUrl) {
      return {
        ok: false,
        reason: 'no_ref_in_url'
      };
    }

    if (!isValidReferralId(refFromUrl)) {
      return {
        ok: false,
        reason: 'invalid_ref_in_url'
      };
    }

    var result = saveReferral(refFromUrl);

    if (REFERRAL_CONFIG.REMOVE_REF_FROM_URL_AFTER_CAPTURE && result.ok) {
      removeQueryParam(REFERRAL_CONFIG.REF_PARAM);
    }

    return result;
  }

  /* ============================================================
     APPLICATION CTA HELPERS
     ============================================================ */

  function getAmbassadorApplyUrl() {
    return REFERRAL_CONFIG.AMBASSADOR_GOOGLE_FORM_URL;
  }


function wireAmbassadorApplyLinks() {
  var url = getAmbassadorApplyUrl();
  var links = document.querySelectorAll('[data-ambassador-apply]');

  if (!links.length) return;

  links.forEach(function (link) {
    if (!url) {
      link.setAttribute('href', '#');
      link.setAttribute('aria-disabled', 'true');
      link.addEventListener('click', function (e) {
        e.preventDefault();
        alert('Please add your Google Form URL in referrals.js first.');
      });
      return;
    }

    link.setAttribute('href', url);
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
  });
}


  /* ============================================================
     OPTIONAL CONSENT RETRY
     ============================================================ */

  function tryCaptureReferralAfterConsent() {
    /* This can be called after a user clicks Accept on your cookie banner.
       Example future use:
       - analytics.js sets localStorage.cookieConsent = 'accepted'
       - analytics.js then calls window.EarthGritReferral.tryCaptureReferralAfterConsent()
    */
    return captureReferralFromUrl();
  }

  /* ============================================================
     FUTURE INTEGRATION PLACEHOLDERS
     These are intentionally lightweight stubs so you can integrate
     later without rewriting the architecture.
     ============================================================ */

  function getReferralPayload() {
    var record = getReferralRecord();
    if (!record) return null;

    return {
      referralId: record.referralId,
      savedAt: record.savedAt,
      expiresAt: record.expiresAt,
      ageMs: getReferralAge()
    };
  }

  function syncReferralToGoogleSheets() {
    /* TODO:
       Send getReferralPayload() to a Google Apps Script endpoint
       that writes to Google Sheets.
       Example future flow:
       - Visitor lands with ?ref=emma
       - Referral saved locally
       - On checkout / order submit, send payload + discount code to Apps Script
    */
    return {
      ok: false,
      reason: 'not_implemented'
    };
  }

  function sendReferralToAppsScript() {
    /* TODO:
       Connect to REFERRAL_CONFIG.INTEGRATIONS.googleAppsScriptEndpoint
       using fetch() when you are ready.
    */
    return {
      ok: false,
      reason: 'not_implemented'
    };
  }

  function prepareReferralForStripeCheckout() {
    /* TODO:
       Add referralId / discountCode as metadata when you later connect
       to Stripe Checkout or Payment Links.
    */
    return getReferralPayload();
  }

  function prepareReferralForShopifyDiscount() {
    /* TODO:
       Map referralId to ambassador discount code in a Shopify flow later.
    */
    return getReferralPayload();
  }

  function prepareReferralForWooCommerceOrder() {
    /* TODO:
       Attach referralId as order meta in a future WooCommerce integration.
    */
    return getReferralPayload();
  }

  function sendReferralToApi(endpoint, payload) {
    /* Generic future REST API placeholder */
    return {
      ok: false,
      reason: 'not_implemented',
      endpoint: endpoint || '',
      payload: payload || null
    };
  }

  /* ============================================================
     PUBLIC API
     Expose globally so other files can use these helpers later.
     ============================================================ */
  window.EarthGritReferral = {
    config: REFERRAL_CONFIG,

    isValidReferralId: isValidReferralId,
    saveReferral: saveReferral,
    getReferral: getReferral,
    getReferralRecord: getReferralRecord,
    clearReferral: clearReferral,
    getReferralAge: getReferralAge,
    getReferralAgeDays: getReferralAgeDays,
    getReferralExpiryDate: getReferralExpiryDate,
    getReferralRemainingDays: getReferralRemainingDays,

    hasReferralConsent: hasReferralConsent,
    isConsentAccepted: isConsentAccepted,
    isConsentDeclined: isConsentDeclined,

    captureReferralFromUrl: captureReferralFromUrl,
    tryCaptureReferralAfterConsent: tryCaptureReferralAfterConsent,

    getAmbassadorApplyUrl: getAmbassadorApplyUrl,
    wireAmbassadorApplyLinks: wireAmbassadorApplyLinks,

    getReferralPayload: getReferralPayload,
    syncReferralToGoogleSheets: syncReferralToGoogleSheets,
    sendReferralToAppsScript: sendReferralToAppsScript,
    prepareReferralForStripeCheckout: prepareReferralForStripeCheckout,
    prepareReferralForShopifyDiscount: prepareReferralForShopifyDiscount,
    prepareReferralForWooCommerceOrder: prepareReferralForWooCommerceOrder,
    sendReferralToApi: sendReferralToApi
  };

  /* ============================================================
     AUTO INIT
     - Wire ambassador buttons
     - Capture referral if consent already exists
     - If consent is required and not yet granted, do not store anything
     ============================================================ */
  document.addEventListener('DOMContentLoaded', function () {
    wireAmbassadorApplyLinks();

    if (hasReferralConsent()) {
      captureReferralFromUrl();
    }
  });

})();