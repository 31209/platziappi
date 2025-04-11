// Splash Screen
window.addEventListener('load', () => {
    setTimeout(() => document.getElementById('splash-screen').style.display = 'none', 2000);
  });
  
  // URL de la API Platzi Fake
  const API_URL = 'https://api.escuelajs.co/api/v1/products';
  
  let productos = []; // Array para almacenar los productos obtenidos
  
  // Obtener productos desde la API
  async function obtenerProductos() {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      productos = data;
      mostrarProductos(productos);
      mostrarRecomendacion(productos);
    } catch (error) {
      console.error('Error al cargar productos:', error);
    }
  }
  
  // Mostrar productos en pantalla
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
  
  // Buscar producto por nombre
  function buscarProducto() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const resultados = productos.filter(p =>
      p.title.toLowerCase().includes(query)
    );
    mostrarProductos(resultados);
  }
  
  // Filtrar productos por categoría (sencillo)
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
  
  // CRUD de Favoritos usando localStorage
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
  
  // Recomendación del día (producto aleatorio)
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
  
  // Inicializar la app
  obtenerProductos();
  

