// Обробка події надсилання форми
document.getElementById('encryption-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const inputText = document.getElementById('plain-text').value;
    const key = document.getElementById('key').value;
    const rows = parseInt(document.getElementById('rows').value);
    const columns = parseInt(document.getElementById('columns').value);
    const alphabetType = document.getElementById('alphabet').value;

    try {
        const encryptedText = trithemiusCipherEncryption(inputText, key, alphabetType, rows, columns);
        document.getElementById('encrypted-text').textContent = encryptedText;
        document.getElementById('result-box').style.display = 'block'; // Показати результати
    } catch (error) {
        alert(error.message); // Вивести повідомлення про помилку
    }
});

// Функція для шифрування за допомогою таблиці Трисемуса
function trithemiusCipherEncryption(plaintext, key, alphabetType, rows, columns) {
    plaintext = trimming(plaintext).toUpperCase();
    key = removeDuplicateCharsFromKey(trimming(key).toUpperCase());
    const alphabet = getAlphabet(alphabetType);
    const alphabetSize = alphabet.length;

    if (rows * columns < alphabetSize) {
        throw new Error("Матриця занадто мала для заданого алфавіту.");
    }

    // Створення таблиці шифру
    const encryptionTable = createEncryptionTable(alphabet, key, rows, columns);

    let result = '';

    for (let i = 0; i < plaintext.length; i++) {
        const char = plaintext[i];
        const index = findCharInMatrix(encryptionTable, char);
        if (index) {
            result += encryptionTable[(index.row + 1) % rows][index.col];
        } else {
            result += char; // Якщо символ не належить алфавіту, додаємо його як є
        }
    }

    // Виведення пояснення
    showExplanation(plaintext, key, encryptionTable);

    return result;
}

// Функція для створення таблиці шифру
function createEncryptionTable(alphabet, key, rows, columns) {
    let ABC2 = '';
    for (let i = 0; i < alphabet.length; i++) {
        if (key.indexOf(alphabet[i]) === -1) {
            ABC2 += alphabet[i];
        }
    }

    const ABCEncryption = key + ABC2;
    const encryptionTable = [];
    let index = 0;

    for (let row = 0; row < rows; row++) {
        encryptionTable[row] = [];
        for (let col = 0; col < columns; col++) {
            if (index < ABCEncryption.length) {
                encryptionTable[row][col] = ABCEncryption[index++];
            } else {
                encryptionTable[row][col] = ''; // Заповнюємо порожні клітинки, якщо алфавіт не повний
            }
        }
    }

    return encryptionTable;
}

// Функція для пошуку символу в таблиці
function findCharInMatrix(matrix, char) {
    for (let row = 0; row < matrix.length; row++) {
        for (let col = 0; col < matrix[row].length; col++) {
            if (matrix[row][col] === char) {
                return { row: row, col: col };
            }
        }
    }
    return null;
}

// Функція для отримання алфавіту
function getAlphabet(type) {
    const latinAlphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const cyrillicAlphabet = 'АБВГДЕЄЖЗИІЇЙКЛМНОПРСТУФХЦЧШЩЬЮЯ'.split('');

    if (type === 'latin') {
        return latinAlphabet;
    } else if (type === 'cyrillic') {
        return cyrillicAlphabet;
    } else {
        throw new Error("Неправильний вибір алфавіту.");
    }
}

// Функція для видалення повторюваних символів у ключі
function removeDuplicateCharsFromKey(key) {
    return [...new Set(key)].join('');
}

// Функція для видалення пробілів на початку та в кінці
function trimming(message) {
    return message.trim().replace(/\s+/g, ''); // Видаляємо пробіли
}

// Пояснення шифрування
function showExplanation(plaintext, key, encryptionTable) {
    const explanationBox = document.getElementById('step-by-step');
    explanationBox.innerHTML = ''; // Очищення попереднього пояснення

    // Виведення таблиці шифру
    const table = document.createElement('table');
    for (let row = 0; row < encryptionTable.length; row++) {
        const tr = document.createElement('tr');
        for (let col = 0; col < encryptionTable[row].length; col++) {
            const td = document.createElement('td');
            td.textContent = encryptionTable[row][col];
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    explanationBox.appendChild(table);

    // Додаємо пояснення кроків шифрування
    const steps = document.createElement('div');
    steps.innerHTML = `<h4>Кроки шифрування:</h4>
        <p>Повідомлення: ${plaintext}</p>
        <p>Ключове слово: ${key}</p>
        <p>Таблиця шифрування заповнена на основі ключа та алфавіту.</p>`;
    
    explanationBox.appendChild(steps);
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
