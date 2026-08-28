import { useState, useEffect } from 'react'
import axios from 'axios'
import EntiList from './components/EntiList'
import AlberoTree from './components/AlberoTree'
import IsadCard from './components/IsadCard'

// CAMBIA QUESTO CON L'URL DEL TUO BACKEND RAILWAY
const API_BASE = 'https://guanew-production.up.railway.app/api'

function App() {
  const [enti, setEnti] = useState([])
  const [selectedEnte, setSelectedEnte] = useState(null)
  const [albero, setAlbero] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)
  const [isadData, setIsadData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchEnti()
  }, [])

  useEffect(() => {
    if (selectedEnte) {
      fetchAlbero(selectedEnte)
      setSelectedItem(null)
      setIsadData(null)
    }
  }, [selectedEnte])

  useEffect(() => {
    if (selectedItem && selectedEnte) {
      fetchIsad(selectedEnte, selectedItem.keyProg)
    }
  }, [selectedItem, selectedEnte])

  const fetchEnti = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await axios.get(`${API_BASE}/enti`)
      setEnti(response.data)
    } catch (err) {
      setError('Errore nel caricamento degli enti: ' + err.message)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchAlbero = async (enteKey) => {
    try {
      setLoading(true)
      setError(null)
      const response = await axios.get(`${API_BASE}/albero/${enteKey}`)
      setAlbero(response.data.items)
    } catch (err) {
      setError('Errore nel caricamento dell\'albero: ' + err.message)
      console.error(err)
      setAlbero([])
    } finally {
      setLoading(false)
    }
  }

  const fetchIsad = async (enteKey, progKey) => {
    try {
      setLoading(true)
      setError(null)
      const response = await axios.get(`${API_BASE}/isad/${enteKey}/${progKey}`)
      setIsadData(response.data.data)
    } catch (err) {
      setError('Errore nel caricamento della scheda: ' + err.message)
      console.error(err)
      setIsadData(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="header">
        <h1>🏛️ Guarini Archivi</h1>
        <p>Interfaccia moderna per l'accesso agli archivi storici del Piemonte</p>
      </div>

      <div className="container">
        <EntiList
          enti={enti}
          selectedEnte={selectedEnte}
          onSelectEnte={setSelectedEnte}
          loading={loading}
          error={error}
        />

        <AlberoTree
          albero={albero}
          selectedItem={selectedItem}
          onSelectItem={setSelectedItem}
          loading={loading}
          selectedEnte={selectedEnte}
        />

        <IsadCard
          data={isadData}
          selectedItem={selectedItem}
          loading={loading}
          error={error}
        />
      </div>

      <div className="footer">
        <p>Guarini Archivi Web - Regione Piemonte | UI Moderna 2024</p>
      </div>
    </>
  )
}

export default App
