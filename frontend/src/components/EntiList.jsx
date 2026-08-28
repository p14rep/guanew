import { useState, useMemo } from 'react'

function EntiList({ enti, selectedEnte, onSelectEnte, loading, error }) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredEnti = useMemo(() => {
    if (!searchTerm) return enti
    return enti.filter(e =>
      e.label.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [enti, searchTerm])

  return (
    <div className="panel-left">
      <h2>📚 Enti conservatori</h2>
      
      {error && <div className="error">{error}</div>}

      <input
        type="text"
        className="enti-search"
        placeholder="Cerca ente..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {loading && <div className="loading">Caricamento...</div>}

      {!loading && filteredEnti.length === 0 && (
        <div className="loading">Nessun ente trovato</div>
      )}

      <ul className="enti-list">
        {filteredEnti.map((ente) => (
          <li
            key={ente.enteKey}
            className={selectedEnte === ente.enteKey ? 'active' : ''}
            onClick={() => onSelectEnte(ente.enteKey)}
            title={ente.label}
          >
            {ente.label}
          </li>
        ))}
      </ul>

      <div className="loading" style={{ marginTop: '20px' }}>
        {filteredEnti.length} enti
      </div>
    </div>
  )
}

export default EntiList
