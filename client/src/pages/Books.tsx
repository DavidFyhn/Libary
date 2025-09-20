import { useEffect, useState, useCallback } from 'react';
import { useAtom } from 'jotai';
import { booksAtom, type Book } from '../atoms/bookAtoms';
import { authorsAtom, type Author } from '../atoms/authorAtoms';
import { genresAtom, type Genre } from '../atoms/genreAtoms';
import { BooksClient, AuthorsClient, GenresClient, BookDto } from '../api/client';
import { baseUrl } from '../baseUrl';

const initialFormData = {
  title: '',
  pages: 0,
  genreId: undefined as string | undefined,
  authorIds: [] as string[],
};

// THE DEFINITIVE FIX: Move the form component outside the main component
const BookForm = ({ 
  formData, 
  genres, 
  authors, 
  handleFormChange, 
  handlePagesChange,
  onSubmit, 
  onCancel 
}: { 
  formData: typeof initialFormData, 
  genres: Genre[], 
  authors: Author[],
  handleFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void,
  handlePagesChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  onSubmit: (e: React.FormEvent) => void, 
  onCancel: () => void 
}) => (
  <form onSubmit={onSubmit}>
    <div className="form-control">
      <label className="label"><span className="label-text">Title</span></label>
      <input type="text" name="title" placeholder="Book Title" className="input input-bordered" value={formData.title} onChange={handleFormChange} required />
    </div>
    <div className="form-control">
      <label className="label"><span className="label-text">Pages</span></label>
      <input type="number" name="pages" placeholder="Number of Pages" className="input input-bordered" value={formData.pages} onChange={handlePagesChange} required />
    </div>
    <div className="form-control">
      <label className="label"><span className="label-text">Genre</span></label>
      <select name="genreId" className="select select-bordered" value={formData.genreId || ''} onChange={handleFormChange}>
        <option disabled value="">Select a genre</option>
        {genres.map(genre => <option key={genre.id} value={genre.id}>{genre.name}</option>)}
      </select>
    </div>
    <div className="form-control">
      <label className="label"><span className="label-text">Authors</span></label>
      <select multiple name="authorIds" className="select select-bordered" value={formData.authorIds} onChange={handleFormChange}>
        {authors.map(author => <option key={author.id} value={author.id}>{author.name}</option>)}
      </select>
    </div>
    <div className="modal-action mt-4">
      <button type="button" className="btn" onClick={onCancel}>Close</button>
      <button type="submit" className="btn btn-primary">Save</button>
    </div>
  </form>
);

export default function Books() {
  const [books, setBooks] = useAtom(booksAtom);
  const [authors, setAuthors] = useAtom(authorsAtom);
  const [genres, setGenres] = useAtom(genresAtom);
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [deletingBookId, setDeletingBookId] = useState<string | null>(null);

  const [formData, setFormData] = useState(initialFormData);

  const booksClient = new BooksClient(baseUrl);
  const authorsClient = new AuthorsClient(baseUrl);
  const genresClient = new GenresClient(baseUrl);

  const fetchBooks = useCallback(async () => {
    try {
      const fetchedBooks = await booksClient.getBooks();
      setBooks(fetchedBooks);
    } catch (error) {
      console.error("Failed to fetch books:", error);
    }
  }, [booksClient, setBooks]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        if (books.length === 0) await fetchBooks();
        if (authors.length === 0) setAuthors(await authorsClient.getAuthors());
        if (genres.length === 0) setGenres(await genresClient.getGenres());
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
      }
    };
    fetchInitialData();
  }, [books.length, authors.length, genres.length, fetchBooks, authorsClient, genresClient, setAuthors, setGenres]);

  const handleCreateBook = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newBookDto = new BookDto(formData);
      await booksClient.postBook(newBookDto);
      await fetchBooks();
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Failed to create book:", error);
    }
  };

  const handleUpdateBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBook) return;
    try {
      const updatedDto = new BookDto(formData);
      await booksClient.putBook(editingBook.id, updatedDto);
      await fetchBooks();
      setIsEditModalOpen(false);
      setEditingBook(null);
    } catch (error) {
      console.error("Failed to update book:", error);
    }
  };

  const handleDeleteBook = async () => {
    if (!deletingBookId) return;
    try {
      await booksClient.deleteBook(deletingBookId);
      await fetchBooks();
      setIsDeleteModalOpen(false);
      setDeletingBookId(null);
    } catch (error) {
      console.error("Failed to delete book:", error);
    }
  };

  const openCreateModal = () => {
    setFormData(initialFormData);
    setIsCreateModalOpen(true);
  };

  const openEditModal = (book: Book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      pages: book.pages,
      genreId: book.genreId,
      authorIds: book.authorIds,
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (id: string) => {
    setDeletingBookId(id);
    setIsDeleteModalOpen(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (e.target.tagName === 'SELECT' && (e.target as HTMLSelectElement).multiple) {
      const options = (e.target as HTMLSelectElement).options;
      const selectedValues: string[] = [];
      for (let i = 0; i < options.length; i++) {
        if (options[i].selected) {
          selectedValues.push(options[i].value);
        }
      }
      setFormData(prev => ({ ...prev, [name]: selectedValues }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handlePagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({...prev, pages: parseInt(e.target.value) || 0}));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Books</h2>
        <button className="btn btn-primary" onClick={openCreateModal}>Create New Book</button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th></th>
              <th>Title</th>
              <th>Pages</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book, index) => (
              <tr key={book.id} className="hover">
                <th>{index + 1}</th>
                <td>{book.title}</td>
                <td>{book.pages}</td>
                <td>
                  <button className="btn btn-sm btn-outline btn-info mr-2" onClick={() => openEditModal(book)}>Edit</button>
                  <button className="btn btn-sm btn-outline btn-error" onClick={() => openDeleteModal(book.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Book Modal */}
      <dialog className={`modal ${isCreateModalOpen ? 'modal-open' : ''}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Create a New Book</h3>
          <BookForm 
            formData={formData} 
            genres={genres} 
            authors={authors} 
            handleFormChange={handleFormChange}
            handlePagesChange={handlePagesChange}
            onSubmit={handleCreateBook} 
            onCancel={() => setIsCreateModalOpen(false)} 
          />
        </div>
      </dialog>

      {/* Edit Book Modal */}
      <dialog className={`modal ${isEditModalOpen ? 'modal-open' : ''}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Edit Book</h3>
          {editingBook && 
            <BookForm 
              formData={formData} 
              genres={genres} 
              authors={authors} 
              handleFormChange={handleFormChange}
              handlePagesChange={handlePagesChange}
              onSubmit={handleUpdateBook} 
              onCancel={() => setIsEditModalOpen(false)} 
            />
          }
        </div>
      </dialog>

      {/* Delete Book Modal */}
      <dialog className={`modal ${isDeleteModalOpen ? 'modal-open' : ''}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">Confirm Deletion</h3>
          <p className="py-4">Are you sure you want to delete this book?</p>
          <div className="modal-action">
            <button className="btn" onClick={() => setIsDeleteModalOpen(false)}>Cancel</button>
            <button className="btn btn-error" onClick={handleDeleteBook}>Delete</button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
