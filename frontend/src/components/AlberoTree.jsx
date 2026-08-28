import { useState, useMemo } from 'react'

function AlberoTree({ albero, selectedItem, onSelectItem, loading, selectedEnte }) {
  const [expandedItems, setExpandedItems] = useState({})

  const toggleExpanded = (keyProg) => {
    setExpandedItems((prev) => ({
      ...prev,
      [keyProg]: !prev[keyProg]
    }))
  }

  const treeStructure = useMemo(() => {
    const tree = []
    const itemMap = {}

    albero.forEach((item, idx) => {
      itemMap[idx] = { ...item, children: [] }
    })

    albero.forEach((item, idx) => {
      if (item.indent === 0) {
        tree.push(itemMap[idx])
      } else {
        for (let i = idx - 1; i >= 0; i--) {
          if (albero[i].indent < item.indent) {
            itemMap[i].children.push(itemMap[idx])
            break
          }
        }
      }
    })

    return tree
  }, [albero])

  const renderItem = (item, idx) => {
    const isExpanded = expandedItems[item.keyProg]
    const hasChildren = item.children && item.children.length > 0

    return (
      <div key={`${item.keyProg}-${idx}`}>
        <div
          className={`albero-item ${
            selectedItem?.keyProg === item.keyProg ? 'active' : ''
          }`}
          style={{ paddingLeft: `${item.indent * 15}px` }}
        >
          {hasChildren && (
            <span
              className="albero-toggle"
              onClick={() => toggleExpanded(item.keyProg)}
            >
              {isExpanded ? '▼' : '▶'}
            </span>
          )}

          {!hasChildren && <span className="albero-indent">📄</span>}

          <span
            className="albero-label"
            onClick={() => onSelectItem(item)}
            title={item.label}
          >
            {item.label}
          </span>
        </div>

        {hasChildren && isExpanded && (
          <div>
            {item.children.map((child, childIdx) => renderItem(child, childIdx))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="panel-center">
      <h2>🌳 Struttura archivio</h2>

      {loading && <div className="loading">Caricamento...</div>}

      {!loading && treeStructure.length === 0 && (
        <div className="loading">
          {selectedEnte ? 'Nessun fondo disponibile' : 'Seleziona un ente'}
        </div>
      )}

      <div className="albero">
        {treeStructure.map((item, idx) => renderItem(item, idx))}
      </div>
    </div>
  )
}

export default AlberoTree
