import { useState } from 'react';
import { Search, Heart, ArrowLeft } from 'lucide-react';

const API_URL = 'http://localhost:8080';

export default function CepSearchView({ auth, isLoggedIn, setCurrentView, setMessage }) {
  const [cep, setCep] = useState('');
  const [cepData, setCepData] = useState(null);
  const [cepMessage, setCepMessage] = useState('');
  const [isFavoriting, setIsFavoriting] = useState(false);

  const handleSearchCep = async () => {
    setCepMessage('');
    setCepData(null);
    try {
      const response = await fetch(`${API_URL}/cep/${cep}`);
      const data = await response.json();
      if (response.ok) {
        setCepData(data);
      } else {
        setCepMessage(data.message || 'CEP não encontrado.');
      }
    } catch (error) {
      setCepMessage('Erro de conexão com a API.');
    }
  };

  const handleFavoriteCep = async () => {
    setIsFavoriting(true);
    setCepMessage('');
    try {
      const headers = {
        'Authorization': `Basic ${btoa(`${auth.email}:${auth.password}`)}`,
      };
      const response = await fetch(`${API_URL}/favoritos?cep=${cep}`, {
        method: 'POST',
        headers,
      });

      if (response.ok) {
        setCepMessage('CEP favoritado com sucesso!');
      } else {
        const data = await response.text();
        setCepMessage(data || 'Erro ao favoritar o CEP.');
      }
    } catch (error) {
      setCepMessage('Erro de conexão com a API.');
    } finally {
      setIsFavoriting(false);
    }
  };

  const handleLogout = () => {
    setMessage('');
    setCurrentView('login');
  };

  return (
    <div className="bg-white p-4 p-md-5 rounded shadow-lg" style={{ width: '100%', maxWidth: '500px' }}>
      <h1 className="h3 text-center fw-bold mb-4">Busca de CEP</h1>
      <div className="input-group mb-3">
        <span className="input-group-text"><Search size={20} /></span>
        <input
          type="text"
          placeholder="Digite o CEP (ex: 01001000)"
          value={cep}
          onChange={(e) => setCep(e.target.value)}
          className="form-control"
        />
        <button
          onClick={handleSearchCep}
          className="btn btn-success"
        >
          Buscar
        </button>
      </div>

      {cepMessage && <p className="mt-3 text-danger text-center">{cepMessage}</p>}

      {cepData && (
        <div className="card mt-4">
          <div className="card-body">
            <h5 className="card-title">Informações do CEP</h5>
            <p className="card-text"><strong>CEP:</strong> {cepData.cep}</p>
            <p className="card-text"><strong>Logradouro:</strong> {cepData.logradouro}</p>
            <p className="card-text"><strong>Bairro:</strong> {cepData.bairro}</p>
            <p className="card-text"><strong>Localidade:</strong> {cepData.localidade} - {cepData.uf}</p>
            {isLoggedIn && (
              <button
                onClick={handleFavoriteCep}
                disabled={isFavoriting}
                className="btn btn-warning mt-3 w-100"
              >
                <Heart size={20} className="me-2" />
                {isFavoriting ? 'Salvando...' : 'Favoritar'}
              </button>
            )}
          </div>
        </div>
      )}

      <div className="d-flex justify-content-between mt-4">
        {isLoggedIn && (
          <button
            onClick={() => setCurrentView('favorites')}
            className="btn btn-outline-secondary"
          >
            Ver Favoritos
          </button>
        )}
        <button
          onClick={handleLogout}
          className="btn btn-danger ms-auto"
        >
          Sair
        </button>
      </div>
    </div>
  );
}
