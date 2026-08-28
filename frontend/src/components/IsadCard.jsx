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

  const fieldOrder = [
    'livello_di_descrizione',
    'codice_paese',
    'istituto_di_conservazione',
    'segnatura_definitiva',
    'numero_contenitore_fisico_definitivo',
    'titolo_originale',
    'contenuto',
    'data_specifica',
    'tipologia_fisica',
    'consistenza_(quantità)',
    'condizioni_di_accesso',
    'catalogatore',
    'data_catalogazione',
    'data_modifica_scheda'
  ]

  const orderedData = {}
  fieldOrder.forEach((key) => {
    if (data[key]) {
      orderedData[key] = data[key]
    }
  })

  Object.keys(data).forEach((key) => {
    if (!orderedData[key] && data[key]) {
      orderedData[key] = data[key]
    }
  })

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
          {Object.entries(orderedData).map(([key, value]) => (
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
