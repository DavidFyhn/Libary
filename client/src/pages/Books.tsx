import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { booksAtom } from '../atoms/bookAtoms';
import { BooksClient } from '../api/client';
import { baseUrl } from '../baseUrl';

export default function Books() {
  const [books, setBooks] = useAtom(booksAtom);
  const client = new BooksClient(baseUrl);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const fetchedBooks = await client.getBooks();
        setBooks(fetchedBooks);
      } catch (error) {
        console.error("Failed to fetch books:", error);
      }
    };

    // Fetch books only if the list is empty
    if (books.length === 0) {
        fetchBooks();
    }
  }, [books.length, setBooks]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Books</h2>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th></th>
              <th>Title</th>
              <th>Pages</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book, index) => (
              <tr key={book.id} className="hover">
                <th>{index + 1}</th>
                <td>{book.title}</td>
                <td>{book.pages}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
