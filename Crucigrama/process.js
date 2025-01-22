const grid = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
    [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

const solutions = {
    across: {
        1: 'PRODUCTIVA',
        2: 'SEGUIMIENTO',
        3: 'COMPETENCIAS'
    },
    down: {
        4: 'PRESENCIAL',
        5: 'INSTRUCTOR',
        6: 'APRENDIZ'
    }
};

const numbers = {
    '1-2': '1,4',  // Esta celda corresponde tanto a la palabra "PRODUCTIVA" (Horizontal 1) como a "PRESENCIAL" (Vertical 4)
    '4-2': '2',    // Primera celda de la palabra "SEGUIMIENTO" (Horizontal 2)
    '7-2': '3',    // Primera celda de la palabra "COMPETENCIAS" (Horizontal 3)
    '6-5': '6',   // Primera celda de la palabra "INSTRUCTOR" (Vertical 6)
    '5-13': '5',   // Primera celda de la palabra "APRENDIZ" (Vertical 5)
};



function createGrid() {
    const table = document.getElementById('grid');

    for (let i = 0; i < grid.length; i++) {
        const row = document.createElement('tr');

        for (let j = 0; j < grid[i].length; j++) {
            const cell = document.createElement('td');
            cell.className = 'cell';

            if (grid[i][j] === 1) {
                const input = document.createElement('input');
                input.maxLength = 1;
                input.setAttribute('data-row', i);
                input.setAttribute('data-col', j);
                cell.appendChild(input);

                const key = `${i}-${j}`;
                if (numbers[key]) {
                    const number = document.createElement('div');
                    number.className = 'number';
                    number.textContent = numbers[key];
                    cell.appendChild(number);
                }
            } else {
                cell.classList.add('blocked');
            }

            row.appendChild(cell);
        }
        table.appendChild(row);
    }
}

function validateCrossword() {
    const inputs = document.querySelectorAll('input');
    let incorrectWords = [];
    let correctCells = new Set();
    let completedWords = 0;
    const totalWords = Object.keys(solutions.across).length + Object.keys(solutions.down).length;

    // Función auxiliar para validar una palabra específica
    function validateWord(input) {
        const row = parseInt(input.getAttribute('data-row'));
        const col = parseInt(input.getAttribute('data-col'));
        let wordFound = false;

        // Verificar palabras horizontales
        for (const [number, word] of Object.entries(solutions.across)) {
            let startCell = null;
            for (const [key, value] of Object.entries(numbers)) {
                if (value.includes(number)) {
                    const [startRow, startCol] = key.split('-').map(Number);
                    if (row === startRow && col >= startCol && col < startCol + word.length) {
                        startCell = { row: startRow, col: startCol };
                        break;
                    }
                }
            }

            if (startCell) {
                let userWord = '';
                const cells = [];
                let isComplete = true;

                for (let j = 0; j < word.length; j++) {
                    const currentInput = document.querySelector(`input[data-row="${startCell.row}"][data-col="${startCell.col + j}"]`);
                    if (currentInput) {
                        if (!currentInput.value) {
                            isComplete = false;
                        }
                        userWord += currentInput.value.toUpperCase();
                        cells.push(currentInput);
                    }
                }

                if (isComplete) {
                    if (userWord === word) {
                        cells.forEach(cell => {
                            if (!correctCells.has(cell)) {
                                cell.parentElement.style.backgroundColor = '#b8f6b8';
                                cell.parentElement.style.color = '#115011';
                                cell.readOnly = true;
                                correctCells.add(cell);
                            }
                        });
                        wordFound = true;
                    } else {
                        // Palabra incorrecta - mostrar alerta y limpiar
                        // alert(`¡Palabra horizontal ${number} incorrecta! Inténtalo de nuevo.`);
                        Swal.fire({
                            title: "Error!",
                            text: `¡Palabra horizontal ${number} incorrecta! Inténtalo de nuevo.`,
                            icon: "error"
                            });
                        cells.forEach(cell => {
                            if (!correctCells.has(cell)) {
                                cell.value = '';
                                cell.parentElement.style.backgroundColor = '';
                            }
                        });
                    }
                }
            }
        }

        // Verificar palabras verticales
        for (const [number, word] of Object.entries(solutions.down)) {
            let startCell = null;
            for (const [key, value] of Object.entries(numbers)) {
                if (value.includes(number)) {
                    const [startRow, startCol] = key.split('-').map(Number);
                    if (col === startCol && row >= startRow && row < startRow + word.length) {
                        startCell = { row: startRow, col: startCol };
                        break;
                    }
                }
            }

            if (startCell) {
                let userWord = '';
                const cells = [];
                let isComplete = true;

                for (let i = 0; i < word.length; i++) {
                    const currentInput = document.querySelector(`input[data-row="${startCell.row + i}"][data-col="${startCell.col}"]`);
                    if (currentInput) {
                        if (!currentInput.value) {
                            isComplete = false;
                        }
                        userWord += currentInput.value.toUpperCase();
                        cells.push(currentInput);
                    }
                }

                if (isComplete) {
                    if (userWord === word) {
                        cells.forEach(cell => {
                            if (!correctCells.has(cell)) {
                                cell.parentElement.style.backgroundColor = '#90EE90';
                                cell.readOnly = true;
                                correctCells.add(cell);
                            }
                        });
                        wordFound = true;
                    } else {
                        // Palabra incorrecta - mostrar alerta y limpiar
                        // alert(`¡Palabra vertical ${number} incorrecta! Inténtalo de nuevo.`);
                        Swal.fire({
                            title: "Error!",
                            text: `¡Palabra vertical ${number} incorrecta! Inténtalo de nuevo.`,
                            icon: "error"
                            });
                        cells.forEach(cell => {
                            if (!correctCells.has(cell)) {
                                cell.value = '';
                                cell.parentElement.style.backgroundColor = '';
                            }
                        });
                    }
                }
            }
        }

        return wordFound;
    }

    // Validar todas las celdas con entrada
    inputs.forEach(input => {
        if (input.value && !correctCells.has(input)) {
            validateWord(input);
        }
    });

    // Contar palabras completadas
    completedWords = new Set([...correctCells].map(input => {
        const row = input.getAttribute('data-row');
        const col = input.getAttribute('data-col');
        return `${row}-${col}`;
    })).size;

    // Verificar si el crucigrama está completo
    if (correctCells.size === inputs.length) {
        // alert('¡Felicitaciones! Has completado el crucigrama correctamente.');
        Swal.fire({
            title: "¡Felicitaciones!",
            text: "Has completado el crucigrama correctamente.",
            icon: "success"
        });
    }
}

// Mejorar el manejo de eventos de input
function addValidationEvents() {
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('input', (e) => {
            if (e.target.readOnly) {
                e.preventDefault();
                return;
            }
            
            e.target.value = e.target.value.toUpperCase();
            validateWord(e.target); // Validar inmediatamente después de cada entrada
            
            // Encontrar el siguiente input no readonly
            if (e.target.value) {
                const currentRow = parseInt(e.target.getAttribute('data-row'));
                const currentCol = parseInt(e.target.getAttribute('data-col'));
                
                // Intentar encontrar el siguiente input en la misma fila
                const nextInput = document.querySelector(`input[data-row="${currentRow}"][data-col="${currentCol + 1}"]`);
                if (nextInput && !nextInput.readOnly) {
                    nextInput.focus();
                }
            }
        });

        // Permitir el uso de retroceso para navegar hacia atrás
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !e.target.value) {
                const currentRow = parseInt(e.target.getAttribute('data-row'));
                const currentCol = parseInt(e.target.getAttribute('data-col'));
                
                const prevInput = document.querySelector(`input[data-row="${currentRow}"][data-col="${currentCol - 1}"]`);
                if (prevInput && !prevInput.readOnly) {
                    prevInput.focus();
                }
            }
        });
    });
}

createGrid();
addValidationEvents();