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
