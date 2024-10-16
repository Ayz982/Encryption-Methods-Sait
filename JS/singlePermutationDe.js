document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('decrypt-btn').addEventListener('click', function () {
        const inputText = document.getElementById('message').value;
        const key = document.getElementById('key').value;

        if (inputText && key) {
            const decryptedText = singlePermutationDecryption(inputText, key);
            document.getElementById('decrypted-text').textContent = decryptedText;
            document.getElementById('result-box').style.display = 'block'; // Показати результати
        } else {
            alert("Будь ласка, введіть текст і ключ для дешифрування.");
        }
    });

    // Запобігання стандартній відправці форми на натисканні клавіші Enter
    document.getElementById('decryption-form').addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault(); // Запобігти стандартному надсиланню форми
            document.getElementById('decrypt-btn').click(); // Виклик кнопки дешифрування
        }
    });

    // Функція для дешифрування з однією перестановкою стовпців
    function singlePermutationDecryption(message, key) {
        message = trimming(message);
        const columns = key.length;
        const rows = Math.ceil(message.length / columns);
    
        // Додаємо заповнення, якщо необхідно
        const paddedMessage = padMessage(message, rows, columns);
    
        // Створюємо масив індексів ключа
        const keyWithIndex = key.split('').map((char, index) => ({ char, index }));
    
        // Визначаємо порядок стовпців за відсортованим ключем
        const sortedKey = [...keyWithIndex].sort((a, b) => a.char.localeCompare(b.char));
    
        // Створюємо порожню матрицю для дешифрування
        const matrix = Array.from({ length: rows }, () => Array(columns).fill(''));
    
        // Створюємо стовпці з повідомлення і розставляємо їх відповідно до позицій у введеному ключі
        let currentCharIndex = 0;
        sortedKey.forEach(({ index }) => {
            for (let row = 0; row < rows; row++) {
                if (currentCharIndex < paddedMessage.length) {
                    matrix[row][index] = paddedMessage[currentCharIndex++];
                }
            }
        });
    
        // Зчитуємо результат по рядках
        return readRows(matrix, rows, columns);
    }
    
    // Функція для читання рядків із матриці
    function readRows(matrix, rows, columns) {
        let result = '';
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < columns; col++) {
                if (matrix[row][col] !== '') {
                    result += matrix[row][col];
                }
            }
        }
        return result;
    }
    
    // Функція для видалення пробілів у повідомленні
    function trimming(message) {
        return message.replace(/\s/g, '');
    }
    
    // Функція для заповнення повідомлення порожніми символами, якщо це необхідно
    function padMessage(message, rows, columns) {
        return message.padEnd(rows * columns, '');
    }
    
    // Функція для визначення кількості рядків у матриці
    function getMatrixRows(message, columns) {
        return Math.ceil(message.length / columns);
    }
    

    // Функція для доповнення повідомлення символами, якщо довжина не кратна кількості стовпців
    function padMessage(message, rows, columns) {
        const size = rows * columns;
        return message.padEnd(size, '_'); // Доповнюємо символами "_"
    }

    // Створення матриці з текстом
    function createMatrix(message, rows, columns) {
        const matrix = [];
        for (let i = 0; i < rows; i++) {
            const row = [];
            for (let j = 0; j < columns; j++) {
                row.push(message.charAt(i * columns + j)); // Заповнення по рядках
            }
            matrix.push(row);
        }
        return matrix;
    }


// Функція для показу/приховування пояснень
document.getElementById('toggle-steps-btn').addEventListener('click', function () {
    const stepDiv = document.getElementById('step-by-step');
    const btn = document.getElementById('toggle-steps-btn');
    
    if (stepDiv.style.display === 'none' || stepDiv.style.display === '') {
        const inputText = document.getElementById('message').value;
        const key = document.getElementById('key').value;

        if (inputText && key) {
            const rows = getMatrixRows(inputText, key.length);
            const paddedMessage = padMessage(trimming(inputText), rows, key.length);
            const matrix = createMatrix(paddedMessage, rows, key.length);
            const decryptedText = singlePermutationDecryption(inputText, key);

            displaySteps(matrix, rows, key.length, decryptedText, key); // Передаємо ключ
            stepDiv.style.display = 'block';
            btn.textContent = 'Приховати пояснення';
        } else {
            alert("Будь ласка, введіть текст і ключ для шифрування.");
        }
    } else {
        stepDiv.style.display = 'none';
        btn.textContent = 'Показати пояснення';
    }
});
// Функція для покрокового відображення процесу дешифрування
function displaySteps(table, rows, columns, decryptedText, key) {
    if (!key) {
        alert('Будь ласка, введіть ключ.');
        return;
    }
    const stepDiv = document.getElementById('step-by-step');
    stepDiv.innerHTML = ''; // Очищуємо попередній контент

    // Крок 1: Шифротекст
    stepDiv.appendChild(createStepElement(`Шифротекст: ${document.getElementById('message').value}`));

    // Крок 2: Текст після видалення пробілів
    stepDiv.appendChild(createStepElement(`Текст після видалення пробілів: ${trimming(document.getElementById('message').value)}`));

    // Крок 3: Створення таблиці з ключем
    stepDiv.appendChild(createKeyTable(key));

    // Крок 4: Заповнення таблиці шифротекстом
    stepDiv.appendChild(createFillingTable(table, rows, columns, key));

    // Крок 5: Зчитування по стовпцях, згідно індексів ключа
    const unsortedTable = createUnsortedTable(table, rows, columns, key);
    stepDiv.appendChild(unsortedTable);

    // Крок 6: Відновлений текст (після зчитування таблиці по рядках)
    stepDiv.appendChild(createStepElement(`Дешифрований текст: ${decryptedText}`));
}

// Допоміжна функція для створення елементу кроку
function createStepElement(text) {
    const stepElement = document.createElement('div');
    stepElement.classList.add('important-step');
    stepElement.textContent = text;
    return stepElement;
}

// Функція для створення таблиці з ключем
function createKeyTable(key) {
    const keyTable = document.createElement('table');
    keyTable.classList.add('key-table');

    // Додати перший рядок з ключем
    const keyRow = document.createElement('tr');
    key.split('').forEach(char => {
        const cell = document.createElement('td');
        cell.textContent = char;
        keyRow.appendChild(cell);
    });
    keyTable.appendChild(keyRow);

    // Додати другий рядок з індексами відсортованого ключа
    const keyWithIndex = key.split('').map((char, index) => ({ char, index }));
    keyWithIndex.sort((a, b) => a.char.localeCompare(b.char));

    const keyIndexesRow = document.createElement('tr');
    keyWithIndex.forEach(item => {
        const cell = document.createElement('td');
        cell.textContent = item.index + 1; // Відображаємо 1-індексацію
        keyIndexesRow.appendChild(cell);
    });
    keyTable.appendChild(keyIndexesRow);

    return keyTable;
}

// Функція для заповнення таблиці
function createFillingTable(table, rows, columns, key) {
    const tableElement = document.createElement('table');
    tableElement.classList.add('decryption-table');

    // Додати перший рядок з ключем
    const keyRow = document.createElement('tr');
    key.split('').forEach(char => {
        const cell = document.createElement('td');
        cell.textContent = char;
        keyRow.appendChild(cell);
    });
    tableElement.appendChild(keyRow);

    // Заповнення таблиці по стовпцях
    for (let i = 0; i < rows; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < columns; j++) {
            const cell = document.createElement('td');
            cell.textContent = table[i][j];
            row.appendChild(cell);
        }
        tableElement.appendChild(row);
    }

    return tableElement;
}

// Функція для створення не відсортованої таблиці (відновлення початкового порядку стовпців)
function createUnsortedTable(table, rows, columns, key) {
    const unsortedTable = [];
    
    // Створення масиву для ключа з позиціями
    const keyWithIndex = key.split('').map((char, index) => ({ char, index }));
    
    // Сортування ключа з урахуванням позицій для відновлення початкового порядку
    keyWithIndex.sort((a, b) => a.index - b.index);

    // Відновлення початкового порядку стовпців таблиці
    keyWithIndex.forEach(keyInfo => {
        const column = [];
        for (let i = 0; i < rows; i++) {
            column.push(table[i][keyInfo.index]);
        }
        unsortedTable.push(column);
    });

    // Зчитування таблиці по рядках
    const result = document.createElement('div');
    const unsortedTableElement = document.createElement('table');
    
    // Додати заголовок
    const headerRow = document.createElement('tr');
    keyWithIndex.forEach(keyInfo => {
        const cell = document.createElement('td');
        cell.textContent = keyInfo.char;
        headerRow.appendChild(cell);
    });
    unsortedTableElement.appendChild(headerRow);

    // Заповнення таблиці
    for (let i = 0; i < rows; i++) {
        const row = document.createElement('tr');
        unsortedTable.forEach(column => {
            const cell = document.createElement('td');
            cell.textContent = column[i];
            row.appendChild(cell);
        });
        unsortedTableElement.appendChild(row);
    }

    result.appendChild(unsortedTableElement);
    return result;
}

});