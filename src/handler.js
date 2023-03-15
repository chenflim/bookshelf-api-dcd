const { nanoid } = require('nanoid')
const books = require('./books')

/** Add Book Handler */

const addBookHandler = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload
  const id = nanoid(16)

  const insertedAt = new Date().toISOString()
  const updatedAt = insertedAt
  const finished = pageCount === readPage

  /** Add book with undefined name */
  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku'
    })
    response.code(400)
    return response
  }

  /** Add book if readPage > pageCount */
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    })
    response.code(400)
    return response
  }

  /** Add book with complete data and finished reading */
  const newBook = {
    id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt
  }

  books.push(newBook)
  const isSuccess = books.filter((book) => book.id === id).length > 0

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id
      }
    })
    response.code(201)
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan'
  })

  response.code(500)
  return response
}

/** Get all books handler */

const getAllBooksHandler = (request, h) => {
  const { reading, finished, name } = request.query

  let filteredBooks = []

  /** Get all books contains name based on the query */
  if (name !== undefined) {
    filteredBooks = books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase())).map(book => ({
      id: book.id,
      name: book.name,
      publisher: book.publisher
    }))
    const response = h.response({
      status: 'success',
      data: {
        books: filteredBooks
      }
    })
    return response
  }

  /** Get all reading and unreading books */
  if (reading !== undefined) {
    if (reading === '1') {
      filteredBooks = books.filter((book) => book.reading === true).map(book => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher
      }))
    } else {
      filteredBooks = books.filter((book) => book.reading === false).map(book => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher
      }))
    }
    const response = h.response({
      status: 'success',
      data: {
        books: filteredBooks
      }
    })
    return response
  }

  /** Get all finished and unfinished books */
  if (finished !== undefined) {
    if (finished === '1') {
      filteredBooks = books.filter((book) => book.finished === true).map(book => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher
      }))
    } else {
      filteredBooks = books.filter((book) => book.finished === false).map(book => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher
      }))
    }
    const response = h.response({
      status: 'success',
      data: {
        books: filteredBooks
      }
    })
    return response
  }

  /** Get all books */
  if (books === undefined) {
    const response = h.response({
      status: 'success',
      data: {
        books: []
      }
    })
    return response
  }
  const response = h.response({
    status: 'success',
    data: {
      books:
        books.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher
        }))
    }
  })
  response.code(200)
  return response
}

/** Get book by id handler */
const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params

  const book = books.filter((n) => n.id === bookId)[0]

  if (book === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan'
    })
    response.code(404)
    return response
  }
  const response = h.response({
    status: 'success',
    data: {
      book
    }
  })
  response.code(200)
  return response
}

/** Edit book by id handler */
const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload

  const updatedAt = new Date().toISOString()
  const index = books.findIndex((book) => book.id === bookId)
  const finished = pageCount === readPage

  /** Update book without name */
  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku'
    })
    response.code(400)
    return response
  }

  /** Update book with readPage > pageCount */
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
    })
    response.code(400)
    return response
  }

  /** Update book with invalid id and complete data */
  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      updatedAt
    }
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui'
    })
    response.code(200)
    return response
  }
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan'
  })
  response.code(404)
  return response
}

/** Delete book by id handler */
const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params
  const index = books.findIndex((book) => book.id === bookId)

  if (index !== -1) {
    books.splice(index, 1)
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus'
    })
    response.code(200)
    return response
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan'
  })
  response.code(404)
  return response
}

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler
}
