// Çizimler: karakterler ve ikonlar (SVG)
(function() {
  'use strict';

  const INK = '#3B2A1A';

  // Parlak, göz kırpan çizgi film gözü
  function eye(cx, cy, r) {
    return `<g class="c-eye">
      <ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="${r * 1.15}" fill="#2B1D12"/>
      <circle cx="${cx + r * 0.32}" cy="${cy - r * 0.42}" r="${r * 0.36}" fill="#fff"/>
      <circle cx="${cx - r * 0.3}" cy="${cy + r * 0.38}" r="${r * 0.17}" fill="#fff" opacity="0.8"/>
    </g>`;
  }

  function cheek(cx, cy, r) {
    return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#FF8FA3" opacity="0.65"/>`;
  }

  const CHARACTERS = {
    // Arı
    ari: `<svg class="char char-ari" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Arı">
      <defs><clipPath id="ariGovde"><ellipse cx="100" cy="114" rx="55" ry="57"/></clipPath></defs>
      <g class="c-wing c-wing-l"><ellipse cx="48" cy="74" rx="36" ry="23" transform="rotate(-28 48 74)" fill="#E3F6FF" stroke="#7CC4EE" stroke-width="4" opacity="0.92"/></g>
      <g class="c-wing c-wing-r"><ellipse cx="152" cy="74" rx="36" ry="23" transform="rotate(28 152 74)" fill="#E3F6FF" stroke="#7CC4EE" stroke-width="4" opacity="0.92"/></g>
      <path d="M82 60 Q72 34 60 30" stroke="${INK}" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M118 60 Q128 34 140 30" stroke="${INK}" stroke-width="5" fill="none" stroke-linecap="round"/>
      <circle cx="58" cy="29" r="7" fill="${INK}"/><circle cx="142" cy="29" r="7" fill="${INK}"/>
      <ellipse cx="86" cy="176" rx="11" ry="7" fill="${INK}"/><ellipse cx="114" cy="176" rx="11" ry="7" fill="${INK}"/>
      <path class="c-wave" d="M152 124 Q170 118 172 102" stroke="${INK}" stroke-width="6" fill="none" stroke-linecap="round"/>
      <path d="M48 124 Q32 126 30 140" stroke="${INK}" stroke-width="6" fill="none" stroke-linecap="round"/>
      <ellipse cx="100" cy="114" rx="57" ry="59" fill="#FFCB3D" stroke="${INK}" stroke-width="5"/>
      <g clip-path="url(#ariGovde)">
        <rect x="40" y="134" width="120" height="13" fill="${INK}"/>
        <rect x="40" y="156" width="120" height="13" fill="${INK}"/>
        <ellipse cx="78" cy="78" rx="26" ry="14" fill="#FFE48A" opacity="0.8"/>
      </g>
      ${eye(80, 100, 10)}${eye(120, 100, 10)}
      ${cheek(64, 117, 8)}${cheek(136, 117, 8)}
      <g class="m-ok"><path d="M88 116 Q100 129 112 116" stroke="${INK}" stroke-width="4.5" fill="none" stroke-linecap="round"/></g><g class="m-low"><path d="M89 124 Q100 114 111 124" stroke="${INK}" stroke-width="4.5" fill="none" stroke-linecap="round"/><path d="M68 85 L88 79 M132 85 L112 79" stroke="${INK}" stroke-width="3.5" fill="none" stroke-linecap="round"/></g><path class="m-tear" d="M72 112 q-5 9 0 12 q5 -3 0 -12 Z" fill="#6EC6F0" stroke="#3E9BE9" stroke-width="1.5"/>
    </svg>`,

    // Balık
    balik: `<svg class="char char-balik" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Balık">
      <defs><clipPath id="balikGovde"><ellipse cx="108" cy="106" rx="58" ry="42"/></clipPath></defs>
      <circle class="c-bubble" cx="178" cy="76" r="6" fill="#fff" fill-opacity="0.35" stroke="#fff" stroke-width="2.5"/>
      <circle class="c-bubble c-bubble-2" cx="186" cy="56" r="4" fill="#fff" fill-opacity="0.35" stroke="#fff" stroke-width="2"/>
      <circle class="c-bubble c-bubble-3" cx="174" cy="42" r="3" fill="#fff" fill-opacity="0.35" stroke="#fff" stroke-width="2"/>
      <g class="c-tail"><path d="M58 106 L22 72 Q34 106 22 140 Z" fill="#FF7A2F" stroke="#7A3210" stroke-width="5" stroke-linejoin="round"/></g>
      <path d="M84 68 Q104 30 132 68 Z" fill="#FF7A2F" stroke="#7A3210" stroke-width="5" stroke-linejoin="round"/>
      <path d="M96 144 Q108 168 124 144 Z" fill="#FF7A2F" stroke="#7A3210" stroke-width="5" stroke-linejoin="round"/>
      <ellipse cx="108" cy="106" rx="60" ry="44" fill="#FF9A3D" stroke="#7A3210" stroke-width="5"/>
      <g clip-path="url(#balikGovde)">
        <ellipse cx="108" cy="140" rx="60" ry="26" fill="#FFD9A0" opacity="0.75"/>
        <path d="M78 58 Q90 106 78 154 L94 154 Q106 106 94 58 Z" fill="#fff"/>
        <path d="M112 58 Q122 106 112 154 L122 154 Q132 106 122 58 Z" fill="#fff" opacity="0.9"/>
      </g>
      <g class="c-fin"><path d="M100 116 Q82 136 106 142 Q116 130 100 116 Z" fill="#FFB24D" stroke="#7A3210" stroke-width="4" stroke-linejoin="round"/></g>
      <circle cx="140" cy="94" r="15" fill="#fff" stroke="#7A3210" stroke-width="3"/>
      ${eye(143, 95, 8)}
      ${cheek(134, 120, 7)}
      <g class="m-ok"><path d="M150 120 Q158 128 165 116" stroke="#7A3210" stroke-width="4" fill="none" stroke-linecap="round"/></g><g class="m-low"><path d="M150 125 Q158 116 166 122" stroke="#7A3210" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M128 80 L152 73" stroke="#7A3210" stroke-width="3.5" fill="none" stroke-linecap="round"/></g><path class="m-tear" d="M128 108 q-5 9 0 12 q5 -3 0 -12 Z" fill="#6EC6F0" stroke="#3E9BE9" stroke-width="1.5"/>
    </svg>`,

    // Ağaç
    agac: `<svg class="char char-agac" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Ağaç">
      <ellipse cx="100" cy="192" rx="52" ry="7" fill="#6FBF5F"/>
      <path d="M88 152 Q70 150 60 136" stroke="#5B3A1E" stroke-width="7" fill="none" stroke-linecap="round"/>
      <path class="c-wave" d="M112 152 Q130 150 140 136" stroke="#5B3A1E" stroke-width="7" fill="none" stroke-linecap="round"/>
      <path d="M82 194 Q90 152 86 112 L114 112 Q110 152 118 194 Z" fill="#A9713F" stroke="#5B3A1E" stroke-width="5" stroke-linejoin="round"/>
      <path d="M96 140 Q100 150 96 164" stroke="#7E4F27" stroke-width="3" fill="none" stroke-linecap="round"/>
      <g class="c-crown">
        <g fill="#5DBB63" stroke="#2E7D3A" stroke-width="10" stroke-linejoin="round">
          <circle cx="100" cy="72" r="44"/><circle cx="60" cy="90" r="28"/><circle cx="140" cy="90" r="28"/>
          <circle cx="74" cy="50" r="26"/><circle cx="126" cy="50" r="26"/>
        </g>
        <g fill="#5DBB63">
          <circle cx="100" cy="72" r="44"/><circle cx="60" cy="90" r="28"/><circle cx="140" cy="90" r="28"/>
          <circle cx="74" cy="50" r="26"/><circle cx="126" cy="50" r="26"/>
        </g>
        <circle cx="76" cy="44" r="12" fill="#8FD98C" opacity="0.8"/>
        <circle cx="122" cy="38" r="7" fill="#8FD98C" opacity="0.8"/>
        <path d="M140 66 q10 -8 16 2 q-8 8 -16 -2 Z" fill="#F4A03C"/>
        <path d="M48 76 q-10 -6 -14 4 q8 6 14 -4 Z" fill="#F08A3C"/>
        ${eye(84, 80, 9)}${eye(116, 80, 9)}
        ${cheek(69, 95, 7)}${cheek(131, 95, 7)}
        <g class="m-ok"><path d="M90 95 Q100 106 110 95" stroke="#234F2A" stroke-width="4.5" fill="none" stroke-linecap="round"/></g><g class="m-low"><path d="M90 102 Q100 93 110 102" stroke="#234F2A" stroke-width="4.5" fill="none" stroke-linecap="round"/><path d="M73 68 L91 63 M127 68 L109 63" stroke="#234F2A" stroke-width="3.5" fill="none" stroke-linecap="round"/></g><path class="m-tear" d="M78 90 q-5 9 0 12 q5 -3 0 -12 Z" fill="#6EC6F0" stroke="#3E9BE9" stroke-width="1.5"/>
      </g>
      <path class="c-leaf-fall" d="M156 104 q11 -7 16 3 q-9 8 -16 -3 Z" fill="#F08A3C"/>
    </svg>`,

    // Tilki
    tilki: `<svg class="char char-tilki" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Tilki">
      <defs><clipPath id="tilkiKafa"><path d="M100 42 Q150 42 158 92 Q150 132 100 138 Q50 132 42 92 Q50 42 100 42 Z"/></clipPath></defs>
      <g class="c-tail">
        <path d="M126 178 Q186 190 180 134 Q176 108 158 118 Q162 152 124 158 Z" fill="#F58A3A" stroke="#6B3310" stroke-width="5" stroke-linejoin="round"/>
        <path d="M180 136 Q176 108 158 118 Q158 132 168 142 Q176 142 180 136 Z" fill="#FFF4E2" stroke="#6B3310" stroke-width="4" stroke-linejoin="round"/>
      </g>
      <ellipse cx="100" cy="160" rx="37" ry="34" fill="#F58A3A" stroke="#6B3310" stroke-width="5"/>
      <ellipse cx="100" cy="168" rx="19" ry="23" fill="#FFF4E2"/>
      <ellipse cx="84" cy="192" rx="13" ry="7" fill="#6B3310"/><ellipse cx="116" cy="192" rx="13" ry="7" fill="#6B3310"/>
      <path d="M64 128 Q100 148 136 128 L138 142 Q100 162 62 142 Z" fill="#E94F4F" stroke="#8E2424" stroke-width="4" stroke-linejoin="round"/>
      <path d="M116 148 L130 174 L114 172 L108 152 Z" fill="#E94F4F" stroke="#8E2424" stroke-width="4" stroke-linejoin="round"/>
      <path d="M58 72 L50 22 L92 52 Z" fill="#F58A3A" stroke="#6B3310" stroke-width="5" stroke-linejoin="round"/>
      <path d="M142 72 L150 22 L108 52 Z" fill="#F58A3A" stroke="#6B3310" stroke-width="5" stroke-linejoin="round"/>
      <path d="M62 58 L58 36 L78 50 Z" fill="#6B3310"/><path d="M138 58 L142 36 L122 50 Z" fill="#6B3310"/>
      <path d="M100 42 Q150 42 158 92 Q150 132 100 138 Q50 132 42 92 Q50 42 100 42 Z" fill="#F58A3A" stroke="#6B3310" stroke-width="5" stroke-linejoin="round"/>
      <g clip-path="url(#tilkiKafa)">
        <path d="M40 98 Q72 94 100 112 Q128 94 160 98 Q152 136 100 142 Q48 136 40 98 Z" fill="#FFF4E2"/>
      </g>
      ${eye(80, 88, 9)}${eye(120, 88, 9)}
      ${cheek(64, 110, 7)}${cheek(136, 110, 7)}
      <path d="M92 108 Q100 103 108 108 Q105 117 100 118 Q95 117 92 108 Z" fill="#2B1D12"/>
      <g class="m-ok"><path d="M100 118 Q94 127 87 122 M100 118 Q106 127 113 122" stroke="#2B1D12" stroke-width="3.5" fill="none" stroke-linecap="round"/></g><g class="m-low"><path d="M100 118 V121 M90 128 Q100 120 110 128" stroke="#2B1D12" stroke-width="3.5" fill="none" stroke-linecap="round"/><path d="M69 76 L88 71 M131 76 L112 71" stroke="#2B1D12" stroke-width="3.5" fill="none" stroke-linecap="round"/></g><path class="m-tear" d="M74 99 q-5 9 0 12 q5 -3 0 -12 Z" fill="#6EC6F0" stroke="#3E9BE9" stroke-width="1.5"/>
    </svg>`
  };

  function svg(inner) {
    return `<svg class="ico-svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${inner}</svg>`;
  }

  const ICONS = {
    // Göstergeler
    biyo: svg(`<path d="M12 12C9 4 2 5 3 10c.6 3 4 4 9 2Z" fill="#F06CA8"/><path d="M12 12c3-8 10-7 9-2-.6 3-4 4-9 2Z" fill="#F06CA8"/>
      <path d="M12 12c-4 1-7 4-5 7 2 2 4.5-1 5-7Z" fill="#F9A03F"/><path d="M12 12c4 1 7 4 5 7-2 2-4.5-1-5-7Z" fill="#F9A03F"/>
      <rect x="11.1" y="6.5" width="1.8" height="12" rx=".9" fill="#4A3423"/>`),
    su: svg(`<path d="M12 2.5C8 8 5 11.5 5 15a7 7 0 0 0 14 0c0-3.5-3-7-7-12.500Z" fill="#3FA9F5"/>
      <path d="M8.6 15.200a3.400 3.400 0 0 0 3 3.200" stroke="#fff" stroke-width="1.7" fill="none" stroke-linecap="round"/>`),
    toprak: svg(`<path d="M2.500 21Q12 12 21.500 21Z" fill="#9C6B3F"/><path d="M12 17V8" stroke="#3FA34D" stroke-width="2.200" stroke-linecap="round"/>
      <path d="M12 9.500C8 9.500 6 7 6 4.500c3.500 0 6 1.500 6 5Z" fill="#5DBB63"/><path d="M12 12c4 0 6-2.500 6-5-3.500 0-6 1.500-6 5Z" fill="#3FA34D"/>`),
    hava: svg(`<path d="M7 18.500a4.500 4.500 0 0 1 .3-9A5.800 5.800 0 0 1 18.400 11a3.800 3.800 0 0 1-.4 7.500Z" fill="#7CC8F2"/>
      <path d="M8 12.500a2.600 2.600 0 0 1 2.600-2.300" stroke="#fff" stroke-width="1.600" fill="none" stroke-linecap="round"/>`),
    insan: svg(`<circle cx="17" cy="9" r="2.900" fill="#B79CF0"/><path d="M14.200 13.800a5.600 5.600 0 0 1 7.800 6.200h-5.500Z" fill="#B79CF0"/>
      <circle cx="9" cy="8" r="3.500" fill="#8E6BD9"/><path d="M2.500 20a6.500 6.500 0 0 1 13 0Z" fill="#8E6BD9"/>`),

    // Mevsimler
    ilkbahar: svg(`<g fill="#FF8FB8"><circle cx="12" cy="6.800" r="3.700"/><circle cx="16.950" cy="10.400" r="3.700"/><circle cx="15.060" cy="16.200" r="3.700"/>
      <circle cx="8.940" cy="16.200" r="3.700"/><circle cx="7.050" cy="10.400" r="3.700"/></g><circle cx="12" cy="12" r="3.200" fill="#FFC93C"/>`),
    yaz: svg(`<g stroke="#FFB020" stroke-width="2.200" stroke-linecap="round"><path d="M12 2v2.500M12 19.500V22M2 12h2.500M19.500 12H22M4.900 4.900l1.800 1.800M17.300 17.300l1.800 1.800M4.900 19.100l1.800-1.800M17.300 6.700l1.800-1.800"/></g>
      <circle cx="12" cy="12" r="5.200" fill="#FFC93C"/>`),
    sonbahar: svg(`<path d="M12 2.500c6 3 8 9 5 14-2 3-5 4.500-5 4.500s-3-1.500-5-4.500c-3-5-1-11 5-14Z" fill="#F08A3C"/>
      <path d="M12 7v14.500M12 12l3.200-2.600M12 15l-3.200-2.600" stroke="#B4551A" stroke-width="1.400" fill="none" stroke-linecap="round"/>`),
    kis: svg(`<g stroke="#5BBDEB" stroke-width="2.200" stroke-linecap="round"><path d="M12 2.500v19M3.800 7.250l16.400 9.500M3.800 16.750l16.400-9.500"/>
      <path d="M9.500 4.500 12 6.500l2.500-2M9.500 19.500 12 17.500l2.500 2" fill="none" stroke-width="1.700"/></g>`),

    // Yıldızlar
    star: svg(`<path d="M12 2.800l2.700 5.600 6.100.8-4.500 4.200 1.100 6.100L12 16.600l-5.400 2.900 1.100-6.100L3.200 9.200l6.100-.8Z" fill="#FFC93C" stroke="#E0A100" stroke-width="1.300" stroke-linejoin="round"/>`),
    starOff: svg(`<path d="M12 2.800l2.700 5.600 6.100.8-4.500 4.200 1.100 6.100L12 16.600l-5.400 2.900 1.100-6.100L3.200 9.200l6.100-.8Z" fill="#EDE5D2" stroke="#CFC4A8" stroke-width="1.300" stroke-linejoin="round"/>`),

    // Araç butonları
    restart: svg(`<path d="M19 12.500a7 7 0 1 1-2.200-5.600" stroke="currentColor" stroke-width="2.700" fill="none" stroke-linecap="round"/>
      <path d="M19.500 3.500v5h-5" stroke="currentColor" stroke-width="2.700" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`),
    sound: svg(`<path d="M3.500 9.500H7l5-4.200v13.400L7 14.500H3.500Z" fill="currentColor" stroke="currentColor" stroke-width="1.500" stroke-linejoin="round"/>
      <path d="M15.500 9a4.500 4.500 0 0 1 0 6M18.200 6.500a8 8 0 0 1 0 11" stroke="currentColor" stroke-width="2.200" fill="none" stroke-linecap="round"/>`),
    mute: svg(`<path d="M3.500 9.500H7l5-4.200v13.400L7 14.500H3.500Z" fill="currentColor" stroke="currentColor" stroke-width="1.500" stroke-linejoin="round"/>
      <path d="M16 9.500l5 5M21 9.500l-5 5" stroke="currentColor" stroke-width="2.400" fill="none" stroke-linecap="round"/>`),
    history: svg(`<rect x="5" y="3.500" width="14" height="17" rx="3" fill="none" stroke="currentColor" stroke-width="2.300"/>
      <path d="M9 9h6M9 12.500h6M9 16h3.500" stroke="currentColor" stroke-width="2.100" stroke-linecap="round"/>`),
    trophy: svg(`<path d="M7 3.500h10V8a5 5 0 0 1-10 0Z" fill="currentColor"/>
      <path d="M7 5H4.300a2.700 2.700 0 0 0 3 3.800M17 5h2.700a2.700 2.700 0 0 1-3 3.800" stroke="currentColor" stroke-width="1.900" fill="none" stroke-linecap="round"/>
      <path d="M12 13v4M8 20.500h8" stroke="currentColor" stroke-width="2.400" stroke-linecap="round"/>`),
    play: svg(`<path d="M7.500 4.500v15l12-7.500Z" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>`),
    home: svg(`<path d="M3.500 11.500 12 4l8.500 7.500" stroke="currentColor" stroke-width="2.500" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M6 10.500V20h12v-9.500" stroke="currentColor" stroke-width="2.500" fill="none" stroke-linejoin="round"/>`),
    note: svg(`<path d="M6 3.500h9l4 4V20.500H6Z" fill="none" stroke="currentColor" stroke-width="2.300" stroke-linejoin="round"/>
      <path d="M9.500 11h6M9.500 14.500h6M9.500 18h3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`),
    heart: svg(`<path d="M12 20.500C5 15.500 2.500 12 2.500 8.500a4.700 4.700 0 0 1 9.500-1.500a4.700 4.700 0 0 1 9.500 1.500c0 3.500-2.500 7-9.500 12Z" fill="#F0506E" stroke="#B92D4A" stroke-width="1.400" stroke-linejoin="round"/><path d="M6.500 7.200a2.300 2.300 0 0 1 2.300-1.200" stroke="#fff" stroke-width="1.500" fill="none" stroke-linecap="round"/>`),
    heartOff: svg(`<path d="M12 20.500C5 15.500 2.500 12 2.500 8.500a4.700 4.700 0 0 1 9.500-1.500a4.700 4.700 0 0 1 9.500 1.500c0 3.500-2.500 7-9.500 12Z" fill="#EDE5D2" stroke="#CFC4A8" stroke-width="1.400" stroke-linejoin="round"/>`),
    clock: svg(`<circle cx="12" cy="12" r="9" fill="#fff" stroke="currentColor" stroke-width="2.300"/><path d="M12 6.500V12l3.500 2.500" stroke="currentColor" stroke-width="2.300" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`),
    up: svg(`<circle cx="12" cy="12" r="10" fill="#4CAF50"/><path d="M7.500 13l3.200 3.200 6-7" stroke="#fff" stroke-width="2.800" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`),
    down: svg(`<circle cx="12" cy="12" r="10" fill="#FF9800"/><path d="M12 6.500v7" stroke="#fff" stroke-width="2.800" stroke-linecap="round"/><circle cx="12" cy="17.200" r="1.600" fill="#fff"/>`)
  };

  // Oyundaki mevsim adı -> ikon anahtarı
  const SEASON_ICON = { 'İlkbahar': 'ilkbahar', 'Yaz': 'yaz', 'Sonbahar': 'sonbahar', 'Kış': 'kis' };
  const ROLE_NAMES = { ari: 'Arı', balik: 'Balık', agac: 'Ağaç', tilki: 'Tilki' };

  function character(role) {
    return CHARACTERS[role] || '';
  }

  function icon(name) {
    return ICONS[name] || '';
  }

  // Sayfadaki [data-ico] ve [data-char] yer tutucularını çizimlerle doldur
  function mount(root) {
    (root || document).querySelectorAll('[data-ico]').forEach(el => {
      el.innerHTML = icon(el.getAttribute('data-ico'));
    });
    (root || document).querySelectorAll('[data-char]').forEach(el => {
      el.innerHTML = character(el.getAttribute('data-char'));
    });
  }

  window.GameArt = {
    character,
    icon,
    mount,
    seasonIcon: (season) => icon(SEASON_ICON[season]),
    roleName: (role) => ROLE_NAMES[role] || ''
  };

})();
