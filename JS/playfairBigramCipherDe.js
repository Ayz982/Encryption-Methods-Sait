// Показати відповідну форму на основі вибраного методу дешифрування
const decryptionMethodSelect = document.getElementById('decryption-method');
const decryptionFormKey = document.getElementById('decryption-form-key');
const decryptionFormMatrix = document.getElementById('decryption-form-matrix');
const matrixInputDecrypt = document.getElementById('matrix-input-decrypt');

decryptionMethodSelect.addEventListener('change', function () {
    if (decryptionMethodSelect.value === 'key') {
        decryptionFormKey.style.display = 'block';
        decryptionFormMatrix.style.display = 'none';
    } else if (decryptionMethodSelect.value === 'matrix') {
        decryptionFormKey.style.display = 'none';
        decryptionFormMatrix.style.display = 'block';
    }
});

// Обробка події надсилання форми для дешифрування за ключем
document.getElementById('key-decryption-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const message = document.getElementById('message-key').value;
    const key = document.getElementById('key').value;
    const rows = parseInt(document.getElementById('rows').value);
    const columns = parseInt(document.getElementById('columns').value);
    const alphabetType = document.getElementById('alphabet').value;

    try {
        const decryptedText = playfairBigramCipherDecryption(message, key, alphabetType, rows, columns);
        document.getElementById('decrypted-text').textContent = decryptedText;
        document.getElementById('result-box-decrypt').style.display = 'block'; // Показати результати
    } catch (error) {
        alert(error.message); // Вивести повідомлення про помилку
    }
});

// Функція для дешифрування за допомогою біграмного шифру Плейфейра
function playfairBigramCipherDecryption(message, key, alphabetType, rows, columns) {
    message = trimming(message).toUpperCase();
    key = removeDuplicateCharsFromKey(trimming(key).toUpperCase());
    const alphabet = getAlphabet(alphabetType);
    
    const alphabetWithoutDuplicates = alphabet.filter(char => !key.includes(char));
    const ABCDecryption = key + alphabetWithoutDuplicates.join('');
    const decryptionTable = createEncryptionTable(ABCDecryption, rows, columns);
    let result = '';

    for (let i = 0; i < message.length; i += 2) {
        const indexLeading = findCharInMatrix(decryptionTable, message[i]);
        const indexTrailing = findCharInMatrix(decryptionTable, message[i + 1]);

        if (indexLeading.first !== indexTrailing.first && indexLeading.second !== indexTrailing.second) {
            // Правило 2: Літери в різних рядках і стовпцях
            result += decryptionTable[indexLeading.first][indexTrailing.second];
            result += decryptionTable[indexTrailing.first][indexLeading.second];
        } else if (indexLeading.first === indexTrailing.first && indexLeading.second !== indexTrailing.second) {
            // Правило 3: Літери в одному рядку – замінюємо на літери ліворуч
            result += decryptionTable[indexLeading.first][(indexLeading.second - 1 + columns) % columns];
            result += decryptionTable[indexTrailing.first][(indexTrailing.second - 1 + columns) % columns];
        } else if (indexLeading.second === indexTrailing.second && indexLeading.first !== indexTrailing.first) {
            // Правило 4: Літери в одному стовпці – замінюємо на літери вище
            result += decryptionTable[(indexLeading.first - 1 + rows) % rows][indexLeading.second];
            result += decryptionTable[(indexTrailing.first - 1 + rows) % rows][indexTrailing.second];
        }
    }

    return result;
}
function playfairBigramCipherDecryptionWithMatrix(message, matrix, rows, columns) {
    // Приведення повідомлення до верхнього регістру та видалення пробілів
    if (!message) {
        throw new Error("Повідомлення не може бути порожнім.");
    }
    message = trimming(message).toUpperCase();

    // Додаємо перевірку на непарну кількість символів
    if (message.length % 2 !== 0) {
        throw new Error("Повідомлення повинне містити парну кількість символів для біграм.");
    }

    let result = '';

    for (let i = 0; i < message.length; i += 2) {
        // Перевіряємо, що символи існують в таблиці
        const indexLeading = findCharInMatrix(matrix, message[i]);
        const indexTrailing = findCharInMatrix(matrix, message[i + 1]);

        if (!indexLeading || !indexTrailing) {
            throw new Error("Символ не знайдений в таблиці.");
        }

        if (indexLeading.first !== indexTrailing.first && indexLeading.second !== indexTrailing.second) {
            result += matrix[indexLeading.first][indexTrailing.second];
            result += matrix[indexTrailing.first][indexLeading.second];
        } else if (indexLeading.first === indexTrailing.first) {
            result += matrix[indexLeading.first][(indexLeading.second + columns - 1) % columns];
            result += matrix[indexTrailing.first][(indexTrailing.second + columns - 1) % columns];
        } else if (indexLeading.second === indexTrailing.second) {
            result += matrix[(indexLeading.first + rows - 1) % rows][indexLeading.second];
            result += matrix[(indexTrailing.first + rows - 1) % rows][indexTrailing.second];
        }
    }

    return result;
}

// Функція для пошуку символу в таблиці з перевіркою
function findCharInMatrix(matrix, char) {
    if (!char) return null; // Перевірка на наявність символу

    for (let row = 0; row < matrix.length; row++) {
        for (let col = 0; col < matrix[row].length; col++) {
            if (matrix[row][col] && matrix[row][col].toUpperCase() === char.toUpperCase()) {
                return { first: row, second: col };
            }
        }
    }
    return null;
}

// Функція для створення таблиці (залишається такою ж)
function createEncryptionTable(key, rows, columns) {
    const encryptionTable = [];
    let index = 0;

    for (let row = 0; row < rows; row++) {
        encryptionTable[row] = [];
        for (let col = 0; col < columns; col++) {
            if (index < key.length) {
                encryptionTable[row][col] = key[index++];
            } else {
                encryptionTable[row][col] = ''; // Заповнюємо порожні клітинки, якщо алфавіт не повний
            }
        }
    }

    return encryptionTable;
}

// Функція для пошуку символу в таблиці (залишається такою ж)
function findCharInMatrix(matrix, char) {
    for (let row = 0; row < matrix.length; row++) {
        for (let col = 0; col < matrix[row].length; col++) {
            if (matrix[row][col].toUpperCase() === char.toUpperCase()) {
                return { first: row, second: col };
            }
        }
    }
    return null;
}

// Функції для видалення пробілів та повторів в ключі (залишаються такими ж)
function trimming(message) {
    return message.trim().replace(/\s+/g, '');
}

function removeDuplicateCharsFromKey(key) {
    return [...new Set(key)].join('');
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
