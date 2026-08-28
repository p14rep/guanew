function IsadCard({ data, selectedItem, loading, error }) {
  if (!selectedItem) {
    return (
      <div className="panel-right">
        <div className="isad-empty">
          <p>👆 Seleziona un elemento dall'albero</p>
          <p style={{ fontSize: '12px', color: '#ccc' }}>
            per visualizzare i dettagli della scheda
          </p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="panel-right">
        <div className="loading" style={{ paddingTop: '60px' }}>
          Caricamento scheda...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="panel-right">
        <div className="error">{error}</div>
      </div>
    )
  }

  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="panel-right">
        <h2>{selectedItem.label}</h2>
        <div className="isad-empty">
          <p>Nessun dato disponibile</p>
        </div>
      </div>
    )
  }

  const formatKey = (key) => {
    return key
      .replace(/_/g, ' ')
      .replace(/\(quantità\)/, '(Quantità)')
      .replace(/\(it\)/, '(IT)')
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  return (
    <div className="panel-right">
      <h2>{selectedItem.label}</h2>

      <table className="isad-table">
        <tbody>
          {Object.entries(data).map(([key, value]) => (
            <tr key={key}>
              <th>{formatKey(key)}</th>
              <td>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default IsadCard
