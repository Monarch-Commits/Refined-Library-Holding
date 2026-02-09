import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import {
  getDatabase,
  ref,
  push,
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js';
import { subjects } from '../../constant.js';
import { firebaseConfig } from '../../firebaseConfig.js';

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const saveButton = document.getElementById('save');

function add() {
  const btnOriginalText = saveButton.innerHTML;
  saveButton.disabled = true;
  saveButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> SAVING...';

  const CallNumber = document.getElementById('CallNumber').value;
  const bookName = document.getElementById('BookName').value;
  const selectedCourses = Array.from(
    document.querySelectorAll('.programs input[name="course"]:checked'),
  ).map((checkbox) => checkbox.value);
  const selectedYear = document.getElementById('Year').value;
  const Subject = document.getElementById('Subject').value;
  const recency = document.getElementById('recency').value;
  const author = document.getElementById('author').value;
  const PlaceofPublication =
    document.getElementById('PlaceofPublication').value;
  const type = document.getElementById('type').value;
  const Volume = document.getElementById('Volume').value;
  const Location = document.getElementById('Location').value;

  if (
    !bookName ||
    !Subject ||
    !recency ||
    !author ||
    !type ||
    !Volume ||
    selectedCourses.length === 0
  ) {
    alert(
      'Please fill out all required fields and select at least one program.',
    );
    saveButton.disabled = false;
    saveButton.innerHTML = btnOriginalText;
    return;
  }

  const promises = selectedCourses.map((course) => {
    return push(ref(db, `Books/${course}/${selectedYear}`), {
      CallNumber,
      bookName,
      Subject,
      recency,
      author,
      PlaceofPublication,
      type,
      Volume,
      Location,
    });
  });

  Promise.all(promises)
    .then(() => {
      alert('Successfully added to selected programs!');
      // Reset fields
      [
        'CallNumber',
        'BookName',
        'recency',
        'author',
        'PlaceofPublication',
        'Volume',
        'Location',
      ].forEach((id) => {
        document.getElementById(id).value = '';
      });
    })
    .catch((error) => alert(error.message))
    .finally(() => {
      saveButton.disabled = false;
      saveButton.innerHTML = btnOriginalText;
    });
}

saveButton.addEventListener('click', add);

// Sidebar Toggles
document.getElementById('menu').addEventListener('click', () => {
  document.getElementById('for').classList.remove('hidden-sidebar');
});
document.getElementById('closeMenu').addEventListener('click', () => {
  document.getElementById('for').classList.add('hidden-sidebar');
});

// Alphabetical sort of subjects
window.addEventListener('load', () => {
  const subjectSelect = document.getElementById('Subject');
  const options = Array.from(subjectSelect.options);
  options.sort((a, b) => a.text.localeCompare(b.text));
  subjectSelect.innerHTML = '';
  options.forEach((option) => subjectSelect.add(option));

  // Mobile initial state
  if (window.innerWidth < 768) {
    document.getElementById('for').classList.add('hidden-sidebar');
  }
});

// Tailwind
tailwind.config = {
  theme: {
    extend: {
      fontFamily: { sans: ['Plus Jakarta Sans', 'sans-serif'] },
      colors: {
        primary: '#0ea5e9',
        secondary: '#6366f1',
        dark: '#0f172a',
      },
    },
  },
};

const select = document.getElementById('Subject');

function renderSubjects(list) {
  select.innerHTML = '';
  list.forEach((subject) => {
    const option = document.createElement('option');
    option.value = subject;
    option.textContent = subject;
    select.appendChild(option);
  });
}

renderSubjects(subjects);

// Search
const searchInput = document.getElementById('subjectSearch');

searchInput.addEventListener('input', () => {
  const keyword = searchInput.value.toLowerCase();

  const filtered = subjects.filter((subject) =>
    subject.toLowerCase().includes(keyword),
  );

  renderSubjects(filtered);
});
