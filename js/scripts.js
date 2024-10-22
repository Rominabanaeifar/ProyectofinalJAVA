document.addEventListener('DOMContentLoaded', () => {
    const logo = document.querySelector('.logo');

    // Inicialmente ocultar el logo
    logo.style.opacity = '0';
    logo.style.transition = 'opacity 1s ease';

    // Función para alternar la visibilidad del logo
    function alternarLogo() {
        logo.style.opacity = logo.style.opacity === '0' ? '1' : '0'; // Alternar el logo
    }

    // Iniciar el intervalo para alternar el logo cada 1 segundo
    setInterval(alternarLogo, 1000);

    const añadirProductoButton = document.getElementById('añadir-producto'); // Obtener el botón
    const productoSelect = document.getElementById('producto'); // Obtener el select de productos
    const plazoInput = document.getElementById('plazo'); // Obtener el input de plazo

    // Definir los productos directamente aquí
    const productos = [
        {
            imagen: "../images/instrument1.jpg",
            titulo: "Escalador de dientes",
            precio: 100
        },
        {
            imagen: "../images/instrument2.jpg",
            titulo: "Instrumentos de exploración",
            precio: 150
        },
        {
            imagen: "../images/instrument3.jpg",
            titulo: "Fresas odontológicas",
            precio: 200
        }
    ];

    // Rellenar el select de productos solo una vez si no tiene opciones
    if (productoSelect.options.length === 0) {
        productos.forEach(producto => {
            const option = document.createElement('option');
            option.value = producto.titulo;
            option.dataset.precio = producto.precio;
            option.dataset.imagen = producto.imagen;
            option.textContent = producto.titulo;
            productoSelect.appendChild(option);
        });
    }

    // Recuperar productos seleccionados del localStorage
    let productosSeleccionados = JSON.parse(localStorage.getItem('productosSeleccionados')) || [];
    let totalPresupuesto = productosSeleccionados.reduce((total, producto) => total + producto.precio, 0);

    // Mostrar total en la página de galería
    const totalDisplayGaleria = document.getElementById('total-galeria');
    if (totalDisplayGaleria) {
        totalDisplayGaleria.textContent = `Total: $${totalPresupuesto}`;
    }

    // Función para mostrar el producto seleccionado en la galería
    function mostrarProductoSeleccionado() {
        const precioProducto = parseFloat(productoSelect.options[productoSelect.selectedIndex]?.dataset.precio) || 0;
        const imagenSeleccionada = productoSelect.options[productoSelect.selectedIndex]?.dataset.imagen || '';
        const nombreSeleccionado = productoSelect.options[productoSelect.selectedIndex]?.text || '';

        totalDisplayGaleria.textContent = `Total: $${precioProducto}`;

        if (imagenSeleccionada) {
            const imagenProducto = document.getElementById('imagen-producto');
            const nombreProducto = document.getElementById('nombre-producto');

            imagenProducto.src = imagenSeleccionada;
            imagenProducto.alt = nombreSeleccionado;
            nombreProducto.textContent = nombreSeleccionado;
            document.getElementById('producto-seleccionado').style.display = 'block'; // Mostrar el producto seleccionado
        } else {
            document.getElementById('producto-seleccionado').style.display = 'none'; // Ocultar si no hay selección
        }
    }

    // Actualizar el precio y la imagen cuando se selecciona un producto en la galería
    if (productoSelect) {
        productoSelect.addEventListener('change', mostrarProductoSeleccionado);
    }

    // Función para agregar el producto y plazo seleccionados
    añadirProductoButton.addEventListener('click', () => {
        const productoSeleccionado = productoSelect.value;
        const precioSeleccionado = parseFloat(productoSelect.options[productoSelect.selectedIndex]?.dataset.precio) || 0;
        const plazoSeleccionado = parseInt(plazoInput.value, 10);
        const nombreSeleccionado = productoSelect.options[productoSelect.selectedIndex]?.text || '';

        // Verificar si ya hay productos seleccionados
        if (!productoSeleccionado) {
            alert("Por favor, selecciona un producto.");
            return;
        }

        // Comprobar si el producto ya está en la lista de seleccionados
        const productoExistente = productosSeleccionados.find(p => p.nombre.includes(nombreSeleccionado) && p.plazo === plazoSeleccionado);
        if (productoExistente) {
            alert(`El producto ${nombreSeleccionado} con plazo de ${plazoSeleccionado} días ya ha sido agregado.`);
            return; // Evitar agregarlo de nuevo
        }

        // Agregar el producto con el plazo a los productos seleccionados
        productosSeleccionados.push({ nombre: `${nombreSeleccionado} (Plazo: ${plazoSeleccionado} días)`, precio: precioSeleccionado, plazo: plazoSeleccionado });
        totalPresupuesto += precioSeleccionado;

        // Actualizar localStorage y mostrar mensaje de confirmación
        localStorage.setItem('productosSeleccionados', JSON.stringify(productosSeleccionados));
        alert(`Producto ${nombreSeleccionado} agregado al presupuesto con plazo de ${plazoSeleccionado} días.`);

        // Mostrar productos seleccionados en presupuesto
        mostrarProductosPresupuesto();
    });

    // Obtener referencias a los elementos del DOM
    const galeriaForm = document.getElementById('galeria-form');
    const presupuestoContainer = document.getElementById('presupuesto-container');
    const presupuestoFinal = document.getElementById('presupuesto-final');
    const resetearButton = document.getElementById('resetear-presupuesto');
    const enviarPresupuestoButton = document.getElementById('btn-enviar-presupuesto');

    // Al enviar el formulario de la galería
    if (galeriaForm) {
        galeriaForm.addEventListener('submit', (event) => {
            event.preventDefault();
            mostrarProductoSeleccionado();
        });
    }

    // Mostrar productos en la página de presupuesto
    function mostrarProductosPresupuesto() {
        if (!presupuestoContainer) return;

        presupuestoContainer.innerHTML = ''; // Limpiar contenedor

        if (productosSeleccionados.length === 0) {
            presupuestoFinal.textContent = 'Presupuesto Total: $0';
            presupuestoContainer.innerHTML = '<p>No hay productos en el presupuesto.</p>';
            return;
        }

        let total = 0;
        productosSeleccionados.forEach(producto => {
            const productoElement = document.createElement('div');
            productoElement.textContent = `${producto.nombre} - $${producto.precio}`;
            presupuestoContainer.appendChild(productoElement);
            total += producto.precio;
        });
        presupuestoFinal.textContent = `Presupuesto Total: $${total}`;
    }

    // Mostrar productos cuando se carga la página de presupuesto
    if (presupuestoContainer) {
        mostrarProductosPresupuesto();
    }

    // Botón de reseteo de presupuesto
    if (resetearButton) {
        resetearButton.addEventListener('click', () => {
            productosSeleccionados = [];
            totalPresupuesto = 0;
            localStorage.setItem('productosSeleccionados', JSON.stringify(productosSeleccionados));
            mostrarProductosPresupuesto();
            alert("Productos seleccionados han sido reseteados.");
        });
    }

    // Agregar un evento al botón de enviar presupuesto
    if (enviarPresupuestoButton) {
        enviarPresupuestoButton.addEventListener('click', () => {
            console.log("Botón de enviar presupuesto presionado");
            alert("¡Ya está enviado vuestro presupuesto!");
            // Aquí puedes agregar cualquier otra lógica que necesites al enviar el presupuesto
        });
    }
});
