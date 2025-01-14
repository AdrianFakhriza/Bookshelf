
const bookForm = document.getElementById('bookForm');
const searchForm = document.getElementById('searchBook');
const incompleteBookList = document.getElementById('incompleteBookList');
const completeBookList = document.getElementById('completeBookList');
const formIsComplete = document.getElementById('bookFormIsComplete');
const formSubmitSpan = document.querySelector('#bookFormSubmit span');

const STORAGE_KEY = 'BOOKSHELF_APPS';
const RENDER_EVENT = 'render-books';

let books = [];

const loadDataFromStorage = () => {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  const data = JSON.parse(serializedData);
  
  if (data !== null) {
    books = data;
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
};

const saveData = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  document.dispatchEvent(new Event(RENDER_EVENT));
};

const generateId = () => {
  return Number(new Date());
};

const createBook = (id, title, author, year, isComplete) => {
  return {
    id,
    title,
    author,
    year: parseInt(year),
    isComplete
  };
};

//Cari buku
const findBook = (bookId) => {
  return books.find(book => book.id === bookId);
};

const findBookIndex = (bookId) => {
  return books.findIndex(book => book.id === bookId);
};

//Tambah buku
const addBook = (event) => {
  event.preventDefault();
  
  const titleInput = document.getElementById('bookFormTitle');
  const authorInput = document.getElementById('bookFormAuthor');
  const yearInput = document.getElementById('bookFormYear');
  const isCompleteInput = document.getElementById('bookFormIsComplete');
  
  const id = generateId();
  const book = createBook(
    id,
    titleInput.value,
    authorInput.value,
    yearInput.value,
    isCompleteInput.checked
  );
  
  books.push(book);
  saveData();
  
  event.target.reset();
};

const createBookElement = (book) => {
  const bookElement = document.createElement('div');
  bookElement.setAttribute('data-bookid', book.id);
  bookElement.setAttribute('data-testid', 'bookItem');
  
  const title = document.createElement('h3');
  title.setAttribute('data-testid', 'bookItemTitle');
  title.innerText = book.title;
  
  const author = document.createElement('p');
  author.setAttribute('data-testid', 'bookItemAuthor');
  author.innerText = `Penulis: ${book.author}`;
  
  const year = document.createElement('p');
  year.setAttribute('data-testid', 'bookItemYear');
  year.innerText = `Tahun: ${book.year}`;
  
  const buttonContainer = document.createElement('div');
  
  const toggleButton = document.createElement('button');
  toggleButton.setAttribute('data-testid', 'bookItemIsCompleteButton');
  toggleButton.innerText = book.isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca';
  toggleButton.onclick = () => {
    toggleBookStatus(book.id);
  };
  
  const deleteButton = document.createElement('button');
  deleteButton.setAttribute('data-testid', 'bookItemDeleteButton');
  deleteButton.innerText = 'Hapus Buku';
  deleteButton.onclick = () => {
    if (confirm('Apakah Anda yakin ingin menghapus buku ini?')) {
      deleteBook(book.id);
    }
  };
  
  const editButton = document.createElement('button');
  editButton.setAttribute('data-testid', 'bookItemEditButton');
  editButton.innerText = 'Edit Buku';
  editButton.onclick = () => {
    editBook(book);
  };
  
  buttonContainer.append(toggleButton, deleteButton, editButton);
  bookElement.append(title, author, year, buttonContainer);
  
  return bookElement;
};

const toggleBookStatus = (bookId) => {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;
  
  bookTarget.isComplete = !bookTarget.isComplete;
  saveData();
};

//Hapus buku
const deleteBook = (bookId) => {
  const bookIndex = findBookIndex(bookId);
  if (bookIndex === -1) return;
  
  books.splice(bookIndex, 1);
  saveData();
};

const editBook = (book) => {
  const titleInput = document.getElementById('bookFormTitle');
  const authorInput = document.getElementById('bookFormAuthor');
  const yearInput = document.getElementById('bookFormYear');
  const isCompleteInput = document.getElementById('bookFormIsComplete');
  
  titleInput.value = book.title;
  authorInput.value = book.author;
  yearInput.value = book.year;
  isCompleteInput.checked = book.isComplete;
  
  deleteBook(book.id);
  
  bookForm.scrollIntoView({ behavior: 'smooth' });
};

const searchBooks = (event) => {
  event.preventDefault();
  const searchTerm = document.getElementById('searchBookTitle').value.toLowerCase();
  
  const filteredBooks = searchTerm
    ? books.filter(book => book.title.toLowerCase().includes(searchTerm))
    : books;
    
  renderBooks(filteredBooks);
};

const renderBooks = (booksToRender = books) => {
  incompleteBookList.innerHTML = '';
  completeBookList.innerHTML = '';
  
  for (const book of booksToRender) {
    const bookElement = createBookElement(book);
    if (book.isComplete) {
      completeBookList.append(bookElement);
    } else {
      incompleteBookList.append(bookElement);
    }
  }
};

formIsComplete.addEventListener('change', (event) => {
  formSubmitSpan.innerText = event.target.checked ? 'Selesai dibaca' : 'Belum selesai dibaca';
});

document.addEventListener('DOMContentLoaded', () => {
  bookForm.addEventListener('submit', addBook);
  searchForm.addEventListener('submit', searchBooks);
  
  loadDataFromStorage();
});

document.addEventListener(RENDER_EVENT, () => {
  renderBooks();
});