const stack = document.querySelector(".stack");
const cards = Array.from(stack.children)
  .reverse()
  .filter((child) => child.classList.contains("card"));

cards.forEach((card) => stack.appendChild(card));

function moveCard() {
  const lastCard = stack.lastElementChild;
  if (lastCard.classList.contains("card")) {
    // reset opacity
    const img = lastCard.querySelector('img');
    if (img) img.style.opacity = '1';

    lastCard.classList.add("swap");

    setTimeout(() => {
      lastCard.classList.remove("swap");
      stack.insertBefore(lastCard, stack.firstElementChild);
      const newTopCard = stack.firstElementChild;
      const newTopImg = newTopCard.querySelector('img');
      if (newTopImg) {
        newTopImg.style.transform = 'scale(1.05)';
        newTopImg.classList.add('reveal-in');
        setTimeout(() => {
          newTopImg.classList.remove('reveal-in');
          newTopImg.style.transform = '';
        }, 1200);
      }
    }, 2200);
  }
}

stack.addEventListener("click", function (e) {
  const card = e.target.closest(".card");
  if (card && card === stack.lastElementChild) {
    // reset opacity
    const img = card.querySelector('img');
    if (img) img.style.opacity = '1';

    card.classList.add("swap");

    setTimeout(() => {
      card.classList.remove("swap");
      stack.insertBefore(card, stack.firstElementChild);
      resetAutoplay();
      initMusic(); // Trigger music on card flip if not playing
      
      const newTopCard = stack.firstElementChild;
      const newTopImg = newTopCard.querySelector('img');
      if (newTopImg) {
        newTopImg.style.transform = 'scale(1.05)';
        newTopImg.classList.add('reveal-in');
        setTimeout(() => {
          newTopImg.classList.remove('reveal-in');
          newTopImg.style.transform = '';
        }, 1200);
      }
    }, 2200);
  }
});

let autoplayInterval = setInterval(moveCard, 5000);

function resetAutoplay() {
  clearInterval(autoplayInterval);
  autoplayInterval = setInterval(moveCard, 4500);
}

function createConfetti() {
  const confettiContainer = document.getElementById("confetti-container");
  const confettiCount = 150;
  const colors = ["#ff3e43", "#ffd700", "#00c8ff", "#8a2be2", "#ff69b4"];

  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement("div");
    confetti.classList.add("confetti");
    confetti.style.setProperty('--hue', Math.random() * 360);
    confetti.style.left = Math.random() * 100 + "vw";
    confetti.style.animationDuration = Math.random() * 3 + 2 + "s";
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.width = Math.random() * 10 + 5 + "px";
    confetti.style.height = confetti.style.width;

    confettiContainer.appendChild(confetti);
  }
}

// Music toggle function
window.toggleMusic = function() {
  const music = document.getElementById('bg-music');
  const btn = document.getElementById('music-toggle');
  if (music.paused) {
    music.play().then(() => {
      btn.textContent = '⏸️';
      btn.classList.add('playing');
    }).catch(e => console.log('Play failed:', e));
  } else {
    music.pause();
    btn.textContent = '🎵';
    btn.classList.remove('playing');
  }
};

// Consolidated music init - use toggle
function initMusic() {
  const music = document.getElementById('bg-music');
  if (music.paused) {
    window.toggleMusic();
  }
}

// Multiple triggers
['click', 'keydown', 'touchstart'].forEach(evt => {
  document.addEventListener(evt, initMusic, {once: true});
});

// Load event
window.addEventListener('load', () => {
  createConfetti();
  startTyping();
  typeContentParagraphs();
  initMusic();
});

// Typing animation for typed-lines
function typeLine(line, container, charDelay = 40) {
  return new Promise((resolve) => {
    const p = document.createElement('p');
    container.appendChild(p);
    const cursor = document.createElement('span');
    cursor.className = 'typed-cursor';
    p.appendChild(cursor);

    let i = 0;
    function step() {
      if (i <= line.length) {
        Array.from(p.childNodes).forEach(node => { if (node !== cursor) node.remove(); });
        const textNode = document.createTextNode(line.slice(0, i));
        p.insertBefore(textNode, cursor);
        i++;
        setTimeout(step, charDelay);
      } else {
        cursor.remove();
        p.classList.add('visible');
        resolve();
      }
    }
    step();
  });
}

async function startTyping() {
  const container = document.getElementById('typed-lines');
  if (!container) return;

  const lines = [];

  container.innerHTML = '';

  for (let i = 0; i < lines.length; i++) {
    await typeLine(lines[i], container, 50);
    await new Promise(r => setTimeout(r, 800));
  }
}

// Type content paragraphs
async function typeContentParagraphs() {
  const paras = Array.from(document.querySelectorAll('.content p'));
  if (!paras.length) return;

  for (const p of paras) {
    const fullText = p.textContent.trim();
    p.textContent = '';
    p.classList.remove('visible');
    await typeTextIntoElement(p, fullText);
    p.classList.add('visible');
    await new Promise(r => setTimeout(r, 1200));
  }
}

function isPunctuation(ch) {
  return ['.', '!', '?', ','].includes(ch);
}

async function typeTextIntoElement(el, text, baseDelay = 45) {
  return new Promise((resolve) => {
    let i = 0;
    function step() {
      if (i <= text.length) {
        el.textContent = text.slice(0, i);
        i++;
        let delay = baseDelay + Math.random() * 20;
        const prevChar = text[i - 2] || '';
        if (prevChar === ',') delay += 250;
        if (prevChar === '.' || prevChar === '!' || prevChar === '?') delay += 600;
        setTimeout(step, delay);
      } else {
        resolve();
      }
    }
    step();
  });
}

