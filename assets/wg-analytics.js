/* Visit statistics for play.wildcardgroup.be (Wildcard Group, 20 October 2026; not part of the BHIS code).
   Plausible Analytics: EU-hosted, no cookies, no personal data. Loaded on every page of the game, after
   the Plausible snippet for play.wildcardgroup.be (pa- script), which is initialised with
   autoCapturePageviews: false because this file sends the pageview. Clicks on outbound links, file
   downloads and form submissions are counted by the Plausible script itself, not here.

   Every page: one pageview. ?src= is not a Plausible parameter, so it is passed on as utm_source
   (Plausible shows it under Sources). After a step inside the game (start page or /wildcard/ to the
   game) the referrer is our own domain, so the source of the visit is passed on from sessionStorage.

   The game page also sends three custom events (add them as goals in Plausible):
     "Game opened"           the game page loads, with either deck
     "Wildcard deck chosen"  the game page loads with Core V3.1 + Wildcard Group expansion
                             (start page, /wildcard/, or "Choose deck" in the game)
     "First card revealed"   the first card turned over, once per game page load
   Properties on all three: deck (CoreV3.1 or WildcardGroup) and source (?src=, ?utm_source=, ?ref=,
   the referring site, or "direct"). The BHIS engine is not changed: the card click is read in the
   capture phase, before flipCard() in App/index.html marks the card as flipped. */
(function () {
  window.plausible = window.plausible || function () { (window.plausible.q = window.plausible.q || []).push(arguments); };

  function clean(v) { return (v || '').replace(/[^a-z0-9_.-]/gi, '').slice(0, 60); }
  function remember(v) {
    try {
      if (v) sessionStorage.setItem('wg_play_src', v);
      else v = sessionStorage.getItem('wg_play_src') || '';
    } catch (e) { /* storage blocked: the value of this page alone still works */ }
    return v;
  }

  var url = new URL(location.href);
  var q = url.searchParams;
  var refHost = '';
  try { refHost = document.referrer ? new URL(document.referrer).hostname : ''; } catch (e) {}
  if (refHost === location.hostname) refHost = '';
  var src = clean(q.get('src'));
  var given = src || clean(q.get('utm_source')) || clean(q.get('ref')) || clean(q.get('source'));
  var source = remember(given || refHost) || 'direct';

  if (!q.has('utm_source') && (src || (!given && !refHost && source !== 'direct'))) q.set('utm_source', src || source);
  plausible('pageview', { u: url.href });

  if (!document.querySelector('.cards__single')) return; // start page: pageview only

  // same choice and fallback as loaddeck() in deck-script.js
  var deck = q.get('deck');
  if (!deck) { try { deck = localStorage.getItem('deckKey'); } catch (e) {} }
  deck = deck === 'WildcardGroup' ? 'WildcardGroup' : 'CoreV3.1';
  var props = { deck: deck, source: source };

  // non-interactive: opening the page alone should not count as engagement (bounce rate)
  plausible('Game opened', { props: props, interactive: false });
  if (deck === 'WildcardGroup') plausible('Wildcard deck chosen', { props: props, interactive: false });

  var revealed = false;
  document.addEventListener('click', function (e) {
    if (revealed || !e.target.closest) return;
    var card = e.target.closest('[class^="cards__single"]');
    if (!card || card.getAttribute('state') === 'flipped') return;
    revealed = true;
    plausible('First card revealed', { props: props });
  }, true);
})();
