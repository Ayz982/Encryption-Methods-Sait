// Обробка події надсилання форми
document.getElementById('encrypt-btn').addEventListener('click', function () {
    const inputText = document.getElementById('message').value;
    const key = document.getElementById('key').value;

    if (inputText && key) {
        const encryptedText = singlePermutationEncryption(inputText, key);
        document.getElementById('encrypted-text').textContent = encryptedText;
        document.getElementById('result-box').style.display = 'block'; // Показати результати
    } else {
        alert("Будь ласка, введіть текст і ключ для шифрування.");
    }
});
document.getElementById('encryption-form').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent default form submission
        document.getElementById('encrypt-btn').click(); // Trigger the encrypt button
    }
});

// Метод шифрування одинарною перестановкою по ключу
function singlePermutationEncryption(message, key) {
    message = trimming(message);
    const columns = key.length;
    const rows = getMatrixRows(message, columns);
    const paddedMessage = padMessage(message, rows, columns);

    // Створення масиву для ключа з позиціями
    const keyWithIndex = key.split('').map((char, index) => ({ char, index }));
    
    // Сортування ключа з урахуванням позицій
    keyWithIndex.sort((a, b) => a.char.localeCompare(b.char) || a.index - b.index);

    let result = '';
    const string1 = createMatrix(paddedMessage, rows, columns);
    const string2 = Array.from(Array(rows), () => Array(columns)); // Порожня матриця для заповнення

    // Перестановка стовпців за відсортованим ключем
    keyWithIndex.forEach((keyInfo, countColumn) => {
        for (let g = 0; g < rows; g++) {
            string2[g][countColumn] = string1[g][keyInfo.index];
        }
    });

    result = readColumns(string2, rows, columns);
    return splitIntoGroups(result, columns); // Розбиваємо шифротекст на групи
}
// Функція для видалення пробілів
function trimming(message) {
    return message.trim().replace(/\s+/g, ''); // Видаляємо пробіли
}

// Функція для визначення кількості рядків у матриці
function getMatrixRows(message, columns) {
    return Math.ceil(message.length / columns);
}

// Функція для доповнення повідомлення символом "_"
function padMessage(message, rows, columns) {
    const size = rows * columns;
    return message.padEnd(size, '_'); // Заповнюємо символом "_"
}

// Створення матриці
function createMatrix(message, rows, columns) {
    const matrix = [];
    for (let i = 0; i < rows; i++) {
        matrix.push([]);
        for (let j = 0; j < columns; j++) {
            matrix[i][j] = message.charAt(i * columns + j); // Заповнення по рядках
        }
    }
    return matrix;
}

// Читання матриці по стовпцях
function readColumns(matrix, rows, columns) {
    let result = '';
    for (let col = 0; col < columns; col++) {
        for (let row = 0; row < rows; row++) {
            result += matrix[row][col];
        }
    }
    return result;
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
    if (stepDiv.style.display === 'none' || stepDiv.style.display === '') {
        const inputText = document.getElementById('message').value;
        const key = document.getElementById('key').value;

        if (inputText && key) {
            const rows = getMatrixRows(inputText, key.length);
            const paddedMessage = padMessage(trimming(inputText), rows, key.length);
            const matrix = createMatrix(paddedMessage, rows, key.length);
            const encryptedText = singlePermutationEncryption(inputText, key);

            displaySteps(matrix, rows, key.length, encryptedText, key)// Передаємо ключ
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


// Функція для покрокового відображення процесу шифрування
// Функція для покрокового відображення процесу шифрування
function displaySteps(table, rows, columns, encryptedText, key) {
    if (!key) {
        alert('Будь ласка, введіть ключ.');
        return;
    }
    const stepDiv = document.getElementById('step-by-step');
    stepDiv.innerHTML = ''; // Очищуємо попередній контент

    // Крок 1: Оригінальний текст
    const originalMessage = document.createElement('div');
    originalMessage.classList.add('important-step');
    originalMessage.textContent = `Оригінальний текст: ${document.getElementById('message').value}`;
    stepDiv.appendChild(originalMessage);

    // Крок 2: Текст після видалення пробілів
    const trimmedMessage = document.createElement('div');
    trimmedMessage.classList.add('important-step');
    trimmedMessage.textContent = `Текст після видалення пробілів: ${trimming(document.getElementById('message').value)}`;
    stepDiv.appendChild(trimmedMessage);

    // Крок 3: Створення таблиці з ключем
    const keyTableHeading = document.createElement('h4');
    keyTableHeading.textContent = 'Таблиця з ключем:';
    stepDiv.appendChild(keyTableHeading);

    const keyTable = document.createElement('table');
    keyTable.classList.add('key-table');

    // Додати перший рядок з ключем
    const keyRow = document.createElement('tr');
    const keyArray = key.split('');
    keyArray.forEach(char => {
        const cell = document.createElement('td');
        cell.textContent = char;
        keyRow.appendChild(cell);
    });
    keyTable.appendChild(keyRow);

    // Створення масиву об'єктів з буквами ключа та їх позиціями
    const keyWithIndex = key.split('').map((char, index) => ({ char, index }));

    // Сортування масиву об'єктів за літерами ключа
    keyWithIndex.sort((a, b) => a.char.localeCompare(b.char));

    // Додати другий рядок з індексами відсортованого ключа
    const keyIndexesRow = document.createElement('tr');
    keyArray.forEach(char => {
        const originalIndex = keyWithIndex.findIndex(item => item.char === char);
        const cell = document.createElement('td');
        cell.textContent = originalIndex + 1; // Відображаємо 1-індексацію
        keyIndexesRow.appendChild(cell);
    });
    keyTable.appendChild(keyIndexesRow);
    
    stepDiv.appendChild(keyTable);

    // Крок 4: Заповнення таблиці
    const fillTableHeading = document.createElement('h4');
    fillTableHeading.textContent = 'Заповнення таблиці по рядках:';
    stepDiv.appendChild(fillTableHeading);

    const tableElement = document.createElement('table');
    tableElement.classList.add('encryption-table');

    // Додати перший рядок з ключем
    const keyRowClone = document.createElement('tr');
    keyArray.forEach(char => {
        const cell = document.createElement('td');
        cell.textContent = char;
        keyRowClone.appendChild(cell);
    });
    tableElement.appendChild(keyRowClone);

    // Додати другий рядок з індексами відсортованого ключа
    const keyIndexesRowClone = document.createElement('tr');
    keyArray.forEach(char => {
        const originalIndex = keyWithIndex.findIndex(item => item.char === char);
        const cell = document.createElement('td');
        cell.textContent = originalIndex + 1; // Відображаємо 1-індексацію
        keyIndexesRowClone.appendChild(cell);
    });
    tableElement.appendChild(keyIndexesRowClone);

    // Заповнення таблиці по рядках
    for (let i = 0; i < rows; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < columns; j++) {
            const cell = document.createElement('td');
            cell.textContent = table[i][j];
            row.appendChild(cell);
        }
        tableElement.appendChild(row);
    }
    stepDiv.appendChild(tableElement);

    // Виділення стовпця з номером 1
    const firstIndex = keyWithIndex[0].index; // Зберігаємо позицію першого елемента відсортованого ключа
    const cells = tableElement.getElementsByTagName('td');
    for (let i = 0; i < rows + 2; i++) { // +2 для заголовків
        cells[i * columns + firstIndex].style.backgroundColor = 'lightgreen'; // Виділяємо стовпець
    }

    // Крок 5: Зчитування по стовпцях
    const sortedTableHeading = document.createElement('h4');
    sortedTableHeading.textContent = 'Таблиця після перестановки:';
    stepDiv.appendChild(sortedTableHeading);

    const sortedTable = createSortedTable(table, rows, columns, key);
    stepDiv.appendChild(sortedTable);

    // Крок 6: Шифротекст
    const encryptedTextElement = document.createElement('div');
    encryptedTextElement.classList.add('important-step');
    encryptedTextElement.textContent = `Шифротекст: ${encryptedText}`;
    stepDiv.appendChild(encryptedTextElement);
}

// Функція для створення таблиці з шифротекстом
function createSortedTable(table, rows, columns, keyWithIndex) {
    const sortedTable = document.createElement('table');
    sortedTable.classList.add('sorted-table');

    // Додати заголовок з відсортованим ключем
    const sortedKeyRow = document.createElement('tr');
    keyWithIndex.forEach(item => {
        const cell = document.createElement('td');
        cell.textContent = item.char;
        sortedKeyRow.appendChild(cell);
    });
    sortedTable.appendChild(sortedKeyRow);

    // Заповнити таблицю за відсортованими номерами
    for (let i = 0; i < rows; i++) {
        const row = document.createElement('tr');
        keyWithIndex.forEach((item, index) => {
            const cell = document.createElement('td');
            cell.textContent = table[i][item.index]; // Використовуємо відсортовані індекси
            row.appendChild(cell);
        });
        sortedTable.appendChild(row);
    }

    return sortedTable;
}


// Функція для створення відсортованої таблиці
// Функція для створення відсортованої таблиці
function createSortedTable(table, rows, columns, key) {
    const sortedTable = [];
    
    // Створення масиву для ключа з позиціями
    const keyWithIndex = key.split('').map((char, index) => ({ char, index }));
    
    // Сортування ключа з урахуванням позицій
    keyWithIndex.sort((a, b) => a.char.localeCompare(b.char) || a.index - b.index);
    
    // Зберігаємо стовпці за відсортованим ключем
    keyWithIndex.forEach(({ index }) => {
        const sortedColumn = [];
        for (let row = 0; row < rows; row++) {
            sortedColumn.push(table[row][index]);
        }
        sortedTable.push(sortedColumn);
    });

    const sortedTableElement = document.createElement('table');
    sortedTableElement.classList.add('sorted-table');

    // Додати перший рядок з ключем у відсортовану таблицю
    const sortedKeyRow = document.createElement('tr');
    keyWithIndex.forEach(({ char }) => {
        const cell = document.createElement('td');
        cell.textContent = char;
        sortedKeyRow.appendChild(cell);
    });
    sortedTableElement.appendChild(sortedKeyRow);

    // Додати другий рядок з номерами у відсортовану таблицю
    const sortedKeyNumbersRow = document.createElement('tr');

    // Створюємо рядок з індексами від 1 до n
    for (let i = 0; i < keyWithIndex.length; i++) {
        const cell = document.createElement('td');
        cell.textContent = i + 1; // Відображаємо 1-індексацію
        sortedKeyNumbersRow.appendChild(cell);
    }
    sortedTableElement.appendChild(sortedKeyNumbersRow);

    // Заповнення відсортованої таблиці
    for (let i = 0; i < rows; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < sortedTable.length; j++) {
            const cell = document.createElement('td');
            cell.textContent = sortedTable[j][i];
            row.appendChild(cell);
        }
        sortedTableElement.appendChild(row);
    }

    // Виділення першого стовпця
    const sortedCells = sortedTableElement.getElementsByTagName('td');
    for (let i = 0; i < rows + 2; i++) { // +2 для заголовків
        sortedCells[i * sortedTable.length].style.backgroundColor = 'lightgreen'; // Виділяємо перший стовпець
    }
    
    return sortedTableElement;
}
