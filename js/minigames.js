// Mini Oyunlar Sistemi
(function() {
  'use strict';

  // Çiçek Toplama Mini Oyunu
  function flowerCollectionGame() {
    return new Promise((resolve) => {
      const modal = document.createElement('div');
      modal.className = 'minigame-modal';
      modal.innerHTML = `
        <div class="minigame-content">
          <h2>Çiçek Toplama</h2>
          <p>Arı olarak çiçeklerden nektar topla! 5 çiçek toplamaya çalış.</p>
          <div class="minigame-area" id="flowerGame">
            <div class="flower" style="left: ${Math.random() * 80}%; top: ${Math.random() * 60 + 20}%;">🌸</div>
            <div class="flower" style="left: ${Math.random() * 80}%; top: ${Math.random() * 60 + 20}%;">🌺</div>
            <div class="flower" style="left: ${Math.random() * 80}%; top: ${Math.random() * 60 + 20}%;">🌼</div>
            <div class="flower" style="left: ${Math.random() * 80}%; top: ${Math.random() * 60 + 20}%;">🌻</div>
            <div class="flower" style="left: ${Math.random() * 80}%; top: ${Math.random() * 60 + 20}%;">🌷</div>
          </div>
          <div class="minigame-score">Toplanan: <span id="flowerScore">0</span>/5</div>
          <button class="minigame-close" onclick="this.closest('.minigame-modal').remove()">Kapat</button>
        </div>
      `;

      document.body.appendChild(modal);
      let score = 0;
      const flowers = modal.querySelectorAll('.flower');
      const scoreEl = modal.querySelector('#flowerScore');

      flowers.forEach(flower => {
        flower.onclick = function() {
          if (!this.classList.contains('collected')) {
            this.classList.add('collected');
            score++;
            scoreEl.textContent = score;
            if (window.AudioManager) {
              window.AudioManager.playSound('success');
            }
            if (score >= 5) {
              setTimeout(() => {
                modal.remove();
                resolve({ success: true, score });
              }, 1000);
            }
          }
        };
      });
    });
  }

  // Su Dengesi Puzzle
  function waterBalancePuzzle() {
    return new Promise((resolve) => {
      const modal = document.createElement('div');
      modal.className = 'minigame-modal';
      modal.innerHTML = `
        <div class="minigame-content">
          <h2>Su Dengesi</h2>
          <p>Su kaynaklarını dengede tut! Doğru sırayı bul.</p>
          <div class="puzzle-area">
            <div class="puzzle-item" data-order="1">💧 Temiz Su</div>
            <div class="puzzle-item" data-order="2">🌊 Doğal Akış</div>
            <div class="puzzle-item" data-order="3">🌱 Bitki Sulama</div>
            <div class="puzzle-item" data-order="4">🔄 Geri Dönüşüm</div>
          </div>
          <div class="puzzle-sequence"></div>
          <button class="minigame-close" onclick="this.closest('.minigame-modal').remove()">Kapat</button>
        </div>
      `;

      document.body.appendChild(modal);
      const items = modal.querySelectorAll('.puzzle-item');
      const sequence = modal.querySelector('.puzzle-sequence');
      let selected = [];

      items.forEach(item => {
        item.onclick = function() {
          if (!this.classList.contains('selected')) {
            this.classList.add('selected');
            selected.push(this);
            sequence.appendChild(this.cloneNode(true));
            if (selected.length === 4) {
              const correct = selected.every((el, i) => el.dataset.order == i + 1);
              setTimeout(() => {
                modal.remove();
                resolve({ success: correct, score: correct ? 100 : 0 });
              }, 1000);
            }
          }
        };
      });
    });
  }

  // Global API
  window.MiniGames = {
    flowerCollection: flowerCollectionGame,
    waterBalance: waterBalancePuzzle
  };

})();

