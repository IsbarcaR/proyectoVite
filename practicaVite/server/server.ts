// server/server.ts
import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const port = 3001;

app.use(cors());

app.get('/api/activities', async (req, res) => {
  const { type, participants } = req.query;
  let url = `https://bored-api.appbrewery.com/filter?`;

  if (type) {
    url += `type=${type}&`;
  }
  if (participants) {
    url += `participants=${participants}&`;
  }

  try {
    const response = await fetch(url);
    const data = await response.json();

    // Agregar registro para ver la respuesta de la API
    console.log('Datos recibidos de la API:', data);

    if (data.error) {
      console.error('Error de la API:', data.error);
      res.status(500).json({ error: data.error });
    } else {
      res.json(data);
    }
  } catch (error) {
    console.error('Error al obtener la actividad:', error);
    res.status(500).json({ error: 'Error al obtener la actividad' });
  }
});

app.listen(port, () => {
  console.log(`Servidor proxy escuchando en http://localhost:${port}`);
});
