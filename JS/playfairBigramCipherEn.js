// Показати відповідну форму на основі вибраного методу шифрування
const methodSelect = document.getElementById('encryption-method');
const formKey = document.getElementById('encryption-form-key');
const formMatrix = document.getElementById('encryption-form-matrix');
const matrixInput = document.getElementById('matrix-input');

methodSelect.addEventListener('change', function () {
    if (methodSelect.value === 'key') {
        formKey.style.display = 'block';
        formMatrix.style.display = 'none';
    } else if (methodSelect.value === 'matrix') {
        formKey.style.display = 'none';
        formMatrix.style.display = 'block';
    }
});

// Генерація таблиці для шифрування за допомогою матриці
document.getElementById('generate-matrix-btn').addEventListener('click', function () {
    const rows = parseInt(document.getElementById('matrix-rows').value);
    const columns = parseInt(document.getElementById('matrix-columns').value);
    const encryptionTable = document.getElementById('encryption-table');

    // Очищення попередньої таблиці
    encryptionTable.innerHTML = '';

    // Генерація нової таблиці
    for (let r = 0; r < rows; r++) {
        let row = document.createElement('tr');
        for (let c = 0; c < columns; c++) {
            let td = document.createElement('td');
            td.innerHTML = `<input type="text" class="matrix-input" data-row="${r}" data-column="${c}" />`;
            row.appendChild(td);
        }
        encryptionTable.appendChild(row);
    }

    // Показати таблицю для заповнення
    matrixInput.style.display = 'block';
});

// Обробка події надсилання форми
document.getElementById('encryption-form-key').addEventListener('submit', function (event) {
    event.preventDefault();

    const message = document.getElementById('message-key').value;
    const key = document.getElementById('key').value;
    const rows = parseInt(document.getElementById('rows').value);
    const columns = parseInt(document.getElementById('columns').value);
    const alphabetType = document.getElementById('alphabet').value;

    try {
        const encryptedText = playfairBigramCipherEncryption(message, key, alphabetType, rows, columns);
        document.getElementById('encrypted-text').textContent = encryptedText;
        document.getElementById('result-box').style.display = 'block'; // Показати результати
    } catch (error) {
        alert(error.message); // Вивести повідомлення про помилку
    }
});

// Функція для шифрування за допомогою біграмного шифру Плейфейра
function playfairBigramCipherEncryption(message, key, alphabetType, rows, columns) {
    message = trimming(message).toUpperCase();
    key = removeDuplicateCharsFromKey(trimming(key).toUpperCase());
    const alphabet = getAlphabet(alphabetType);

    if (message.length % 2 !== 0) {
        throw new Error("Довжина повідомлення повинна бути парною!");
    }

    let ABC2 = '';
    for (let i = 0; i < alphabet.length; i++) {
        if (key.indexOf(alphabet[i]) === -1) {
            ABC2 += alphabet[i];
        }
    }

    const ABCEncryption = key + ABC2;
    const encryptionTable = createEncryptionTable(ABCEncryption, rows, columns);
    let result = '';

    for (let i = 0; i < message.length; i += 2) {
        const indexLeading = findCharInMatrix(encryptionTable, message[i]);
        const indexTrailing = findCharInMatrix(encryptionTable, message[i + 1]);
        if (indexLeading.first !== indexTrailing.first && indexLeading.second !== indexTrailing.second) {
            result += encryptionTable[indexLeading.first][indexTrailing.second];
            result += encryptionTable[indexTrailing.first][indexLeading.second];
        } else if (indexLeading.first !== indexTrailing.first && indexLeading.second === indexTrailing.second) {
            result += encryptionTable[(indexTrailing.first + 1) % rows][indexTrailing.second];
            result += encryptionTable[(indexLeading.first + 1) % rows][indexLeading.second];
        } else if (indexLeading.first === indexTrailing.first && indexLeading.second !== indexTrailing.second) {
            result += encryptionTable[indexTrailing.first][(indexTrailing.second + 1) % columns];
            result += encryptionTable[indexLeading.first][(indexLeading.second + 1) % columns];
        }
    }

    return result;
}

// Функція для створення таблиці шифру
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
// Функція для пошуку символу в таблиці
function findCharInMatrix(matrix, char) {
    for (let row = 0; row < matrix.length; row++) {
        for (let col = 0; col < matrix[row].length; col++) {
            if (matrix[row][col] === char) {
                return { first: row, second: col };
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
function trimming(message) {
    return message.trim().replace(/\s+/g, ''); // Видаляємо пробіли на початку, в кінці та зайві пробіли всередині
}
function removeDuplicateCharsFromKey(key) {
    return [...new Set(key)].join('');
}
// Обробка події надсилання форми для шифрування з використанням матриці
document.getElementById('matrix-encryption-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const message = document.getElementById('message-matrix').value.toUpperCase();
    const rows = parseInt(document.getElementById('matrix-rows').value);
    const columns = parseInt(document.getElementById('matrix-columns').value);

    // Збираємо таблицю з введеними значеннями
    const matrix = [];
    for (let r = 0; r < rows; r++) {
        matrix[r] = [];
        for (let c = 0; c < columns; c++) {
            const input = document.querySelector(`input[data-row="${r}"][data-column="${c}"]`);
            if (input) {
                matrix[r][c] = input.value.trim().toUpperCase();
            }
        }
    }

    // Тут можете вставити вашу логіку шифрування на основі таблиці
    try {
        const encryptedText = playfairBigramCipherEncryptionWithMatrix(message, matrix, rows, columns);
        document.getElementById('encrypted-text').textContent = encryptedText;
        document.getElementById('result-box').style.display = 'block'; // Показати результати
    } catch (error) {
        alert(error.message); // Вивести повідомлення про помилку
    }
});

// Приклад функції шифрування на основі таблиці
function playfairBigramCipherEncryptionWithMatrix(message, matrix, rows, columns) {
    // Приведення повідомлення до верхнього регістру
    message = message.trim().toUpperCase();

    if (message.length % 2 !== 0) {
        throw new Error("Довжина повідомлення повинна бути парною!");
    }

    let result = '';

    for (let i = 0; i < message.length; i += 2) {
        const indexLeading = findCharInMatrix(matrix, message[i]);
        const indexTrailing = findCharInMatrix(matrix, message[i + 1]);

        if (indexLeading && indexTrailing) {
            // Логіка шифрування, схожа на вашу існуючу функцію
            if (indexLeading.first !== indexTrailing.first && indexLeading.second !== indexTrailing.second) {
                result += matrix[indexLeading.first][indexTrailing.second];
                result += matrix[indexTrailing.first][indexLeading.second];
            } else if (indexLeading.first !== indexTrailing.first && indexLeading.second === indexTrailing.second) {
                result += matrix[(indexTrailing.first + 1) % rows][indexTrailing.second];
                result += matrix[(indexLeading.first + 1) % rows][indexLeading.second];
            } else if (indexLeading.first === indexTrailing.first && indexLeading.second !== indexTrailing.second) {
                result += matrix[indexTrailing.first][(indexTrailing.second + 1) % columns];
                result += matrix[indexLeading.first][(indexLeading.second + 1) % columns];
            }
        } else {
            throw new Error("Символ не знайдений в таблиці.");
        }
    }

    return result;
}

// Функція для пошуку символу в таблиці
function findCharInMatrix(matrix, char) {
    for (let row = 0; row < matrix.length; row++) {
        for (let col = 0; col < matrix[row].length; col++) {
            if (matrix[row][col] === char) {
                return { first: row, second: col };
            }
        }
    }
    return null;
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
