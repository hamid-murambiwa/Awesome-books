const list = document.getElementById('add-book');
const form = document.getElementById('book-entry');

const addBooks = 'addBooks';
const removeBooks = 'removeBooks';
const loadData = 'loadData ';

function createId() {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
}

function createStore() {
  let state = [];
  const contentUpdate = [];

  const update = (action) => {
    if (action.type === addBooks) {
      state = state.concat([action.book]);
    } else if (action.type === removeBooks) {
      state = state.filter((book) => book.id !== action.id);
    } else if (action.type === loadData) {
      state = action.data;
    }
    contentUpdate.forEach((fn) => fn());
  };

  const getState = () => state;

  const onUpdate = (fn) => contentUpdate.push(fn);

  return {
    update,
    getState,
    onUpdate,
  };
}

const store = createStore();

function addBook(book) {
  store.update({
    type: addBooks,
    book,
  });
}

function removeBook(id) {
  store.update({
    type: removeBooks,
    id,
  });
}

function loadSavedData(data) {
  store.update({
    type: loadData,
    data,
  });
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const title = form.elements[0].value;
  const author = form.elements[1].value;
  const id = createId();

  addBook({ title, author, id });
});

function addBookToDOM(book) {
  const node = document.createElement('li');
  const title = document.createElement('h2');
  title.innerText = book.title;

  const subtitle = document.createElement('p');
  subtitle.innerText = book.author;

  const button = document.createElement('button');
  button.innerText = 'Remove';

  const hr = document.createElement('hr');

  button.addEventListener('click', () => removeBook(book.id));

  node.appendChild(title);
  node.appendChild(subtitle);
  node.appendChild(button);
  node.appendChild(hr);

  list.appendChild(node);
}

store.onUpdate(() => {
  list.innerHTML = '';
  const books = store.getState();
  books.forEach(addBookToDOM);
});

store.onUpdate(() => {
  localStorage.setItem('saved-data', JSON.stringify(store.getState()));
});

window.addEventListener('load', () => {
  const saved = localStorage.getItem('saved-data');
  if (saved) {
    const json = JSON.parse(saved);
    loadSavedData(json);
  }
});
