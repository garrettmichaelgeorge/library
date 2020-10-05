'use strict'

const myLibraryData = []

window.onload = () => onLoad()

function onLoad () {
  const form = document.querySelector('#new-book-form')
  const bookList = document.querySelector('#section-books')
  const btnShow = document.querySelector('#btn-show-new-book-form')
  const btnCancel = document.querySelector('#btn-cancel')

  seedBooks()
  createCards()
  createForm()
  console.table(myLibrary())

  btnShow.addEventListener('click', e => {
    show(form)
    hide(bookList)
  })

  btnCancel.addEventListener('click', e => {
    e.preventDefault()
    hide(form)
    show(bookList)
  })

  form.addEventListener('submit', e => {
    e.preventDefault()
    const title = document.getElementById('form-title').value
    const author = document.getElementById('form-author').value
    const pageCount = document.getElementById('form-pageCount').value
    const isRead = document.getElementById('form-isRead').value
    const aBook = new Book(title, author, pageCount, isRead)

    addBookToLibrary(aBook)
    createCard(aBook)
    hide(form)
    show(bookList)
  })

  function seedBooks () {
    [
      new Book('The Hobbit', 'Tolkien', 249, true),
      new Book('The Lord of the Rings', 'Tolkien', 1010, true),
      new Book('The Odyssey', 'Homer', 210, true)
    ]
      .forEach(book => addBookToLibrary(book))
  }
}

function Book (title, author, pageCount, isRead) {
  this.title = title
  this.author = author
  this.pageCount = pageCount
  this.isRead = isRead
  this.info = () => {
    let result = ''
    result += `by ${this.author}, `
    result += `${this.pageCount} pages, `
    result += `${this.isRead ? 'read' : 'not read yet'}`
    return result
  },
  this.toggleReadStatus = () => { this.isRead = !this.isRead }
}

function addBookToLibrary (aBook) {
  myLibrary().push(aBook)
}

// DOM Functions
function createForm () {
  const formList = document.querySelector('#form-list')

  getParamNames(Book).forEach(param => {
    const li = document.createElement('li')
    li.classList.add('form-item')

    const label = document.createElement('label')
    label.textContent = `${param} `

    const input = document.createElement('input')
    // FIXME: find correct input type
    input.type = param.startsWith('is') ? 'checkbox' : 'text'
    input.id = `form-${param}`
    input.name = `${param}`

    formList.appendChild(li)
    li.appendChild(label)
    label.appendChild(input)
  })
}

function createCards () {
  myLibrary().forEach(aBook => createCard(aBook))
}

function createCard (aBook) {
  const cardWrapper = document.querySelector('#books-wrapper')
  const card = document.createElement('div')
  card.classList.add('card')
  card.dataset.libraryIndex = libraryIndexOf(aBook)
  cardWrapper.append(card)

  const h3 = document.createElement('h3')
  const p = document.createElement('p')
  const btnDestroy = document.createElement('button')
  btnDestroy.classList.add('btn', 'btn-destroy')
  btnDestroy.addEventListener('click', e => removeFromLibrary(e.target.value))
  const cardContents = [h3, p]
  h3.classList.add('card-header', 'h3')
  h3.textContent = aBook.title
  p.textContent = aBook.info()
  cardContents.forEach(element => card.append(element))
}

// Display Functions
function show (element) {
  element.classList.remove('d-none')
}

function hide (element) {
  element.classList.add('d-none')
}

// Query functions
function myLibrary () {
  return myLibraryData
}

function libraryIndexOf (aBook) {
  return myLibrary().findIndex(book => book === aBook)
}

function removeFromLibrary (aBook) {
  myLibrary().splice(libraryIndexOf(aBook), 1)
}

// Helper functions
function getParamNames (func) {
  // Fowler-esque refactoring of implementation from
  // https://stackoverflow.com/a/9924463/12344822

  return parseArguments(stripComments(func))

  function stripComments (func) {
    const COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg
    return func
      .toString()
      .replace(COMMENTS, '')
  }

  function parseArguments (fnStr) {
    // const ARGUMENT_NAMES = /([^=]+[^\s,']+)/g
    const ARGUMENT_NAMES = /([^\s,]+)/g
    return fnStr
      .slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')'))
      .match(ARGUMENT_NAMES) ||
      []
  }
}
