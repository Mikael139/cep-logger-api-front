import { useState, useEffect } from 'react';
import { ArrowLeft, Trash2 } from 'lucide-react';

const API_URL = 'http://localhost:8080';

export default function FavoritesView({ auth, setCurrentView, setMessage }) {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [favoriteMessage, setFavoriteMessage] = useState('');

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    setIsLoading(true);
    setFavoriteMessage('');
    try {
      const headers = {
        'Authorization': `Basic ${btoa(`${auth.email}:${auth.password}`)}`,
      };
      const response = await fetch(`${API_URL}/favoritos`, { headers });
      const data = await response.json();

      if (response.ok) {
        setFavorites(data);
      } else {
        setFavoriteMessage(data.message || 'Erro ao carregar favoritos.');
      }
    } catch (error) {
      setFavoriteMessage('Erro de conexão com a API.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteFavorite = async (id) => {
    setFavoriteMessage('');
    try {
      const headers = {
        'Authorization': `Basic ${btoa(`${auth.email}:${auth.password}`)}`,
      };
      const response = await fetch(`${API_URL}/favoritos/${id}`, {
        method: 'DELETE',
        headers,
      });

      if (response.ok) {
        setFavoriteMessage('CEP desfavoritado com sucesso!');
        setFavorites(favorites.filter(fav => fav.id !== id));
      } else {
        setFavoriteMessage('Erro ao desfavoritar o CEP.');
      }
    } catch (error) {
      setFavoriteMessage('Erro de conexão com a API.');
    }
  };

  return (
    <div className="bg-white p-4 p-md-5 rounded shadow-lg" style={{ width: '100%', maxWidth: '500px' }}>
      <div className="d-flex align-items-center mb-4">
        <button
          onClick={() => setCurrentView('cep-search')}
          className="btn btn-link p-0 text-primary"
        >
          <ArrowLeft size={20} className="me-2" />
          Voltar
        </button>
        <h1 className="h4 text-center fw-bold flex-grow-1 m-0">Meus Favoritos</h1>
      </div>

      {favoriteMessage && <p className="mb-4 text-danger text-center">{favoriteMessage}</p>}

      {isLoading ? (
        <p className="text-center text-secondary">Carregando favoritos...</p>
      ) : (
        <ul className="list-group">
          {favorites.length > 0 ? (
            favorites.map((fav) => (
              <li key={fav.id} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <p className="fw-semibold mb-1">{fav.logradouro}</p>
                  <p className="text-muted small mb-1">{fav.bairro}, {fav.localidade} - {fav.uf}</p>
                  <p className="text-muted small m-0">CEP: {fav.cep}</p>
                </div>
                <button
                  onClick={() => handleDeleteFavorite(fav.id)}
                  className="btn btn-outline-danger btn-sm"
                >
                  <Trash2 size={16} />
                </button>
              </li>
            ))
          ) : (
            <p className="text-center text-secondary">Nenhum CEP favorito encontrado.</p>
          )}
        </ul>
      )}
    </div>
  );
}
