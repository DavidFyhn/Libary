import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { authorsAtom, Author } from '../atoms/authorAtoms';
import { AuthorsClient, AuthorDto } from '../api/client';
import { baseUrl } from '../baseUrl';

export default function Authors() {
  const [authors, setAuthors] = useAtom(authorsAtom);
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);
  const [deletingAuthorId, setDeletingAuthorId] = useState<string | null>(null);

  const [newAuthorName, setNewAuthorName] = useState('');
  const [editingAuthorName, setEditingAuthorName] = useState('');

  const client = new AuthorsClient(baseUrl);

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const fetchedAuthors = await client.getAuthors();
        setAuthors(fetchedAuthors);
      } catch (error) {
        console.error("Failed to fetch authors:", error);
      }
    };

    if (authors.length === 0) {
        fetchAuthors();
    }
  }, [authors.length, setAuthors]);

  const handleCreateAuthor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newAuthorDto = new AuthorDto({ name: newAuthorName });
      const createdAuthor = await client.postAuthor(newAuthorDto);
      setAuthors([...authors, createdAuthor as Author]);
      setNewAuthorName('');
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Failed to create author:", error);
    }
  };

  const handleUpdateAuthor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAuthor) return;
    try {
      const updatedDto = new AuthorDto({ name: editingAuthorName });
      await client.putAuthor(editingAuthor.id, updatedDto);
      setAuthors(authors.map(a => a.id === editingAuthor.id ? { ...a, name: editingAuthorName } : a));
      setIsEditModalOpen(false);
      setEditingAuthor(null);
    } catch (error) {
      console.error("Failed to update author:", error);
    }
  };

  const handleDeleteAuthor = async () => {
    if (!deletingAuthorId) return;
    try {
      await client.deleteAuthor(deletingAuthorId);
      setAuthors(authors.filter(a => a.id !== deletingAuthorId));
      setIsDeleteModalOpen(false);
      setDeletingAuthorId(null);
    } catch (error) {
      console.error("Failed to delete author:", error);
    }
  };

  const openCreateModal = () => {
    setNewAuthorName('');
    setIsCreateModalOpen(true);
  };

  const openEditModal = (author: Author) => {
    setEditingAuthor(author);
    setEditingAuthorName(author.name);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (id: string) => {
    setDeletingAuthorId(id);
    setIsDeleteModalOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Authors</h2>
        <button className="btn btn-primary" onClick={openCreateModal}>Create New Author</button>
      </div>

      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {authors.map((author, index) => (
              <tr key={author.id} className="hover">
                <th>{index + 1}</th>
                <td>{author.name}</td>
                <td>
                  <button className="btn btn-sm btn-outline btn-info mr-2" onClick={() => openEditModal(author)}>Edit</button>
                  <button className="btn btn-sm btn-outline btn-error" onClick={() => openDeleteModal(author.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Author Modal */}
      <dialog className={`modal ${isCreateModalOpen ? 'modal-open' : ''}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Create a New Author</h3>
          <form onSubmit={handleCreateAuthor}>
            <div className="form-control">
              <label className="label"><span className="label-text">Name</span></label>
              <input type="text" placeholder="Author's Name" className="input input-bordered" value={newAuthorName} onChange={(e) => setNewAuthorName(e.target.value)} required />
            </div>
            <div className="modal-action mt-4">
              <button type="button" className="btn" onClick={() => setIsCreateModalOpen(false)}>Close</button>
              <button type="submit" className="btn btn-primary">Save</button>
            </div>
          </form>
        </div>
      </dialog>

      {/* Edit Author Modal */}
      <dialog className={`modal ${isEditModalOpen ? 'modal-open' : ''}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Edit Author</h3>
          <form onSubmit={handleUpdateAuthor}>
            <div className="form-control">
              <label className="label"><span className="label-text">Name</span></label>
              <input type="text" placeholder="Author's Name" className="input input-bordered" value={editingAuthorName} onChange={(e) => setEditingAuthorName(e.target.value)} required />
            </div>
            <div className="modal-action mt-4">
              <button type="button" className="btn" onClick={() => setIsEditModalOpen(false)}>Close</button>
              <button type="submit" className="btn btn-primary">Save</button>
            </div>
          </form>
        </div>
      </dialog>

      {/* Delete Author Modal */}
      <dialog className={`modal ${isDeleteModalOpen ? 'modal-open' : ''}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">Confirm Deletion</h3>
          <p className="py-4">Are you sure you want to delete this author?</p>
          <div className="modal-action">
            <button className="btn" onClick={() => setIsDeleteModalOpen(false)}>Cancel</button>
            <button className="btn btn-error" onClick={handleDeleteAuthor}>Delete</button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
