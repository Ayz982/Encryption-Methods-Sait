document.addEventListener('DOMContentLoaded', function () {
    // Обробка події надсилання форми для дешифрування
    document.getElementById('decryption-form').addEventListener('submit', function (event) {
        event.preventDefault(); // Зупинити стандартну поведінку форми

        const encryptedText = document.getElementById('encrypted-text').value; // Витяг значення
        const rowCount = parseInt(document.getElementById('rows').value);
        const columnCount = parseInt(document.getElementById('columns').value);

        if (!encryptedText || isNaN(rowCount) || isNaN(columnCount)) {
            alert('Будь ласка, заповніть всі поля коректно.');
            return; // Якщо є помилка, зупинити виконання
        }

        const decryptedText = simplePermutationDecryption(encryptedText, rowCount, columnCount);
        document.getElementById('decrypted-text').textContent = decryptedText; // Виводимо результат
        document.getElementById('result-box').style.display = 'block'; // Показуємо результати
    });

    // Функція для дешифрування
    function simplePermutationDecryption(cipherText, rowCount, columnCount) {
        const cleanedCipherText = cipherText.replace(/\s+/g, ''); // Видалення пробілів
        const matrix = createMatrixForDecryption(cleanedCipherText, rowCount, columnCount);
        let result = '';

        // Зчитування матриці по рядках
        for (let row = 0; row < rowCount; row++) {
            for (let col = 0; col < columnCount; col++) {
                result += matrix[row][col] || ''; // Додаємо символи по рядках
            }
        }

        return result.replace(/_/g, ''); // Повертаємо результат без заповнювальних символів
    }

    // Створення матриці для дешифрування
    function createMatrixForDecryption(cipherText, rowCount, columnCount) {
        const matrix = new Array(rowCount).fill(null).map(() => new Array(columnCount)); // Ініціалізуємо матрицю

        let index = 0;

        // Заповнюємо матрицю стовпцями
        for (let col = 0; col < columnCount; col++) {
            for (let row = 0; row < rowCount; row++) {
                if (index < cipherText.length) {
                    matrix[row][col] = cipherText.charAt(index++); // Заповнюємо значення
                } else {
                    matrix[row][col] = '_'; // Заповнення
                }
            }
        }
        return matrix;
    }

    // Додаткові функції для показу/приховування пояснень
    document.getElementById('toggle-steps-btn').addEventListener('click', function () {
    this.classList.toggle('active');
        const stepDiv = document.getElementById('step-by-step');
        const btn = document.getElementById('toggle-steps-btn');

        if (stepDiv.style.display === 'none' || stepDiv.style.display === '') {
            const encryptedText = document.getElementById('encrypted-text').value;
            const rowCount = parseInt(document.getElementById('rows').value);
            const columnCount = parseInt(document.getElementById('columns').value);

            if (!encryptedText || isNaN(rowCount) || isNaN(columnCount)) {
                alert('Будь ласка, заповніть всі поля коректно.');
                return; // Якщо є помилка, зупинити виконання
            }

            const decryptedText = simplePermutationDecryption(encryptedText, rowCount, columnCount);
            const matrix = createMatrixForDecryption(encryptedText.replace(/\s+/g, ''), rowCount, columnCount);

            displaySteps(matrix, rowCount, columnCount, encryptedText, decryptedText);
            stepDiv.style.display = 'block';
            btn.textContent = 'Приховати пояснення';
        } else {
            stepDiv.style.display = 'none';
            btn.textContent = 'Показати пояснення';
        }
    });

    function displaySteps(matrix, rowCount, columnCount, encryptedText, decryptedText) {
        const stepDiv = document.getElementById('step-by-step');
        stepDiv.innerHTML = ''; // Очищуємо попередній контент
    
        // Крок 1: Зашифрований текст
        const encryptedMessage = document.createElement('div');
        encryptedMessage.classList.add('important-step');
        encryptedMessage.textContent = `Зашифрований текст: ${encryptedText}`;
        stepDiv.appendChild(encryptedMessage);
    
        // Крок 2: Заповнення таблиці по стовпцях
        const fillColsHeading = document.createElement('h4');
        fillColsHeading.textContent = 'Заповнення таблиці по стовпцях:';
        stepDiv.appendChild(fillColsHeading);
    
        const colTable = document.createElement('table');
        colTable.classList.add('col-read-table');
    
        // Створення таблиці по стовпцях
        for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
            const row = document.createElement('tr');
            for (let colIndex = 0; colIndex < columnCount; colIndex++) {
                const cell = document.createElement('td');
                cell.textContent = matrix[rowIndex][colIndex] || ''; // Запобігаємо помилкам, якщо cell порожнє
                if (colIndex === 0) {
                    cell.style.backgroundColor = 'lightblue'; // Виділяємо перші елементи стовпців
                }
                row.appendChild(cell);
            }
            colTable.appendChild(row);
        }
        stepDiv.appendChild(colTable);
    
        // Крок 3: Зчитування таблиці по рядках
        const readRowsHeading = document.createElement('h4');
        readRowsHeading.textContent = 'Зчитування таблиці по рядках:';
        stepDiv.appendChild(readRowsHeading);
    
        const rowTable = document.createElement('table');
        rowTable.classList.add('row-read-table');
    
        // Створення таблиці по рядках
        for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
            const row = document.createElement('tr');
            for (let colIndex = 0; colIndex < columnCount; colIndex++) {
                const cell = document.createElement('td');
                cell.textContent = matrix[rowIndex][colIndex] || ''; // Запобігаємо помилкам, якщо cell порожнє
                if (rowIndex === 0) {
                    cell.style.backgroundColor = '#f0c0c0'; // Виділяємо перший рядок
                }
                row.appendChild(cell);
            }
            rowTable.appendChild(row);
        }
        stepDiv.appendChild(rowTable);
    
        // Крок 4: Результат дешифрування
        const finalResultDiv = document.createElement('div');
        finalResultDiv.classList.add('important-step');
        finalResultDiv.textContent = `Результат дешифрування: ${decryptedText}`;
        stepDiv.appendChild(finalResultDiv);
    }
    
});
