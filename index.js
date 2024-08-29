// Crear la tabla
let tabla = document.createElement('table');
tabla.border = '2';
tabla.classList.add('tabla');
let cuerpo = document.createElement('tbody');

// Tamaño de la tabla y cantidad de minas
let tamaño = 10;
let cantidadMinas = 20;
let minasEncontradas = 0; // Contador de minas encontradas
let celdasReveladas = 0; // Contador de celdas reveladas
let totalCeldas = tamaño * tamaño; // Total de celdas en la tabla
let celdasSinMinas = totalCeldas - cantidadMinas; // Celdas sin minas 

// Mostrar un mensaje de introducción
setTimeout(() => {
    alert('Presiona el casillero. Si logras completar todos los casilleros sin encontrar 5 minas, ganas. ¡Adelante!');
}, 100);

// Función para generar una matriz de juego
function generarMatriz(tamaño) {
    let matriz = [];
    for (let i = 0; i < tamaño; i++) {
        let fila = [];
        for (let j = 0; j < tamaño; j++) {
            fila.push({ mina: false, minasCerca: 0, revelado: false });
        }
        matriz.push(fila);
    }
    return matriz;
}

// Función para colocar minas en posiciones aleatorias
function colocarMinas(matriz, cantidadMinas) {
    let minasColocadas = 0;
    while (minasColocadas < cantidadMinas) {
        let filaAleatoria = Math.floor(Math.random() * tamaño);
        let columnaAleatoria = Math.floor(Math.random() * tamaño);
        if (!matriz[filaAleatoria][columnaAleatoria].mina) {
            matriz[filaAleatoria][columnaAleatoria].mina = true;
            minasColocadas++;
            actualizarConteoMinas(matriz, filaAleatoria, columnaAleatoria);
        }
    }
}

// Función para actualizar el conteo de minas cercanas
function actualizarConteoMinas(matriz, fila, columna) {
    for (let i = fila - 1; i <= fila + 1; i++) {
        for (let j = columna - 1; j <= columna + 1; j++) {
            if (i >= 0 && i < tamaño && j >= 0 && j < tamaño && !matriz[i][j].mina) {
                matriz[i][j].minasCerca++;
            }
        }
    }
}

// Función para revelar una celda
function revelarCelda(celda, fila, columna, matriz) {
    if (matriz[fila][columna].revelado) return;

    matriz[fila][columna].revelado = true;
    celdasReveladas++;
    celda.style.backgroundColor = '#ddd';

    if (matriz[fila][columna].mina) {
        celda.textContent = '💣';
        minasEncontradas++;
        
        // Verificar si el jugador ha encontrado 5 minas
        if (minasEncontradas >= 5) {
            setTimeout(() => {
                alert("😩😩😩😩😩 Perdiste JAJAJAJA.");
                window.location.reload(); // Recargar la página para reiniciar el juego
            }, 100);
        }
    } else if (matriz[fila][columna].minasCerca > 0) {
        celda.textContent = matriz[fila][columna].minasCerca;
    } else {
        // Revelar las celdas adyacentes si no hay minas cercanas
        for (let i = fila - 1; i <= fila + 1; i++) {
            for (let j = columna - 1; j <= columna + 1; j++) {
                if (i >= 0 && i < tamaño && j >= 0 && j < tamaño) {
                    let celdaAdyacente = document.getElementById(`celda-${i}-${j}`);
                    revelarCelda(celdaAdyacente, i, j, matriz);
                }
            }
        }
    }

    // Verificar si el jugador ha ganado
    if (celdasReveladas === celdasSinMinas) {
        setTimeout(() => {
            alert("¡Felicidades! Has ganado.");
            window.location.reload(); // Recargar la página para reiniciar el juego
        }, 100);
    }
}

// Generar la matriz de juego
let matriz = generarMatriz(tamaño);
colocarMinas(matriz, cantidadMinas);

// Crear las celdas de la tabla
for (let i = 0; i < tamaño; i++) { 
    let fila = document.createElement('tr');
    for (let j = 0; j < tamaño; j++) {
        let celda = document.createElement('td');
        celda.id = `celda-${i}-${j}`;
        celda.style.width = '30px';
        celda.style.height = '30px';
        celda.style.textAlign = 'center';
        celda.style.cursor = 'pointer';
        celda.style.fontSize = '18px';
        
        // Agregar evento de clic para revelar la celda
        celda.addEventListener('click', function() {
            revelarCelda(celda, i, j, matriz);
        });

        fila.appendChild(celda);
    }
    cuerpo.appendChild(fila);
}

tabla.appendChild(cuerpo);
document.body.appendChild(tabla);
