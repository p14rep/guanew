import express from 'express';
import cors from 'cors';
import axios from 'axios';
import * as cheerio from 'cheerio';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', process.env.FRONTEND_URL].filter(Boolean),
  credentials: true
}));

app.use(express.json());

const GUARINI_BASE = 'http://www.regione.piemonte.it/guaw';
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

const axiosInstance = axios.create({
  baseURL: GUARINI_BASE,
  headers: {
    'User-Agent': USER_AGENT
  },
  timeout: 10000
});

const cache = {
  enti: null,
  lastFetch: 0,
  ttl: 3600000
};

app.get('/api/enti', async (req, res) => {
  try {
    if (cache.enti && Date.now() - cache.lastFetch < cache.ttl) {
      return res.json(cache.enti);
    }

    const response = await axiosInstance.get('/ListAction.do');
    const $ = cheerio.load(response.data);

    const enti = [];
    const select = $('select[name="enteKey"] option');

    select.each((i, el) => {
      const value = $(el).attr('value');
      const label = $(el).text().trim();
      
      if (value && label && value !== '') {
        enti.push({
          enteKey: value,
          label: label
        });
      }
    });

    cache.enti = enti;
    cache.lastFetch = Date.now();

    res.json(enti);
  } catch (error) {
    console.error('Error fetching enti:', error.message);
    res.status(500).json({ 
      error: 'Errore nel caricamento degli enti',
      details: error.message 
    });
  }
});

app.get('/api/albero/:enteKey', async (req, res) => {
  try {
    const { enteKey } = req.params;

    const response = await axiosInstance.get('/ShowLsAlberoEntiAction.do', {
      params: {
        reload: true,
        operation: 'load',
        enteKey: enteKey,
        soggettoProduttoreKey: '',
        tipoEnteKey: '',
        provincia: '',
        localizEnteKey: ''
      }
    });

    const $ = cheerio.load(response.data);
    const scriptContent = $('script').html() || '';
    
    const pattern = /dbAddAlbero\(true,\s*"([^"]+)",\s*"([^"]+)",\s*"",\s*"[^"]*",\s*(\d+),\s*"",\s*(\w+),\s*(\w+),\s*"(\d+)",\s*"(\d+)"\)/g;
    
    const albero = [];
    let match;

    while ((match = pattern.exec(scriptContent)) !== null) {
      albero.push({
        label: match[1],
        url: match[2],
        indent: parseInt(match[3]),
        padre: match[4] === 'true',
        focus: match[5] === 'true',
        keyEnte: match[6],
        keyProg: match[7]
      });
    }

    res.json({
      enteKey: enteKey,
      items: albero
    });
  } catch (error) {
    console.error('Error fetching albero:', error.message);
    res.status(500).json({ 
      error: 'Errore nel caricamento dell\'albero',
      details: error.message 
    });
  }
});

app.get('/api/isad/:enteKey/:progKey', async (req, res) => {
  try {
    const { enteKey, progKey } = req.params;

    const response = await axiosInstance.get('/ShowLsIsadAction.do', {
      params: {
        keyEnte: enteKey,
        keyProg: progKey
      }
    });

    const $ = cheerio.load(response.data);
    
    const isad = {};
    const rows = $('table.tabnormale tr');

    rows.each((i, el) => {
      const th = $(el).find('th').text().trim();
      const td = $(el).find('td').text().trim();
      
      if (th && td) {
        const key = th.toLowerCase().replace(/\s+/g, '_');
        isad[key] = td;
      }
    });

    res.json({
      enteKey: enteKey,
      progKey: progKey,
      data: isad
    });
  } catch (error) {
    console.error('Error fetching ISAD:', error.message);
    res.status(500).json({ 
      error: 'Errore nel caricamento della scheda ISAD',
      details: error.message 
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/', (req, res) => {
  res.json({ message: 'Guarini Archivi API Backend', docs: '/api/health' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Errore interno del server' });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend proxy in ascolto su http://localhost:${PORT}`);
});

// Serve frontend statico da dist
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, 'frontend/dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/dist/index.html'));
});
