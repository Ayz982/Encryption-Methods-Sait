// Обробка події надсилання форми
document.getElementById('encryption-form').addEventListener('submit', function (event) {
    event.preventDefault(); // Зупинити стандартну поведінку форми

    const inputText = document.getElementById('input-text').value;
    const rowCount = parseInt(document.getElementById('rows').value);
    const columnCount = parseInt(document.getElementById('columns').value);

    const encryptedText = simplePermutationEncryption(inputText, rowCount, columnCount);
    document.getElementById('encrypted-text').textContent = encryptedText;
    document.getElementById('result-box').style.display = 'block'; // Показати результати
});

// Метод шифрування простою перестановкою
function simplePermutationEncryption(message, rowCount, columnCount) {
    message = trimming(message);
    const paddedMessage = padMessage(message, rowCount, columnCount);
    const matrix = createMatrix(paddedMessage, rowCount, columnCount);
    let result = '';

    // Зчитування матриці по стовпцях
    for (let col = 0; col < columnCount; col++) {
        for (let row = 0; row < rowCount; row++) {
            result += matrix[row][col]; // Додаємо символи по стовпцях
        }
    }

    return splitIntoGroups(result, rowCount); // Додаємо групування по 4 символи
}

// Функція для видалення пробілів на початку та в кінці
function trimming(message) {
    return message.trim().replace(/\s+/g, ''); // Видаляємо пробіли
}

// Функція для доповнення повідомлення символом "_"
function padMessage(message, rowCount, columnCount) {
    const size = rowCount * columnCount;
    return message.padEnd(size, '_'); // Заповнення символом "_"
}

// Створення матриці
function createMatrix(message, rowCount, columnCount) {
    const matrix = [];
    for (let i = 0; i < rowCount; i++) {
        matrix.push([]);
        for (let j = 0; j < columnCount; j++) {
            matrix[i][j] = message.charAt(i * columnCount + j); // Заповнюємо по рядках
        }
    }
    return matrix;
}

// Групування шифротексту по n символів
function splitIntoGroups(text, groupSize) {
    const groups = [];
    for (let i = 0; i < text.length; i += groupSize) {
        groups.push(text.substring(i, i + groupSize));
    }
    return groups.join(' '); // Повертаємо рядок, об'єднаний пробілами
}

// Функція для показу/приховування пояснень
document.getElementById('toggle-steps-btn').addEventListener('click', function () {
    const stepDiv = document.getElementById('step-by-step');
    const btn = document.getElementById('toggle-steps-btn');
    if (stepDiv.style.display === 'none') {
        const inputText = document.getElementById('input-text').value;
        const rowCount = parseInt(document.getElementById('rows').value);
        const columnCount = parseInt(document.getElementById('columns').value);

        const paddedMessage = padMessage(trimming(inputText), rowCount, columnCount);
        const matrix = createMatrix(paddedMessage, rowCount, columnCount);
        const encryptedText = simplePermutationEncryption(inputText, rowCount, columnCount);

        displaySteps(matrix, rowCount, columnCount, encryptedText);
        stepDiv.style.display = 'block';
        btn.textContent = 'Приховати пояснення';
    } else {
        stepDiv.style.display = 'none';
        btn.textContent = 'Показати пояснення';
    }
});

// Функція для покрокового відображення процесу шифрування
function displaySteps(table, rows, columns, encryptedText) {
    const stepDiv = document.getElementById('step-by-step');
    stepDiv.innerHTML = ''; // Очищуємо попередній контент

    // Крок 1: Оригінальний текст
    const originalMessage = document.createElement('div');
    originalMessage.classList.add('important-step');
    originalMessage.textContent = `Оригінальний текст: ${document.getElementById('input-text').value}`;
    stepDiv.appendChild(originalMessage);

    // Крок 2: Текст після видалення пробілів
    const trimmedMessage = document.createElement('div');
    trimmedMessage.classList.add('important-step');
    trimmedMessage.textContent = `Текст після видалення пробілів: ${trimming(document.getElementById('input-text').value)}`;
    stepDiv.appendChild(trimmedMessage);

    // Крок 3: Заповнення таблиці
    const fillTableHeading = document.createElement('h4');
    fillTableHeading.textContent = 'Заповнення таблиці по рядках:';
    stepDiv.appendChild(fillTableHeading);

    const tableElement = document.createElement('table');
    tableElement.classList.add('encryption-table');

    for (let i = 0; i < rows; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < columns; j++) {
            const cell = document.createElement('td');
            cell.textContent = table[i][j];
            if (i === 0) {
                cell.style.backgroundColor = 'lightgreen'; // Виділяємо перший рядок (заповнення по рядках)
            }
            row.appendChild(cell);
        }
        tableElement.appendChild(row);
    }
    stepDiv.appendChild(tableElement);

    // Крок 4: Зчитування по стовпцях (не змінюючи таблиці, просто виділяючи стовпці)
    const readColsHeading = document.createElement('h4');
    readColsHeading.textContent = 'Зчитування таблиці по стовпцях:';
    stepDiv.appendChild(readColsHeading);

    const colTable = document.createElement('table');
    colTable.classList.add('col-read-table');

    for (let i = 0; i < rows; i++) {
        const row = document.createElement('tr');
        for (let col = 0; col < columns; col++) {
            const cell = document.createElement('td');
            cell.textContent = table[i][col];
            if (col === 0) {
                cell.style.backgroundColor = 'lightblue'; // Виділяємо перші елементи стовпців (зчитування по стовпцях)
            }
            row.appendChild(cell);
        }
        colTable.appendChild(row);
    }
    stepDiv.appendChild(colTable);

    // Крок 5: Результат шифрування
    const finalResultDiv = document.createElement('div');
    finalResultDiv.classList.add('important-step');
    finalResultDiv.textContent = `\Зашифрований текст: ${encryptedText}`;
    stepDiv.appendChild(finalResultDiv);
}
