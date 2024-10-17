// Обробка події надсилання форми для дешифрування
document.getElementById('decrypt-btn').addEventListener('click', function () {
    const inputText = document.getElementById('message').value;
    const key = document.getElementById('key').value;

    if (inputText && key) {
        const decryptedText = singlePermutationDecryption(inputText, key);
        document.getElementById('decrypted-text').textContent = decryptedText;
        document.getElementById('result-box').style.display = 'block'; // Показати результати
    } else {
        alert("Будь ласка, введіть зашифрований текст і ключ для дешифрування.");
    }
});
function trimming(input) {
    // Your trimming logic here
    return input.trim(); // Example of trimming whitespace
}
// Функція для визначення кількості рядків у матриці
function getMatrixRows(encryptedMessage, columns) {
    // Розрахунок кількості рядків, ділимо довжину повідомлення на кількість колонок
    return Math.ceil(encryptedMessage.length / columns);
}

// Дешифрування за методом одинарної перестановки
function singlePermutationDecryption(encryptedMessage, key) {
    encryptedMessage = trimming(encryptedMessage.replace(/\s+/g, ''));
    const columns = key.length;
    const rows = getMatrixRows(encryptedMessage, columns);

    // Створення масиву для ключа з позиціями
    const keyWithIndex = key.split('').map((char, index) => ({ char, index }));
    
    // Сортування ключа з урахуванням позицій
    keyWithIndex.sort((a, b) => a.char.localeCompare(b.char) || a.index - b.index);

    // Створення матриці для дешифрування
    const matrix = Array.from(Array(rows), () => Array(columns));

    let index = 0;
    keyWithIndex.forEach((keyInfo, sortedColumn) => {
        for (let row = 0; row < rows; row++) {
            matrix[row][keyInfo.index] = encryptedMessage.charAt(index++);
        }
    });
    // Зчитування рядків
    let result = '';
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
            result += matrix[row][col];
        }
    }
    return result.replace(/_+$/, ''); // Видалення заповнювальних символів "_"
}
// Функція для покрокового відображення процесу дешифрування
function displayDecryptionSteps(matrix, rows, columns, decryptedText, key, encryptedMessage) {
    const stepDiv = document.getElementById('step-by-step');
    stepDiv.innerHTML = ''; // Очищуємо попередній контент

    // Крок 1: Оригінальний зашифрований текст
    const encryptedMessageDiv = document.createElement('div');
    encryptedMessageDiv.classList.add('important-step');
    encryptedMessageDiv.textContent = `Зашифрований текст (вхідне повідомлення): ${encryptedMessage}`;
    stepDiv.appendChild(encryptedMessageDiv);

    // Крок 2: Текст після видалення пробілів
    const trimmedMessageDiv = document.createElement('div');
    trimmedMessageDiv.textContent = `Текст після видалення пробілів: ${encryptedMessage.replace(/\s+/g, '')}`;
    stepDiv.appendChild(trimmedMessageDiv);

    // Крок 3: Створення матриці для дешифрування з кількістю рядків і колонок
    const matrixInfoDiv = document.createElement('div');
    matrixInfoDiv.textContent = `Кількість рядків: ${rows}, кількість колонок (довжина ключа): ${columns}`;
    stepDiv.appendChild(matrixInfoDiv);

    // Крок 4: Масив ключа з позиціями (до сортування)
    const keyArrayDiv = document.createElement('div');
    keyArrayDiv.textContent = `Ключ з позиціями до сортування: ${key.split('').map((char, index) => `(${char}, ${index})`).join(', ')}`;
    stepDiv.appendChild(keyArrayDiv);

    // Крок 5: Масив ключа з позиціями (після сортування)
    const sortedKeyArrayDiv = document.createElement('div');
    sortedKeyArrayDiv.textContent = `Ключ з позиціями після сортування: ${key.split('').map((char, index) => `(${char}, ${index})`).sort().join(', ')}`;
    stepDiv.appendChild(sortedKeyArrayDiv);

    // Крок 6: Таблиця після перестановки
    const tableHeading = document.createElement('h4');
    tableHeading.textContent = 'Таблиця після перестановки символів:';
    stepDiv.appendChild(tableHeading);

    const decryptionTable = createSortedTable(matrix, rows, columns, key);
    stepDiv.appendChild(decryptionTable);

    // Крок 7: Дешифрований текст
    const decryptedTextDiv = document.createElement('div');
    decryptedTextDiv.classList.add('important-step');
    decryptedTextDiv.textContent = `Дешифрований текст: ${decryptedText}`;
    stepDiv.appendChild(decryptedTextDiv);
}

// Логіка для показу/приховування пояснень
document.getElementById('toggle-steps-btn').addEventListener('click', function () {
    const explanationBox = document.getElementById('step-by-step');
    if (explanationBox.style.display === 'none') {
        explanationBox.style.display = 'block';
        this.textContent = 'Приховати пояснення';
    } else {
        explanationBox.style.display = 'none';
        this.textContent = 'Показати пояснення';
    }
});
