//pasos para inicar la aplicación: terminal server: npx tsc node dist/server.js
//terminal proyecto npm run dev
interface Actividad {
  activity: string;
  type: string;
  participants: number;
  price: number;
  accessibility: number;
}

interface ErrorActividad {
  error: string;
}

async function obtenerActividad() {
  try {
    const response = await fetch('http://localhost:3001/api/activities');
    const data: Actividad[] = await response.json();
    mostrarActividad(data);
  } catch (error) {
    console.error('Error al obtener la actividad:', error);
  }
}

function mostrarActividad(data: Actividad[]) {
  const actividad = data[Math.floor(Math.random() * data.length)];

  const appDiv = document.getElementById('app');
  if (appDiv) {
    appDiv.innerHTML = `
      <h1 class="mt-4">${actividad.activity}</h1>
      <p><strong>Tipo de actividad:</strong> ${traducirTipo(actividad.type)}</p>
      <p><strong>Participantes:</strong> ${actividad.participants}</p>
     <div id="imagen-actividad"></div>
    `;
    obtenerImagen(actividad.type);
  }
}

function traducirTipo(tipo: string): string {
  const tipos: { [key: string]: string } = {
    education: 'Educación',
    recreational: 'Recreacional',
    social: 'Social',
    diy: 'DIY',
    charity: 'Caridad',
    cooking: 'Cocina',
    relaxation: 'Relajación',
    music: 'Música',
    busywork: 'Ocupacional',
  };
  return tipos[tipo] || tipo;
}

async function obtenerImagen(tipoActividad: string) {
  try {
    const response = await fetch(`https://api.unsplash.com/photos/random?query=${tipoActividad}&orientation=landscape&client_id=Ai29LzaOR5kr8qc_nxlD0HNTcxYhI7yZoQwdRuv7NbA`);
    const data = await response.json();
    const imagenUrl = data.urls.regular;

    const imagenDiv = document.getElementById('imagen-actividad');
    if (imagenDiv) {
      imagenDiv.innerHTML = `<img src="${imagenUrl}" alt="${tipoActividad}" class="img-fluid mt-3 rounded" />`;
    }
  } catch (error) {
    console.error('Error al obtener la imagen:', error);
  }
}



function manejarFormulario() {
  const form = document.getElementById('form-preferencias') as HTMLFormElement;
  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const tipoActividad = (document.getElementById('tipo-actividad') as HTMLSelectElement).value;
      const participantesInput = document.getElementById('participantes') as HTMLInputElement;
      const participantes = participantesInput.value;

      obtenerActividadPersonalizada(tipoActividad, participantes);
    });
  }
}

async function obtenerActividadPersonalizada(tipo: string, participantes: string) {
  try {
    let url = `http://localhost:3001/api/activities?`;
    if (tipo) {
      url += `type=${tipo}&`;
    }
    if (participantes) {
      url += `participants=${participantes}&`;
    }

    const response = await fetch(url);
    const data: Actividad[] = await response.json();

    if (data.length > 0) {
      mostrarActividad(data);
    } else {
      alert('No se encontraron actividades con los criterios seleccionados.');
    }
  } catch (error) {
    console.error('Error al obtener la actividad personalizada:', error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  obtenerActividad();
  manejarFormulario();
});
