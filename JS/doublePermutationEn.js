document.getElementById('encryption-form').addEventListener('submit', function (e) {
    e.preventDefault();

    // Отримуємо дані з форми
    const message = document.getElementById('input-text').value;
    const keyRows = document.getElementById('rows').value;
    const keyColumns = document.getElementById('columns').value;

    // Виконуємо шифрування подвійною перестановкою
    const encryptedMessage = doublePermutationEncryption(message, keyColumns, keyRows);

    // Відображаємо результат шифрування
    document.getElementById('encrypted-text').textContent = encryptedMessage;
    document.getElementById('result-box').style.display = 'block';
});

// Функція для шифрування подвійною перестановкою
function doublePermutationEncryption(message, keyColumns, keyRows) {
    // Допоміжні функції
    function splitStringToInt(str) {
        return str.trim().split('').map(Number);
    }

    function trimming(str) {
        return str.replace(/\s+/g, '');
    }

    function padMessage(msg, rows, cols) {
        while (msg.length < rows * cols) {
            msg += '_';
        }
        return msg;
    }

    function fillMatrixWithMessageR(msg, matrix, rows, cols) {
        let k = 0;
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                matrix[i][j] = msg[k] || '_';
                k++;
            }
        }
    }

    function fillColumnsByRow(matrix, rows, cols) {
        let result = '';
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                result += matrix[i][j];
            }
        }
        return result;
    }

    function splitStringIntoChunks(str, chunkSize) {
        let result = [];
        for (let i = 0; i < str.length; i += chunkSize) {
            result.push(str.substring(i, i + chunkSize));
        }
        return result.join(' ');
    }

    // Основний код шифрування
    let keyR = splitStringToInt(trimming(keyRows));
    let keyC = splitStringToInt(trimming(keyColumns));
    let rows = keyR.length;
    let cols = keyC.length;

    let sortedKeyR = [...keyR].sort((a, b) => a - b);
    let sortedKeyC = [...keyC].sort((a, b) => a - b);

    message = trimming(message);
    message = padMessage(message, rows, cols);

    let matrix1 = Array.from({ length: rows }, () => Array(cols).fill(''));
    let matrix2 = Array.from({ length: rows }, () => Array(cols).fill(''));

    // Заповнюємо першу матрицю повідомленням
    fillMatrixWithMessageR(message, matrix1, rows, cols);

    // Перестановка стовпців
    let countColumn = 0;
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < cols; j++) {
            if (keyC[j] === sortedKeyC[i]) {
                for (let g = 0; g < rows; g++) {
                    matrix2[g][countColumn] = matrix1[g][j];
                }
                countColumn++;
                break;
            }
        }
    }

    // Перестановка рядків
    let countRow = 0;
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < rows; j++) {
            if (keyR[j] === sortedKeyR[i]) {
                for (let g = 0; g < cols; g++) {
                    matrix1[countRow][g] = matrix2[j][g];
                }
                countRow++;
                break;
            }
        }
    }

    // Формуємо результат
    let result = fillColumnsByRow(matrix1, rows, cols);

    return splitStringIntoChunks(result, 5);
}

// Функція для заповнення повідомлення "_"
function padMessage(message, rows, columns) {
    const totalSize = rows * columns;
    while (message.length < totalSize) {
        message += '_';
    }
    return message;
}

// Функція для сортування стовпців матриці за ключем
function sortColumns(matrix, key) {
    const sortedMatrix = [];
    const keyCopy = [...key];
    keyCopy.sort((a, b) => a - b); // Сортуємо копію ключа

    for (let i = 0; i < matrix.length; i++) {
        sortedMatrix[i] = [];
    }

    keyCopy.forEach((sortedValue, newIndex) => {
        const originalIndex = key.indexOf(sortedValue);
        for (let row = 0; row < matrix.length; row++) {
            sortedMatrix[row][newIndex] = matrix[row][originalIndex];
        }
    });

    return sortedMatrix;
}

// Функція для сортування рядків матриці за ключем
function sortRows(matrix, key) {
    const sortedMatrix = [];
    const keyCopy = [...key];
    keyCopy.sort((a, b) => a - b); // Сортуємо копію ключа

    keyCopy.forEach((sortedValue, newIndex) => {
        const originalIndex = key.indexOf(sortedValue);
        sortedMatrix[newIndex] = matrix[originalIndex];
    });

    return sortedMatrix;
}

// Функція для перетворення матриці у рядок
function matrixToString(matrix) {
    let result = '';
    for (let i = 0; i < matrix.length; i++) {
        result += matrix[i].join('');
    }
    return result.match(/.{1,5}/g).join(' '); // Розбиваємо результат на групи по 5 символів
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
