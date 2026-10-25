FlippyAI website — static, no build step
========================================

Files
  index.html      the page (no version numbers anywhere, by design)
  styles.css      layout + the 11 theme token sets, copied verbatim from the app
  script.js       theme switching, reveal-on-scroll, download links
  assets/         flippyai-mark.png  - trimmed + 2x logo (the tile fills the box)
                  flippyai-logo.png - the original 500x500 export, kept untouched
  preview.command double-click to view it in a browser

Preview
  Double-click preview.command, then open http://127.0.0.1:47999
  (or just open index.html directly — everything is relative paths.)

Links
  Download and repo URLs are hardcoded in index.html (no JS needed, works
  with JavaScript off, no build step):

    hero "Download FlippyAI" button  -> https://github.com/bananatoaster47e/FlippyAI
    final "Download FlippyAI" button -> https://github.com/bananatoaster47e/FlippyAI
    footer "GitHub" link             -> https://github.com/bananatoaster47e/FlippyAI

  All three open in a new tab with rel="noopener". script.js holds only the
  theme switcher and the reveal-on-scroll effect.

Design notes
  - Theme system mirrors the app exactly: one :root[data-theme="..."] block of
    custom properties per theme. Swapping the attribute repaints the entire page,
    which is the same trick the app's Settings picker uses.
  - The hero "app window" is drawn in CSS, not a screenshot, so it re-themes live
    and never goes stale when the UI changes. Replace it with real screenshots
    when you want photos instead of a mock.
  - Typography uses the app's own stack: -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, sans-serif. Same font as the app, no web font request,
    so the page looks right offline and loads with zero external dependencies.
  - Accessibility: skip link, focus-visible rings, aria-pressed on swatches, and a
    prefers-reduced-motion block that disables animations and smooth scrolling.

Content accuracy
  Every claim on the page was read out of V1.0 MAC:
    - tool list and behaviour  -> dist/tools/index.js (10 schemas) + dist/agent/prompt.js
    - toggles and defaults     -> electron/renderer/index.html (Settings drawer)
    - 131072 / 16384 / 70%     -> electron/renderer/renderer.js + dist/config.js
    - sampling fields          -> STANDARD_PARAMS in renderer.js (4 params + free-form add)
    - token overhead figures   -> measured from the real system prompt + schemas
    - sidebar folders, chat rename/move/delete rows, the + and up-arrow
      composer buttons, and the "Approve running <tool>?" bar
                              -> electron/renderer/{index.html,renderer.js,styles.css}

  The hero mock mirrors the app's real DOM (folder head = caret/icon/name/count/
  actions, then an "Unfiled" group; composer buttons are 42x42 rounded squares
  at the app's --radius-sm, and #sidebar is 232px to match the app exactly).

Checking the mock without a browser
  Chrome can render it headless, which catches overflow/clipping that is hard
  to see by eye:

    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' \
      --headless --disable-gpu --hide-scrollbars --window-size=1440,1150 \
      --screenshot=/tmp/site.png "file://$PWD/index.html"

  --dump-dom plus a small getBoundingClientRect() probe reports whether the chat
  column overflows (it must not: overflow:hidden would clip the last tool card)
  and whether the approval bar stays on one line. Test 380/700/900/1440 widths
  and at least one light theme (daybreak) -- the mock re-themes from the same
token sets as the app, so a bad contrast pairing shows up there.
    - install steps, email     -> RELEASE/FlippyAI V1.0/README.txt
    - install steps, email     -> RELEASE/FlippyAI V1.0/README.txt

  Windows build is untouched.
