document.getElementById('magic-square-size').addEventListener('change', function() {
    const size = parseInt(this.value);
    const table = document.getElementById('square-table');
    table.innerHTML = '';  // Очищаємо таблицю

    // Створюємо таблицю на основі вибраної розмірності
    for (let i = 0; i < size; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < size; j++) {
            const cell = document.createElement('td');
            const input = document.createElement('input');
            input.type = 'number';
            input.min = 1;
            input.max = size * size;
            input.required = true;
            input.className = 'square-input';
            cell.appendChild(input);
            row.appendChild(cell);
        }
        table.appendChild(row);
    }

    // Показуємо таблицю для введення
    document.getElementById('magic-square-input').style.display = 'block';
});

document.getElementById('encryption-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const message = document.getElementById('input-text').value;
    const size = parseInt(document.getElementById('magic-square-size').value);
    const squareInputs = document.querySelectorAll('.square-input');
    let magicSquare = Array.from({ length: size }, () => Array(size).fill(0));

    // Заповнюємо масив магічного квадрата з введених значень
    let inputIndex = 0;
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            magicSquare[i][j] = parseInt(squareInputs[inputIndex].value);
            inputIndex++;
        }
    }

    const encryptedMessage = magicSquareEncryption(magicSquare, message);
    document.getElementById('encrypted-text').innerText = encryptedMessage;
    document.getElementById('result-box').style.display = 'block';
});
// Обробка події надсилання форми
document.getElementById('encryption-form').addEventListener('submit', function (event) {
    event.preventDefault(); // Зупинити стандартну поведінку форми

    const inputText = document.getElementById('input-text').value;
    const squareInputs = document.querySelectorAll('.square-input');
    const size = parseInt(document.getElementById('magic-square-size').value);

    // Створюємо магічний квадрат з введених користувачем значень
    const magicSquare = createMagicSquare(squareInputs, size);

    // Шифруємо повідомлення за допомогою магічного квадрата
    const encryptedText = magicSquareEncryption(magicSquare, inputText);
    document.getElementById('encrypted-text').textContent = encryptedText;
    document.getElementById('result-box').style.display = 'block'; // Показати результати
});

// Функція для створення магічного квадрата з введених користувачем значень
function createMagicSquare(inputs, size) {
    let magicSquare = Array.from({ length: size }, () => Array(size).fill(0));
    let inputIndex = 0;

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            magicSquare[i][j] = parseInt(inputs[inputIndex].value);
            inputIndex++;
        }
    }
    console.log(magicSquare);
    
    return magicSquare;
}

// Метод шифрування магічним квадратом
function magicSquareEncryption(square, message) {
    message = trimming(message);
    console.log(message);
    message = padToPerfectSquare(message); // Додаємо символи до ідеального квадрата
    const maxMessageLength = square.length * square.length; // Максимальна кількість символів в магічному квадраті
    message = message.length > maxMessageLength ? message.slice(0, maxMessageLength) : message; // Обрізаємо повідомлення, якщо воно довше
    const n = Math.sqrt(message.length);
    let stringMatrix = Array.from({ length: n }, () => Array(n).fill(''));
    // Створюємо матрицю з повідомлення згідно з магічним квадратом
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            stringMatrix[i][j] = message[square[i][j] - 1] || '_';  // Якщо не вистачає символів, додаємо "_"
        }
    }
    console.log(stringMatrix);
    // Читання матриці по стовпцях для шифрування
    let encryptedText = fillColumnsByRow(stringMatrix, n);

    // Розбиваємо результат на рядки по n символів і розділяємо їх пробілом
    return splitStringIntoChunks(encryptedText, n);
}
// Функція для розбивання зашифрованого рядка на шматки по n символів
function splitStringIntoChunks(text, chunkSize) {
    const chunks = [];
    for (let i = 0; i < text.length; i += chunkSize) {
        chunks.push(text.substring(i, i + chunkSize));
    }
    return chunks.join(' '); // Повертаємо рядок, розбитий пробілами
}
// Функція для доповнення повідомлення до ідеального квадрата
function padToPerfectSquare(message) {
    let length = message.length;
    let nextPerfectSquare = Math.ceil(Math.sqrt(length)) ** 2;  // Наступний ідеальний квадрат
    return message.padEnd(nextPerfectSquare, '_'); // Додаємо символи "_", щоб зробити довжину ідеальним квадратом
}

// Функція для зчитування матриці по стовпцях
function fillColumnsByRow(matrix, rowCount) {
    let result = '';
    for (let row = 0; row < rowCount; row++) {
        for (let col = 0; col < rowCount; col++) {
            result += matrix[row][col]; // Додаємо символи по стовпцях
        }
    }
    console.log(result);
    return result;
}

// Функція для видалення пробілів на початку та в кінці
function trimming(message) {
    let result = "";
    for (let i = 0; i < message.length; i++) {
        if (message[i] != " ") {
            result += message[i];
        }
    }
    return result;
}


// Функція для групування шифротексту по n символів
function splitStringIntoChunks(text, chunkSize) {
    const chunks = [];
    for (let i = 0; i < text.length; i += chunkSize) {
        chunks.push(text.substring(i, i + chunkSize));
    }
    return chunks.join(' '); // Повертаємо рядок, розбитий пробілами
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
