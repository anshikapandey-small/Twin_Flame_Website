/* ---------- mobile nav toggle ---------- */
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
if (navToggle) {
  navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
}

/* ---------- 01: category pills (single-select) ---------- */
const categoryPills = document.querySelectorAll('#categoryPills .cz-pill');
const categoryInput = document.getElementById('categoryInput');

categoryPills.forEach(pill => {
  pill.addEventListener('click', () => {
    categoryPills.forEach(p => p.classList.remove('is-active'));
    pill.classList.add('is-active');
    categoryInput.value = pill.dataset.category;
  });
});

/* ---------- 02: image upload (click + drag & drop) ---------- */
const uploadZone = document.getElementById('uploadZone');
const fileInput = document.getElementById('fileInput');
const uploadEmpty = document.getElementById('uploadEmpty');
const uploadPreview = document.getElementById('uploadPreview');
const previewImg = document.getElementById('previewImg');
const previewName = document.getElementById('previewName');
const uploadRemove = document.getElementById('uploadRemove');

function showPreview(file) {
  if (!file || !file.type.startsWith('image/')) return;
  const reader = new FileReader();
  reader.onload = e => {
    previewImg.src = e.target.result;
    previewName.textContent = file.name;
    uploadEmpty.classList.add('hide');
    uploadPreview.classList.remove('hide');
  };
  reader.readAsDataURL(file);
}

function clearPreview() {
  fileInput.value = '';
  previewImg.src = '';
  uploadPreview.classList.add('hide');
  uploadEmpty.classList.remove('hide');
}

uploadZone.addEventListener('click', () => fileInput.click());
uploadZone.addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    fileInput.click();
  }
});
fileInput.addEventListener('change', () => {
  if (fileInput.files[0]) showPreview(fileInput.files[0]);
});

['dragenter', 'dragover'].forEach(evt => {
  uploadZone.addEventListener(evt, e => {
    e.preventDefault();
    e.stopPropagation();
    uploadZone.classList.add('is-dragover');
  });
});
['dragleave', 'dragend'].forEach(evt => {
  uploadZone.addEventListener(evt, e => {
    e.preventDefault();
    e.stopPropagation();
    uploadZone.classList.remove('is-dragover');
  });
});
uploadZone.addEventListener('drop', e => {
  e.preventDefault();
  e.stopPropagation();
  uploadZone.classList.remove('is-dragover');
  const file = e.dataTransfer.files[0];
  if (file) {
    fileInput.files = e.dataTransfer.files;
    showPreview(file);
  }
});
uploadRemove.addEventListener('click', e => {
  e.stopPropagation();
  clearPreview();
});

/* ---------- 03: "are you in a hurry" — quick pills + date field stay in sync ---------- */
const hurryPills = document.querySelectorAll('.hurry-pill');
const dueDateInput = document.getElementById('dueDate');
const hurryReadout = document.getElementById('hurryReadout');

function formatReadoutDate(date) {
  return date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
}

function setActivePill(target) {
  hurryPills.forEach(p => p.classList.remove('is-active'));
  if (target) target.classList.add('is-active');
}

hurryPills.forEach(pill => {
  pill.addEventListener('click', () => {
    setActivePill(pill);
    const days = parseInt(pill.dataset.days, 10);

    if (days === 0) {
      dueDateInput.value = '';
      hurryReadout.textContent = 'Flexible — whenever it\u2019s ready.';
      return;
    }

    const target = new Date();
    target.setDate(target.getDate() + days);
    dueDateInput.value = target.toISOString().split('T')[0];
    hurryReadout.textContent = `Aiming for ${formatReadoutDate(target)}.`;
  });
});

dueDateInput.addEventListener('input', () => {
  if (!dueDateInput.value) return;
  setActivePill(null);
  const chosen = new Date(dueDateInput.value + 'T00:00:00');
  hurryReadout.textContent = `Aiming for ${formatReadoutDate(chosen)}.`;
});

/* ---------- send button: label -> icon -> flies away ---------- */
const czForm = document.getElementById('czForm');
const sendBtn = document.getElementById('sendBtn');
const sendConfirm = document.getElementById('sendConfirm');

czForm.addEventListener('submit', e => {
  e.preventDefault();
  if (sendBtn.classList.contains('is-sending')) return;

  sendBtn.classList.add('is-sending');

  setTimeout(() => {
    sendBtn.classList.add('is-flying');
  }, 260);

  setTimeout(() => {
    sendBtn.classList.add('is-sent');
    sendConfirm.textContent = 'Sent — we\u2019ll be in touch soon.';
    sendConfirm.classList.add('is-visible');
  }, 1000);
});