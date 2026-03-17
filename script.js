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
        newTopImg.classList.add('reveal-in');
        setTimeout(() => newTopImg.classList.remove('reveal-in'), 700);
      }
    }, 1300);
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
      
      const newTopCard = stack.firstElementChild;
      const newTopImg = newTopCard.querySelector('img');
      if (newTopImg) {
        newTopImg.classList.add('reveal-in');
        setTimeout(() => newTopImg.classList.remove('reveal-in'), 700);
      }
    }, 1300);
  }
});

let autoplayInterval = setInterval(moveCard, 3500);

function resetAutoplay() {
  clearInterval(autoplayInterval);
  autoplayInterval = setInterval(moveCard, 3000);
}

function createConfetti() {
  const confettiContainer = document.getElementById("confetti-container");
  const confettiCount = 150; // Adjust the number of confetti pieces
  const colors = ["#ff3e43", "#ffd700", "#00c8ff", "#8a2be2", "#ff69b4"];

  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement("div");
    confetti.classList.add("confetti");
    confetti.style.setProperty('--hue', Math.random() * 360);
    confetti.style.left = Math.random() * 100 + "vw";
    confetti.style.animationDuration = Math.random() * 3 + 2 + "s"; // Randomize duration
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.width = Math.random() * 10 + 5 + "px";
    confetti.style.height = confetti.style.width; // Make confetti squares

    confettiContainer.appendChild(confetti);
  }
}

// Aggressive autoplay music - play unmuted automatically
const bgMusic = document.getElementById('bg-music');

function initMusic() {
  bgMusic.volume = 0.7;
  bgMusic.play().catch(console.log);
}

// Multiple triggers for autoplay success
document.addEventListener('click', initMusic, {once: true});
document.addEventListener('keydown', initMusic, {once: true});
document.addEventListener('touchstart', initMusic, {once: true});
window.addEventListener('load', initMusic);

// Call the function when the page loads
window.addEventListener('load', () => {
  createConfetti();
  startTyping();
  typeContentParagraphs();
});

// Typing animation: types provided lines one-by-one into #typed-lines
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
        // remove existing text nodes (preserve cursor)
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

  const lines = [
    
  ];

  // Clear any previous content
  container.innerHTML = '';

  for (let i = 0; i < lines.length; i++) {
    await typeLine(lines[i], container, 28);
    // short pause between lines
    await new Promise(r => setTimeout(r, 420));
  }
}

// Type all paragraphs inside .content one after another with punctuation-aware pauses
async function typeContentParagraphs() {
  const paras = Array.from(document.querySelectorAll('.content p'));
  if (!paras.length) return;

  for (const p of paras) {
    const fullText = p.textContent.trim();
    p.textContent = '';
    p.classList.remove('visible');
    await typeTextIntoElement(p, fullText);
    p.classList.add('visible');
    // pause a bit between paragraphs
    await new Promise(r => setTimeout(r, 600));
  }
}

function isPunctuation(ch) {
  return ['.', '!', '?', ','].includes(ch);
}

async function typeTextIntoElement(el, text, baseDelay = 28) {
  return new Promise((resolve) => {
    let i = 0;
    function step() {
      if (i <= text.length) {
        el.textContent = text.slice(0, i);
        i++;
        let delay = baseDelay + Math.random() * 20;
        const prevChar = text[i - 2] || '';
        if (prevChar === ',') delay += 140;
        if (prevChar === '.' || prevChar === '!' || prevChar === '?') delay += 320;
        setTimeout(step, delay);
      } else {
        resolve();
      }
    }
    step();
  });
}
