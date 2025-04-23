// Configura Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBYK54km4uP5MjNJ3_t3R7s6pWm3aIlh5o",
  authDomain: "appla-c5ee5.firebaseapp.com",
  projectId: "appla-c5ee5",
  storageBucket: "appla-c5ee5.firebasestorage.app",
  messagingSenderId: "1072477443902",
  appId: "1:1072477443902:web:7885ed6eb0964547c83e6f"
};


firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Splash Screen
window.addEventListener('load', () => {
  setTimeout(() => document.getElementById('splash-screen').style.display = 'none', 2000);
});

// API Platzi Fake
const API_URL = 'https://api.escuelajs.co/api/v1/products';
let productos = [];

async function obtenerProductos() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    productos = data;
    mostrarProductos(productos);
    mostrarRecomendacion(productos);
    mostrarFavoritos();
  } catch (error) {
    console.error('Error al cargar productos:', error);
  }
}

function mostrarProductos(lista) {
  const contenedor = document.getElementById('productos');
  contenedor.innerHTML = '';
  lista.forEach(producto => {
    const div = document.createElement('div');
    div.className = 'producto';
    div.innerHTML = `
      <h3>${producto.title}</h3>
      <img src="${producto.images[0]}" width="100%" />
      <p>${producto.description}</p>
      <button onclick="agregarFavorito(${producto.id})">⭐ Agregar a Favoritos</button>
    `;
    contenedor.appendChild(div);
  });
}

function buscarProducto() {
  const query = document.getElementById('searchInput').value.toLowerCase();
  const resultados = productos.filter(p =>
    p.title.toLowerCase().includes(query)
  );
  mostrarProductos(resultados);
}

function filtrarProductos() {
  const categoria = document.getElementById('categoria').value;
  if (categoria === 'all') {
    mostrarProductos(productos);
  } else {
    const filtrados = productos.filter(p =>
      p.category && p.category.name.toLowerCase().includes(categoria)
    );
    mostrarProductos(filtrados);
  }
}

// CRUD Favoritos
function obtenerFavoritos() {
  return JSON.parse(localStorage.getItem('favoritos')) || [];
}

function guardarFavoritos(favs) {
  localStorage.setItem('favoritos', JSON.stringify(favs));
  mostrarFavoritos();
}

function agregarFavorito(id) {
  const favs = obtenerFavoritos();
  if (!favs.includes(id)) {
    favs.push(id);
    guardarFavoritos(favs);
  }
}

function eliminarFavorito(id) {
  let favs = obtenerFavoritos();
  favs = favs.filter(fid => fid !== id);
  guardarFavoritos(favs);
}

function mostrarFavoritos() {
  const favs = obtenerFavoritos();
  const lista = document.getElementById('listaFavoritos');
  lista.innerHTML = '';

  const favoritosData = productos.filter(p => favs.includes(p.id));
  favoritosData.forEach(producto => {
    const div = document.createElement('div');
    div.className = 'favorito';
    div.innerHTML = `
      <h3>${producto.title}</h3>
      <img src="${producto.images[0]}" width="100%" />
      <p>${producto.description}</p>
      <button onclick="eliminarFavorito(${producto.id})">❌ Eliminar</button>
    `;
    lista.appendChild(div);
  });
}

function mostrarRecomendacion(lista) {
  const index = Math.floor(Math.random() * lista.length);
  const producto = lista[index];
  const contenedor = document.getElementById('recomendacion');
  contenedor.innerHTML = `
    <div class="recomendado">
      <h3>${producto.title}</h3>
      <img src="${producto.images[0]}" width="100%" />
      <p>${producto.description}</p>
    </div>
  `;
}

// Guardar usuario en Firestore
document.getElementById('registroForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const inputs = e.target.querySelectorAll('input');
  const data = {
    nombre: inputs[0].value,
    apellido: inputs[1].value,
    correo: inputs[2].value,
    telefono: inputs[4].value,
    direccion: inputs[5].value,
    fechaNacimiento: inputs[6].value,
  };

  try {
    await db.collection('usuarios').add(data);
    alert('Usuario registrado correctamente');
    e.target.reset();
  } catch (err) {
    console.error('Error al registrar:', err);
    alert('Hubo un error al registrar el usuario.');
  }
});

obtenerProductos();

// FUNCION DE LISTA DE ELEMENTOS API
  async function cargarLista() {
    try {
      const res = await fetch("https://api.escuelajs.co/api/v1/products");
      const productos = await res.json();
      const lista = document.getElementById("listaItems");

      productos.forEach(producto => {
        const card = document.createElement("div");
        card.classList.add("card-producto");
        card.innerHTML = `
          <img src="${producto.images[0]}" alt="${producto.title}">
          <h3>${producto.title}</h3>
          <p><strong>${producto.price} USD</strong></p>
        `;
        card.addEventListener("click", () => mostrarDetalle(producto));
        lista.appendChild(card);
      });
    } catch (error) {
      console.error("Error al cargar los productos:", error);
    }
  }

  function mostrarDetalle(producto) {
    const detalle = document.getElementById("detalleContenido");
    detalle.innerHTML = `
      <img src="${producto.images[0]}" alt="${producto.title}">
      <h3>${producto.title}</h3>
      <p><strong>Precio:</strong> ${producto.price} USD</p>
      <p>${producto.description}</p>
      <button onclick="cerrarDetalle()">Cerrar</button>
    `;
    document.getElementById("detalleProducto").style.display = "block";
    window.scrollTo({ top: document.getElementById("detalleProducto").offsetTop, behavior: "smooth" });
  }

  function cerrarDetalle() {
    document.getElementById("detalleProducto").style.display = "none";
  }

  window.addEventListener("DOMContentLoaded", cargarLista);

//(scroll animado)
  document.querySelectorAll('a[href^="#"]').forEach(ancla => {
    ancla.addEventListener('click', function (e) {
      e.preventDefault();
      const destino = document.querySelector(this.getAttribute("href"));
      destino.scrollIntoView({ behavior: "smooth" });
    });
  });



