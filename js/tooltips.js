// Eğitici İpuçları Sistemi
(function() {
  'use strict';

  const tooltips = {
    biyo: {
      title: "Canlı Çeşitliliği",
      content: "Bir alandaki farklı canlı türlerinin sayısı ve çeşitliliğidir. Daha fazla çeşitlilik, doğanın daha sağlıklı olduğunu gösterir."
    },
    su: {
      title: "Su Dengesi",
      content: "Suyun temizliği, miktarı ve doğal akışıdır. Temiz ve yeterli su, tüm canlılar için hayati öneme sahiptir."
    },
    toprak: {
      title: "Toprak Sağlığı",
      content: "Toprağın verimliliği, yapısı ve içindeki canlıların durumudur. Sağlıklı toprak, bitkilerin ve diğer canlıların yaşam kaynağıdır."
    },
    hava: {
      title: "Hava/İklim",
      content: "Havanın temizliği ve iklim koşullarıdır. Temiz hava, tüm canlıların sağlığı için çok önemlidir."
    },
    insan: {
      title: "İnsan Etkisi",
      content: "İnsanların doğaya olan etkisidir. Bu etki hem olumlu hem olumsuz olabilir. Dengeli bir yaklaşım önemlidir."
    }
  };

  // İpucu göster
  function showTooltip(key, element) {
    const tooltip = tooltips[key];
    if (!tooltip) return;

    const tooltipEl = document.createElement('div');
    tooltipEl.className = 'tooltip-popup';
    tooltipEl.innerHTML = `
      <div class="tooltip-header">${tooltip.title}</div>
      <div class="tooltip-body">${tooltip.content}</div>
    `;

    document.body.appendChild(tooltipEl);

    const rect = element.getBoundingClientRect();
    tooltipEl.style.top = (rect.bottom + 10) + 'px';
    tooltipEl.style.left = (rect.left + rect.width / 2 - 125) + 'px';

    setTimeout(() => tooltipEl.classList.add('show'), 10);

    // Kapat
    const closeTooltip = () => {
      tooltipEl.classList.remove('show');
      setTimeout(() => tooltipEl.remove(), 300);
    };

    tooltipEl.onclick = closeTooltip;
    setTimeout(closeTooltip, 5000);
  }

  // İpucu butonlarına event listener ekle
  function initTooltips() {
    document.querySelectorAll('.info-btn').forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        const key = this.getAttribute('data-info');
        if (key) {
          showTooltip(key, this);
        }
      });
    });
  }

  // Global API
  window.TooltipSystem = {
    show: showTooltip,
    init: initTooltips
  };

})();

