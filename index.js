const list = document.getElementById("books");
const form = document.getElementById("book-entry");

const ADD_BOOK = "ADD_BOOK";
const REMOVE_BOOK = "REMOVE_BOOK";
const LOAD_SAVED_DATA = "LOAD_SAVED_DATA";

function generateId() {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
}


function createStore() {
  let state = [];
  const thingsToUpdate = [];

  const update = (action) => {
    if (action.type === ADD_BOOK) {
      state = state.concat([action.book]);
    } else if (action.type === REMOVE_BOOK) {
      state = state.filter((book) => book.id !== action.id);
    } else if (action.type === LOAD_SAVED_DATA) {
      state = action.data;
    }
    thingsToUpdate.forEach((fn) => fn());
  };

  const getState = () => state;

  const onUpdate = (fn) => thingsToUpdate.push(fn);

  return {
    update,
    getState,
    onUpdate,
  };
}

const store = createStore();

function addBook(book) {
  store.update({
    type: ADD_BOOK,
    book,
  });
}

function removeBook(id) {
  store.update({
    type: REMOVE_BOOK,
    id,
  });
}

function loadSavedData(data) {
  store.update({
    type: LOAD_SAVED_DATA,
    data,
  });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = form.elements[0].value;
  const author = form.elements[1].value;
  const id = generateId();

  addBook({ title, author, id });
});

function addBookToDOM(book) {
  const node = document.createElement("li");
  const title = document.createElement("h2");
  title.innerText = book.title;

  const subtitle = document.createElement("p");
  subtitle.innerText = book.author;

  const button = document.createElement("button");
  button.innerText = "Remove";
  button.addEventListener("click", () => removeBook(book.id));

  node.appendChild(title);
  node.appendChild(subtitle);
  node.appendChild(button);

  list.appendChild(node);
}

store.onUpdate(() => {
  list.innerHTML = "";
  const books = store.getState();
  books.forEach(addBookToDOM);
});

store.onUpdate(() => {
  localStorage.setItem("saved-data", JSON.stringify(store.getState()));
});

window.addEventListener("load", () => {
  let saved = localStorage.getItem("saved-data");
  if (saved) {
    const json = JSON.parse(saved);
    loadSavedData(json);
  }
});
