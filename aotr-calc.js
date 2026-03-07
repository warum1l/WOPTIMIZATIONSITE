// =============================================
// AOT:R Trade Calculator
// =============================================

// --- ITEMS DATABASE (populate later) ---
const ITEMS = [
  // { id: 'item_1', name: 'Example Item', value: 1000, rarity: 'Legendary' },
];

// --- STATE ---
const state = {
  you:  Array(9).fill(null),
  them: Array(9).fill(null),
  activeSide: null,
  activeSlot: null,
};

// --- INIT ---
document.addEventListener('DOMContentLoaded', () => {
  renderSlots('you');
  renderSlots('them');
  updateResult();
});

// --- RENDER SLOTS ---
function renderSlots(side) {
  const container = document.getElementById(side + 'Slots');
  container.innerHTML = '';
  state[side].forEach((item, i) => {
    const slot = document.createElement('div');
    slot.className = 'calc-slot' + (item ? ' calc-slot--filled' : ' calc-slot--empty');
    slot.dataset.side = side;
    slot.dataset.index = i;

    if (item) {
      slot.innerHTML = `
        <div class="slot-item-name">${item.name}</div>
        <div class="slot-item-value">${item.value.toLocaleString()}</div>
        <button class="slot-remove" onclick="removeItem('${side}', ${i})">✕</button>
      `;
    } else {
      slot.innerHTML = `<span class="slot-plus">+</span>`;
      slot.addEventListener('click', () => openPicker(side, i));
    }

    container.appendChild(slot);
  });

  const filled = state[side].filter(Boolean).length;
  document.getElementById(side + 'Count').textContent = filled;
}

// --- OPEN / CLOSE PICKER ---
function openPicker(side, index) {
  state.activeSide = side;
  state.activeSlot = index;
  document.getElementById('pickerSearch').value = '';
  filterItems();
  document.getElementById('itemPicker').classList.add('open');
  document.getElementById('pickerOverlay').classList.add('open');
  document.getElementById('pickerSearch').focus();
}

function closePicker() {
  document.getElementById('itemPicker').classList.remove('open');
  document.getElementById('pickerOverlay').classList.remove('open');
  state.activeSide = null;
  state.activeSlot = null;
}

// --- FILTER ITEMS ---
function filterItems() {
  const query = document.getElementById('pickerSearch').value.toLowerCase();
  const list = document.getElementById('pickerList');

  if (ITEMS.length === 0) {
    list.innerHTML = `
      <div class="picker-empty">
        <span>No items added yet.</span>
        <small>Items will appear here once the value list is populated.</small>
      </div>`;
    return;
  }

  const filtered = ITEMS.filter(item => item.name.toLowerCase().includes(query));

  if (filtered.length === 0) {
    list.innerHTML = `<div class="picker-empty"><span>No items found.</span></div>`;
    return;
  }

  list.innerHTML = filtered.map(item => `
    <div class="picker-item" onclick="selectItem('${item.id}')">
      <div class="picker-item-info">
        <span class="picker-item-name">${item.name}</span>
        <span class="picker-item-rarity rarity--${(item.rarity || '').toLowerCase()}">${item.rarity || ''}</span>
      </div>
      <span class="picker-item-value">${item.value.toLocaleString()}</span>
    </div>
  `).join('');
}

// --- SELECT ITEM ---
function selectItem(itemId) {
  const item = ITEMS.find(i => i.id === itemId);
  if (!item || state.activeSide === null || state.activeSlot === null) return;
  state[state.activeSide][state.activeSlot] = item;
  renderSlots(state.activeSide);
  updateResult();
  closePicker();
}

// --- REMOVE ITEM ---
function removeItem(side, index) {
  state[side][index] = null;
  renderSlots(side);
  updateResult();
}

// --- CLEAR SIDE ---
function clearSide(side) {
  state[side] = Array(9).fill(null);
  renderSlots(side);
  updateResult();
}

// --- UPDATE RESULT ---
function updateResult() {
  const youVal  = state.you.reduce((sum, i)  => sum + (i ? i.value : 0), 0);
  const themVal = state.them.reduce((sum, i) => sum + (i ? i.value : 0), 0);
  const diff = youVal - themVal;

  document.getElementById('youTotalVal').textContent  = youVal.toLocaleString();
  document.getElementById('themTotalVal').textContent = themVal.toLocaleString();

  const verdictText = document.getElementById('verdictText');
  const verdictDiff = document.getElementById('verdictDiff');
  const result      = document.getElementById('calcResult');

  result.classList.remove('result--win', 'result--lose', 'result--even');

  if (youVal === 0 && themVal === 0) {
    verdictText.textContent = '—';
    verdictDiff.textContent = '';
  } else if (diff === 0) {
    verdictText.textContent = 'Even Trade';
    verdictDiff.textContent = 'Perfectly balanced';
    result.classList.add('result--even');
  } else if (diff < 0) {
    // you get more value than you give → win
    verdictText.textContent = '✓ Good for you';
    verdictDiff.textContent = `+${Math.abs(diff).toLocaleString()} in your favor`;
    result.classList.add('result--win');
  } else {
    // you give more than you get → lose
    verdictText.textContent = '✗ Bad for you';
    verdictDiff.textContent = `−${Math.abs(diff).toLocaleString()} against you`;
    result.classList.add('result--lose');
  }
}
