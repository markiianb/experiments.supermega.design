/* ============================================================
   PIXEL GARDEN LAB — shared sprite + font library
   Requires pixel-core.js (window.PG).

   Sprite format: rows of chars, "." empty, letters map to pal.
   stemCol = the column anchored to the sprite's ground x.
   Cells are extracted bottom-to-top by PG.spriteCells so a
   Grower builds each sprite from the ground up.
   ============================================================ */
(function () {
  "use strict";
  const C = PG.COLORS;

  /* ---------- flowers (six species) ---------- */
  PG.FLOWERS = {
    sunflower: {
      rows: [
        "....AABAA....",
        "..AABBBBBAA..",
        ".ABBACCCABBA.",
        ".ABACCCCCABA.",
        "ABBACCDCCABBA",
        "ABACCDDDCCABA",
        "ABBACCDCCABBA",
        ".ABACCCCCABA.",
        ".ABBACCCABBA.",
        "..AABBBBBAA..",
        "....AABAA....",
        "......E......",
        "....FGE......",
        "......EGF....",
        "......E......",
      ],
      stemCol: 6,
      pal: { A: "#d8920f", B: "#f5b81e", C: "#6b3f17", D: "#46280c", E: C.stem, F: C.leaf, G: C.stem },
    },
    poppy: {
      rows: [
        "..AABAA..",
        ".ABBBBBA.",
        "ABBCCCBBA",
        "ABCCDCCBA",
        "ABCCCCCBA",
        ".ABBBBBA.",
        "..AABAA..",
        "....E....",
        "...FEF...",
        "....E....",
        "...FE....",
        "....E....",
      ],
      stemCol: 4,
      pal: { A: "#b81f2e", B: "#e23b47", C: "#8f1322", D: "#1c1a17", E: C.stem, F: C.leaf },
    },
    tulip: {
      rows: [
        ".A...A.",
        ".AA.AA.",
        ".ABABA.",
        ".ABBBA.",
        ".ABBBA.",
        "..ABA..",
        "...E...",
        "..FEF..",
        "...E...",
        "..FE...",
        "...EF..",
        "...E...",
      ],
      stemCol: 3,
      pal: { A: "#c33d8d", B: "#ea6db4", E: C.stem, F: C.leaf },
    },
    daisy: {
      rows: [
        "...A.A...",
        "..A.A.A..",
        ".A.ABA.A.",
        "..ABBBA..",
        "A.ABCBA.A",
        "..ABBBA..",
        ".A.ABA.A.",
        "..A.A.A..",
        "...A.A...",
        "....E....",
        "...FE....",
        "....EF...",
        "....E....",
      ],
      stemCol: 4,
      pal: { A: "#f3ede0", B: "#fbf8ef", C: "#f0a51c", E: C.stem, F: C.leaf },
    },
    cornflower: {
      rows: [
        "..A.A.A..",
        ".AABABAA.",
        "..ABBBA..",
        ".AABCBAA.",
        "..ABBBA..",
        ".AABABAA.",
        "..A.A.A..",
        "....E....",
        "...FEF...",
        "....E....",
        "....E....",
      ],
      stemCol: 4,
      pal: { A: "#2d5fb8", B: "#4f83e0", C: "#1c356b", E: C.stem, F: C.leaf },
    },
    lavender: {
      rows: [
        "...A...",
        "..ABA..",
        "..ABA..",
        ".ABBA..",
        ".ABBA..",
        "..ABA..",
        "..ABA..",
        "...E...",
        "..FEF..",
        "...E...",
        "..FE...",
        "...E...",
        "...E...",
      ],
      stemCol: 3,
      pal: { A: "#6c4ab0", B: "#9a78d8", E: C.stem, F: C.leaf },
    },
  };
  PG.FLOWER_LIST = Object.values(PG.FLOWERS);

  /* ---------- larger flora ---------- */
  PG.TREE = {
    rows: [
      "....AABBAA....",
      "..AABBBBBBAA..",
      ".ABBBBABBBBBA.",
      "ABBBABBBBABBBA",
      "ABBBBBBABBBBBA",
      ".ABBABBBBABBA.",
      "..AABBBBBBAA..",
      "....AABBAA....",
      "......TT......",
      "......TT......",
      "......TT......",
      ".....TTTT.....",
    ],
    stemCol: 7,
    pal: { A: "#1f5c38", B: "#2f7d4f", T: "#6b4226" },
  };
  PG.SAPLING = {
    rows: [
      "..A..",
      ".ABA.",
      "..A..",
      "..E..",
      ".FE..",
      "..E..",
    ],
    stemCol: 2,
    pal: { A: "#3d9a62", B: "#5cb87e", E: C.stem, F: C.leaf },
  };
  PG.SEEDLING = {
    rows: [
      "F.F",
      ".E.",
      ".E.",
    ],
    stemCol: 1,
    pal: { E: C.stem, F: "#5cb87e" },
  };

  /* ---------- fauna + props ---------- */
  PG.BIRD = {
    rows: [
      "..A...",
      ".AAB..",
      "AAAA.C",
      ".AAAAC",
      "..LL..",
    ],
    stemCol: 2,
    pal: { A: "#384048", B: "#f0a51c", C: "#384048", L: "#b8742a" },
  };
  PG.BUTTERFLY = {
    rows: [
      "A.B.A",
      "AABAA",
      "A.B.A",
    ],
    stemCol: 2,
    pal: { A: "#e23b47", B: "#1c1a17" },
  };
  PG.SUN_SMALL = {
    rows: [
      ".AAA.",
      "AABAA",
      "ABBBA",
      "AABAA",
      ".AAA.",
    ],
    stemCol: 2,
    pal: { A: "#ffb23e", B: "#ffd94a" },
  };

  /* ---------- 5×5 pixel font ----------
     Used by PG.textCells / PG.textWidth. "X" = pixel.          */
  PG.FONT = {
    A: [".XX.", "X..X", "XXXX", "X..X", "X..X"],
    B: ["XXX.", "X..X", "XXX.", "X..X", "XXX."],
    C: [".XXX", "X...", "X...", "X...", ".XXX"],
    D: ["XXX.", "X..X", "X..X", "X..X", "XXX."],
    E: ["XXXX", "X...", "XXX.", "X...", "XXXX"],
    F: ["XXXX", "X...", "XXX.", "X...", "X..."],
    G: [".XXX", "X...", "X.XX", "X..X", ".XX."],
    H: ["X..X", "X..X", "XXXX", "X..X", "X..X"],
    I: ["XXX", ".X.", ".X.", ".X.", "XXX"],
    J: ["..XX", "...X", "...X", "X..X", ".XX."],
    K: ["X..X", "X.X.", "XX..", "X.X.", "X..X"],
    L: ["X...", "X...", "X...", "X...", "XXXX"],
    M: ["X...X", "XX.XX", "X.X.X", "X...X", "X...X"],
    N: ["X...X", "XX..X", "X.X.X", "X..XX", "X...X"],
    O: [".XX.", "X..X", "X..X", "X..X", ".XX."],
    P: ["XXX.", "X..X", "XXX.", "X...", "X..."],
    Q: [".XX.", "X..X", "X..X", "X.XX", ".XXX"],
    R: ["XXX.", "X..X", "XXX.", "X.X.", "X..X"],
    S: [".XXX", "X...", ".XX.", "...X", "XXX."],
    T: ["XXXXX", "..X..", "..X..", "..X..", "..X.."],
    U: ["X..X", "X..X", "X..X", "X..X", ".XX."],
    V: ["X...X", "X...X", "X...X", ".X.X.", "..X.."],
    W: ["X...X", "X...X", "X.X.X", "XX.XX", "X...X"],
    X: ["X...X", ".X.X.", "..X..", ".X.X.", "X...X"],
    Y: ["X...X", ".X.X.", "..X..", "..X..", "..X.."],
    Z: ["XXXX", "..X.", ".X..", "X...", "XXXX"],
    0: [".XX.", "X..X", "X..X", "X..X", ".XX."],
    1: [".X.", "XX.", ".X.", ".X.", "XXX"],
    2: [".XX.", "X..X", "..X.", ".X..", "XXXX"],
    3: ["XXX.", "...X", ".XX.", "...X", "XXX."],
    4: ["X..X", "X..X", "XXXX", "...X", "...X"],
    5: ["XXXX", "X...", "XXX.", "...X", "XXX."],
    6: [".XX.", "X...", "XXX.", "X..X", ".XX."],
    7: ["XXXX", "...X", "..X.", ".X..", ".X.."],
    8: [".XX.", "X..X", ".XX.", "X..X", ".XX."],
    9: [".XX.", "X..X", ".XXX", "...X", ".XX."],
    "-": ["....", "....", "XXXX", "....", "...."],
    ".": [".", ".", ".", ".", "X"],
  };

  /* ---------- shared lab page chrome ----------
     Call PG.labChrome({ title, n }) once per page to inject the
     standard header bar and base styles.                        */
  PG.labChrome = function ({ title, n }) {
    const style = document.createElement("style");
    style.textContent = `
      @font-face { font-family: "Tanker";
                   src: url("../_system/fonts/Tanker-Regular.woff2") format("woff2");
                   font-display: swap; }
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { background: ${C.paper}; color: ${C.ink};
             font-family: ui-monospace, "SF Mono", Menlo, monospace; }
      .lab-bar { display: flex; align-items: center; gap: 8px;
                 min-height: 48px; padding: 0 16px; background: #161616;
                 font-family: "Tanker", -apple-system, sans-serif;
                 font-size: 14px; letter-spacing: .02em; text-transform: uppercase;
                 white-space: nowrap; overflow-x: auto; position: relative; z-index: 10; }
      .lab-bar .mark { flex: 0 0 auto; width: 16px; height: 16px;
                       margin-right: 8px; background: #f61515; }
      .lab-bar a { color: #e0e0e0; text-decoration: none; }
      .lab-bar a:hover { color: #ffffff; }
      .lab-bar .sep { color: #6f6f6f; }
      .lab-bar .here { color: #a8a8a8; }
      .lab-bar .num { color: #6f6f6f; margin-right: 4px; }
    `;
    document.head.appendChild(style);
    if (!document.querySelector('link[rel="icon"]')) {
      const icon = document.createElement("link");
      icon.rel = "icon";
      icon.href = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Crect width='16' height='16' fill='%23f61515'/%3E%3C/svg%3E";
      document.head.appendChild(icon);
    }
    /* Embedded in the workbench the viewer supplies the header — skip the bar. */
    if (new URLSearchParams(location.search).get("instrument-embed") === "1") return;
    const bar = document.createElement("div");
    bar.className = "lab-bar";
    bar.innerHTML = `<span class="mark" aria-hidden="true"></span>
      <a href="https://supermega.design">SUPERMEGA</a> <span class="sep">/</span>
      <a href="/">EXPERIMENTS</a> <span class="sep">/</span>
      <a href="index.html">PIXEL GARDEN LAB</a> <span class="sep">/</span>
      <span class="here"><span class="num">${n}</span>${title}</span>`;
    document.body.prepend(bar);
  };
})();
