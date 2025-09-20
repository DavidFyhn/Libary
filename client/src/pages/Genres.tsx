import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { genresAtom, Genre } from '../atoms/genreAtoms';
import { GenresClient, GenreDto } from '../api/client';
import { baseUrl } from '../baseUrl';

export default function Genres() {
  const [genres, setGenres] = useAtom(genresAtom);
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [editingGenre, setEditingGenre] = useState<Genre | null>(null);
  const [deletingGenreId, setDeletingGenreId] = useState<string | null>(null);

  const [newGenreName, setNewGenreName] = useState('');
  const [editingGenreName, setEditingGenreName] = useState('');

  const client = new GenresClient(baseUrl);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const fetchedGenres = await client.getGenres();
        setGenres(fetchedGenres);
      } catch (error) {
        console.error("Failed to fetch genres:", error);
      }
    };

    if (genres.length === 0) {
        fetchGenres();
    }
  }, [genres.length, setGenres]);

  const handleCreateGenre = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newGenreDto = new GenreDto({ name: newGenreName });
      const createdGenre = await client.postGenre(newGenreDto);
      setGenres([...genres, createdGenre as Genre]);
      setNewGenreName('');
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Failed to create genre:", error);
    }
  };

  const handleUpdateGenre = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGenre) return;
    try {
      const updatedDto = new GenreDto({ name: editingGenreName });
      await client.putGenre(editingGenre.id, updatedDto);
      setGenres(genres.map(g => g.id === editingGenre.id ? { ...g, name: editingGenreName } : g));
      setIsEditModalOpen(false);
      setEditingGenre(null);
    } catch (error) {
      console.error("Failed to update genre:", error);
    }
  };

  const handleDeleteGenre = async () => {
    if (!deletingGenreId) return;
    try {
      await client.deleteGenre(deletingGenreId);
      setGenres(genres.filter(g => g.id !== deletingGenreId));
      setIsDeleteModalOpen(false);
      setDeletingGenreId(null);
    } catch (error) {
      console.error("Failed to delete genre:", error);
    }
  };

  const openCreateModal = () => {
    setNewGenreName('');
    setIsCreateModalOpen(true);
  };

  const openEditModal = (genre: Genre) => {
    setEditingGenre(genre);
    setEditingGenreName(genre.name);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (id: string) => {
    setDeletingGenreId(id);
    setIsDeleteModalOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Genres</h2>
        <button className="btn btn-primary" onClick={openCreateModal}>Create New Genre</button>
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
            {genres.map((genre, index) => (
              <tr key={genre.id} className="hover">
                <th>{index + 1}</th>
                <td>{genre.name}</td>
                <td>
                  <button className="btn btn-sm btn-outline btn-info mr-2" onClick={() => openEditModal(genre)}>Edit</button>
                  <button className="btn btn-sm btn-outline btn-error" onClick={() => openDeleteModal(genre.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Genre Modal */}
      <dialog className={`modal ${isCreateModalOpen ? 'modal-open' : ''}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Create a New Genre</h3>
          <form onSubmit={handleCreateGenre}>
            <div className="form-control">
              <label className="label"><span className="label-text">Name</span></label>
              <input type="text" placeholder="Genre Name" className="input input-bordered" value={newGenreName} onChange={(e) => setNewGenreName(e.target.value)} required />
            </div>
            <div className="modal-action mt-4">
              <button type="button" className="btn" onClick={() => setIsCreateModalOpen(false)}>Close</button>
              <button type="submit" className="btn btn-primary">Save</button>
            </div>
          </form>
        </div>
      </dialog>

      {/* Edit Genre Modal */}
      <dialog className={`modal ${isEditModalOpen ? 'modal-open' : ''}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Edit Genre</h3>
          <form onSubmit={handleUpdateGenre}>
            <div className="form-control">
              <label className="label"><span className="label-text">Name</span></label>
              <input type="text" placeholder="Genre Name" className="input input-bordered" value={editingGenreName} onChange={(e) => setEditingGenreName(e.target.value)} required />
            </div>
            <div className="modal-action mt-4">
              <button type="button" className="btn" onClick={() => setIsEditModalOpen(false)}>Close</button>
              <button type="submit" className="btn btn-primary">Save</button>
            </div>
          </form>
        </div>
      </dialog>

      {/* Delete Genre Modal */}
      <dialog className={`modal ${isDeleteModalOpen ? 'modal-open' : ''}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">Confirm Deletion</h3>
          <p className="py-4">Are you sure you want to delete this genre?</p>
          <div className="modal-action">
            <button className="btn" onClick={() => setIsDeleteModalOpen(false)}>Cancel</button>
            <button className="btn btn-error" onClick={handleDeleteGenre}>Delete</button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
