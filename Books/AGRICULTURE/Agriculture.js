import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import {
  getDatabase,
  ref,
  onValue,
  remove,
  update,
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js';
import { firebaseConfig } from '../../firebaseConfig.js';
import {
  getAuth,
  onAuthStateChanged,
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const bsisRef = ref(db, 'Books/AGRICULTURE');
const auth = getAuth(app);
// DOM Elements
const tableBody = document.getElementById('bsisTable');
const searchInput = document.getElementById('searchInput');
const filterSelect = document.getElementById('filterOption');
const outdatedButton = document.getElementById('outdatedBooks');
const allRecordButton = document.getElementById('allRecord');
const pageStart = document.getElementById('pageStart');
const pageEnd = document.getElementById('pageEnd');
const totalEntries = document.getElementById('totalEntries');

// Pagination Elements
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const pageContainer = document.getElementById('pageContainer');

// Variables
let books = []; // all books from Firebase
let filteredBooks = []; // after search/filter
let currentPage = 1;
const booksPerPage = 10;

// -------------------
// FETCH DATA FROM FIREBASE
// -------------------
onAuthStateChanged(auth, (user) => {
  if (!user) {
    alert('Not authenticated. Redirecting to login.');
    window.location.href = '../../login/login.html';
    return;
  }

  console.log('Authenticated UID:', user.uid);

  onValue(bsisRef, (snapshot) => {
    if (!snapshot.exists()) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="11" class="px-6 py-6 text-center text-slate-400">
            No AGRI records found
          </td>
        </tr>`;
      books = [];
      filteredBooks = [];
      renderTablePage();
      return;
    }

    const rawData = snapshot.val();
    books = [];

    for (const year in rawData) {
      for (const id in rawData[year]) {
        books.push({
          bookId: id,
          year,
          ...rawData[year][id],
        });
      }
    }

    document.getElementById('totalVolume').textContent = books.length;
    filteredBooks = [...books];
    currentPage = 1;
    renderTablePage();
  });
});

// -------------------
// SEARCH & FILTER
// -------------------
let searchTimeout;
searchInput.addEventListener('input', () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    const keyword = searchInput.value.toLowerCase().trim();
    const selectedFilter = filterSelect.value;

    if (!keyword) {
      filteredBooks = [...books];
    } else {
      filteredBooks = books.filter((book) => {
        const fieldValue = book[selectedFilter];
        return (
          fieldValue && fieldValue.toString().toLowerCase().includes(keyword)
        );
      });
    }

    currentPage = 1;
    renderTablePage();
  }, 300);
});

// -------------------
// FILTER OUTDATED BOOKS
// -------------------
outdatedButton.addEventListener('click', () => {
  const currentYear = new Date().getFullYear();
  filteredBooks = books.filter(
    (book) => currentYear - Number(book.recency) > 10,
  );
  currentPage = 1;
  renderTablePage();
});

// -------------------
// SHOW ALL RECORDS
// -------------------
allRecordButton.addEventListener('click', () => {
  filteredBooks = [...books];
  currentPage = 1;
  renderTablePage();
});

// -------------------
// RENDER TABLE
// -------------------
function renderTable(booksArray) {
  tableBody.innerHTML = '';
  if (booksArray.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="11" class="px-6 py-6 text-center text-slate-400">
          No records to display
        </td>
      </tr>`;
    return;
  }

  booksArray.forEach((book) => {
    const currentYear = new Date().getFullYear();
    const recencyValue = currentYear - Number(book.recency);
    const needsReview = recencyValue > 10;
    const recencyColor = needsReview
      ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
      : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';

    let bookNameHTML = `<p class="text-sm font-semibold text-slate-900 dark:text-white">${book.bookName}</p>`;
    if (needsReview) {
      bookNameHTML += `
        <span class="mt-1 flex items-center gap-1 text-[10px] font-medium text-red-500">
          <span class="material-symbols-outlined text-xs">history</span>
          Needs Review (10+ Years)
        </span>`;
    }

    const typeColors = {
      Textbook:
        'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
      'Reference Book':
        'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
      'E-book':
        'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
      Book: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
      'Scholarly Books':
        'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
      'Fiction Books':
        'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300',
      'Non-Fiction Books':
        'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
      Biographies:
        'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
      'Poetry Books':
        'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
      Cookbooks:
        'bg-lime-100 text-lime-700 dark:bg-lime-900/40 dark:text-lime-300',
      'Self-Help Books':
        'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300',
    };

    const Curriculum = {
      '1st Yr - 1st Sem':
        'bg-orange-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300',
      '1st Yr - 2nd Sem':
        'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
      '2nd Yr - 1st Sem':
        'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
      '2nd Yr - 2nd Sem':
        'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
      '3rd Yr - 1st Sem':
        'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
      '3rd Yr - 2nd Sem':
        'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
      '4th Yr - 1st Sem':
        'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
      '4th Yr - 2nd Sem':
        'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
    };

    const typeClass = typeColors[book.type] || '';
    const CurriculumYear = Curriculum[book.year] || '';

    const row = document.createElement('tr');
    row.className =
      'transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/30';
    row.innerHTML = `
      <td class="text-primary px-6 py-4 font-mono text-sm font-medium">${book.CallNumber || '-'}</td><td class="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 relative group transition-colors hover:bg-slate-100 dark:hover:bg-slate-800/50 cursor-help">
  <div class="line-clamp-3">
    ${bookNameHTML || '-'}
  </div>

  <div class="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity absolute z-50 bottom-[80%] left-6 w-72 p-3  bg-slate-900 dark:bg-slate-900 text-white text-xs rounded-lg shadow-xl pointer-events-none border border-slate-700">
    <div class="font-bold mb-1  text-blue-400">Author:</div>
    ${bookNameHTML || 'No author listed'}
    
     <div class="absolute -bottom-1 left-4 w-2 h-2 bg-white dark:bg-slate-900 border-b border-r border-slate-200 dark:border-slate-700 rotate-45"></div>
  </div>
</td>
    
      <td class="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
        <span class="rounded-full px-2.5 py-1 text-xs font-bold ${recencyColor}">${book.recency}</span>
      </td>
<td class="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 relative group transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50">
  <div class="line-clamp-2">
    ${book.author || '-'}
  </div>

  <div class="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 absolute z-50 bottom-full left-6 mb-2 w-64 p-3 
              bg-white dark:bg-slate-900 
              text-slate-700 dark:text-slate-200 
              text-xs rounded-lg shadow-2xl 
              border border-slate-200 dark:border-slate-700 
              pointer-events-none">
    
    <div class="font-semibold mb-1 text-primary dark:text-blue-400">Author(s):</div>
    ${book.author || 'No author listed'}

    <div class="absolute -bottom-1 left-4 w-2 h-2 bg-white dark:bg-slate-900 border-b border-r border-slate-200 dark:border-slate-700 rotate-45"></div>
  </div>
</td>
      <td class="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">${book.Subject || '-'}</td>
      <td class="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">${book.PlaceofPublication || '-'}</td>
      <td class="px-6 text-center py-4">
        <span class="rounded-full px-2.5 whitespace-nowrap py-1 text-[10px] font-bold uppercase ${typeClass}">${book.type}</span>
      </td>
      <td class="px-6 py-4 text-sm text-center text-slate-600 dark:text-slate-400">${book.Volume || '-'}</td>
      <td class="px-6 py-4">
        <span class="rounded-full px-2.5 whitespace-nowrap py-1 text-[10px] font-bold uppercase ${CurriculumYear}">${book.year}</span>
      </td>
      <td class="px-6 py-4 text-center text-sm text-slate-600 dark:text-slate-400">${book.Location || '-'}</td>
      <td class="px-6 py-4 text-right">
        <div class="flex justify-end gap-2">
          <button onclick="openEditModal('${book.bookId}')" class="p-1.5 text-slate-400 hover:text-primary">
            <span class="material-symbols-outlined text-xl">edit</span>
          </button>
          <button onclick="deleteBook('${book.year}', '${book.bookId}')" class="p-1.5 text-slate-400 hover:text-red-500">
            <span class="material-symbols-outlined text-xl">delete</span>
          </button>
        </div>
      </td>`;
    tableBody.appendChild(row);
  });
}

function renderPagination() {
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  // Clear existing numbered buttons only
  const oldPageButtons = pageContainer.querySelectorAll('.pageBtn');
  oldPageButtons.forEach((btn) => btn.remove());

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.className = `pageBtn  hidden sm:flex h-8 w-8 items-center justify-center rounded text-xs font-bold transition-all ${
      i === currentPage
        ? 'bg-primary text-white shadow-md scale-110'
        : 'border border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800'
    }`;
    btn.textContent = i;
    btn.addEventListener('click', () => {
      currentPage = i;
      renderTablePage();
    });
    // Insert before Next button
    pageContainer.insertBefore(btn, nextBtn);
  }

  // Update button states
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages || totalPages === 0;

  // Style disabled state
  [prevBtn, nextBtn].forEach((btn) => {
    btn.style.opacity = btn.disabled ? '0.3' : '1';
    btn.style.cursor = btn.disabled ? 'not-allowed' : 'pointer';
  });
}

function renderTablePage() {
  const start = (currentPage - 1) * booksPerPage;
  const end = start + booksPerPage;
  renderTable(filteredBooks.slice(start, end));

  pageStart.textContent = filteredBooks.length === 0 ? 0 : start + 1;
  pageEnd.textContent = Math.min(end, filteredBooks.length);
  totalEntries.textContent = filteredBooks.length;

  renderPagination();
}

// -------------------
// PREV/NEXT BUTTON EVENTS
// -------------------
prevBtn.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    renderTablePage();
  }
});
nextBtn.addEventListener('click', () => {
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    renderTablePage();
  }
});

// DELETE BOOK

window.deleteBook = function (year, bookId) {
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel',

    background: '#0f172a',
    color: '#f8fafc',
    iconColor: '#f59e0b',
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#64748b',
  }).then((result) => {
    if (result.isConfirmed) {
      const bookRef = ref(db, `Books/AGRICULTURE/${year}/${bookId}`);

      remove(bookRef)
        .then(() => {
          books = books.filter((b) => b.bookId !== bookId);
          filteredBooks = filteredBooks.filter((b) => b.bookId !== bookId);
          renderTablePage();

          Swal.fire({
            title: 'Deleted!',
            text: 'The record has been successfully deleted.',
            icon: 'success',
            background: '#0f172a',
            color: '#f8fafc',
            confirmButtonColor: '#3b82f6',
          });
        })
        .catch((error) => {
          console.error('Delete failed: ', error);
          Swal.fire({
            title: 'Error!',
            text: 'Failed to delete the record. Please try again.',
            icon: 'error',
            background: '#0f172a',
            color: '#f8fafc',
          });
        });
    }
  });
};
// EDIT MODAL
// -------------------
window.openModal = () =>
  document.getElementById('editModal').classList.remove('hidden');
window.closeModal = () =>
  document.getElementById('editModal').classList.add('hidden');

window.openEditModal = function (bookId) {
  const book = books.find((b) => b.bookId === bookId);
  if (!book) return;
  document.getElementById('editBookName').value = book.bookName || '';
  document.getElementById('editCallNumber').value = book.CallNumber || '';
  document.getElementById('editAuthor').value = book.author || '';
  document.getElementById('editPubYear').value = book.recency || '';
  document.getElementById('editPlace').value = book.PlaceofPublication || '';
  document.getElementById('editType').value = book.type || '';
  document.getElementById('editVolume').value = book.Volume || '';
  document.getElementById('editLocation').value = book.Location || '';
  window.currentEdit = { bookId, year: book.year };
  openModal();
};

window.saveEdit = function () {
  if (!window.currentEdit) return;

  Swal.fire({
    title: 'Saving changes...',
    allowOutsideClick: false,
    background: '#0f172a',
    color: '#f8fafc',
    didOpen: () => {
      Swal.showLoading();
    },
  });

  const { bookId, year } = window.currentEdit;
  const updates = {
    bookName: document.getElementById('editBookName').value,
    CallNumber: document.getElementById('editCallNumber').value,
    author: document.getElementById('editAuthor').value,
    recency: document.getElementById('editPubYear').value,
    PlaceofPublication: document.getElementById('editPlace').value,
    type: document.getElementById('editType').value,
    Volume: document.getElementById('editVolume').value,
    Location: document.getElementById('editLocation').value,
  };

  const bookRef = ref(db, `Books/AGRICULTURE/${year}/${bookId}`);

  update(bookRef, updates)
    .then(() => {
      const index = books.findIndex((b) => b.bookId === bookId);
      if (index !== -1) {
        books[index] = { ...books[index], ...updates };
      }
      filteredBooks = [...books];

      renderTablePage();
      closeModal();

      Swal.fire({
        icon: 'success',
        title: 'Updated!',
        text: 'The book details have been saved successfully.',
        timer: 2000,
        showConfirmButton: false,
        background: '#0f172a',
        color: '#f8fafc',
        iconColor: '#22c55e',
      });
    })
    .catch((error) => {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong: ' + error.message,
        background: '#0f172a',
        color: '#f8fafc',
        confirmButtonColor: '#3b82f6',
      });
    });
};
// download pdf

document.getElementById('downloadPDF').addEventListener('click', () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF('landscape');

  // Title
  doc.setFontSize(9);
  doc.setTextColor(25, 127, 230); // modern blue
  const today = new Date().toLocaleDateString();
  doc.text(
    `BSIS Library Holdings Report / Generated on: ${today}`,
    105,
    15, // <- bawas dito mula 20 to 15
    { align: 'center' },
  );

  const headers = [
    [
      'Call Number',
      'Book Name',
      'Book Year',
      'Author',
      'Subject Related',
      'Place of Publication',
      'Type',
      'Volume',
      'Curriculum Year',
      'Location',
    ],
  ];

  const rows = [];

  document.querySelectorAll('#bsisTable tr').forEach((row) => {
    if (row.style.display === 'none') return;
    const cells = row.querySelectorAll('td');
    if (cells.length === 0) return;

    rows.push([
      cells[0]?.innerText.trim(),
      cells[1]?.innerText.trim(),
      cells[2]?.innerText.trim(),
      cells[3]?.innerText.trim(),
      cells[4]?.innerText.trim(),
      cells[5]?.innerText.trim(),
      cells[6]?.innerText.trim(),
      cells[7]?.innerText.trim(),
      cells[8]?.innerText.trim(),
      cells[9]?.innerText.trim(),
    ]);
  });

  if (rows.length === 0) {
    alert('No filtered book data available for download.');
    return;
  }

  // Modern table
  doc.autoTable({
    head: headers,
    body: rows,
    startY: 22, // <- bawas mula 35 to 22
    styles: {
      font: 'helvetica',
      fontSize: 9,
      cellPadding: 3,
      textColor: 50,
      lineColor: 200,
      lineWidth: 0.3,
    },
    headStyles: {
      fillColor: [25, 127, 230],
      textColor: 255,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [240, 248, 255], // light blue alternate
    },
    columnStyles: {
      1: { cellWidth: 50 }, // Book Name wider
      6: { cellWidth: 25 }, // Type smaller
    },
    margin: { top: 10, left: 10, right: 10 }, // <- bawas margin top
    tableLineWidth: 0.2,
    tableLineColor: 180,
  });

  doc.save('Agriculture.pdf');
});
