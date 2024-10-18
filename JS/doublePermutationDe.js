function splitStringToInt(str) {
    return str.split(' ').map(Number);
}

function trimming(str) {
    return str.trim();
}

function trimming2(str) {
    let result = "";
    for (let i = 0; i < str.length; i++) {
        if (str[i] != " ") {
            result += str[i];
        }
    }
    return result;
}
function padMessage(message, row, columns) {
    const totalLength = row * columns;
    while (message.length < totalLength) {
        message += '_'; // Доповнюємо символом "_"
    }
    return message;
}

function fillMatrixWithMessageR(message, matrix, row, columns) {
    let k = 0;
    for (let i = 0; i < row; i++) {
        for (let j = 0; j < columns; j++) {
            if (k < message.length) {
                matrix[i][j] = message[k];
                k++;
            }
        }
    }
}

function fillColumnsByRow(matrix, row, columns) {
    let result = '';
    for (let i = 0; i < row; i++) {
        for (let j = 0; j < columns; j++) {
            result += matrix[i][j];
        }
    }
    return result;
}

function doublePermutationDecryption(message, keyColumns, keyRow) {
    const keyR = splitStringToInt(trimming(keyRow));
    const keyC = splitStringToInt(trimming(keyColumns));
    const row = keyR.length;
    const columns = keyC.length;
    // Сортуємо ключі
    const sortKeyR = [];
    for(let i = 0; i < row; i++){
        sortKeyR.push(keyR[i]);
    }
    sortKeyR.sort((a, b) => a - b);
    // Сортуємо ключі
    const sortKeyC = [];
    for(let i = 0; i < columns; i++){
        sortKeyC.push(keyC[i]);
    }
    sortKeyC.sort((a, b) => a - b);
    console.log(sortKeyR);
    console.log(sortKeyC);
    message = trimming2(message);
    message = padMessage(message, row, columns);

    const matrix = Array.from({ length: row }, () => Array(columns).fill(null));

    // Заповнюємо матрицю рядками
    fillMatrixWithMessageR(message, matrix, row, columns);

    // Переставляємо рядки відповідно до ключа
let permutedMatrix = Array.from({ length: row }, () => Array(columns).fill(null));
let countRow = 0;

for (let i = 0; i < row; i++) {
    for (let j = 0; j < row; j++) {
        if (sortKeyR[j] === keyR[i]) { // Порівнюємо значення
            for (let g = 0; g < columns; g++) {
                permutedMatrix[countRow][g] = matrix[j][g]; // Копіюємо рядки на нове місце
            }
            countRow++;
            break;
        }
    }
}
// Переставляємо стовпці відповідно до ключа
let finalMatrix = Array.from({ length: row }, () => Array(columns).fill(null));
let countColumn = 0;

for (let i = 0; i < columns; i++) {
    for (let j = 0; j < columns; j++) {
        if (sortKeyC[j] === keyC[i]) { // Порівнюємо значення
            for (let g = 0; g < row; g++) {
                finalMatrix[g][countColumn] = permutedMatrix[g][j]; // Копіюємо стовпці на нове місце
            }
            countColumn++;
            break;
        }
    }
}

console.log(finalMatrix);
    // Заповнюємо результат
    const result = fillColumnsByRow(finalMatrix, row, columns);
    return result.replace(/_/g, ''); // Видаляємо символи заповнення
}

// Виклик функції для тестування
document.getElementById('encryption-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const inputText = document.getElementById('input-text').value;
    const rows = document.getElementById('rows').value;
    const columns = document.getElementById('columns').value;

    const decryptedMessage = doublePermutationDecryption(inputText, columns, rows);
    document.getElementById('encrypted-text').innerText = decryptedMessage;
    document.getElementById('result-box').style.display = 'block';
});

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
