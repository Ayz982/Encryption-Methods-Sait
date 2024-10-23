document.getElementById("matrix-size").addEventListener("change", function () {
    const size = parseInt(this.value);
    const container = document.getElementById("key-matrix-container");

    // Очищуємо попередню таблицю
    container.innerHTML = '';

    // Створюємо нову таблицю для ключа
    const table = document.createElement("table");
    table.classList.add("key-matrix");

    for (let i = 0; i < size; i++) {
        const row = document.createElement("tr");
        for (let j = 0; j < size; j++) {
            const cell = document.createElement("td");
            const input = document.createElement("input");
            input.type = "number";
            input.classList.add("matrix-input");
            input.required = true;
            cell.appendChild(input);
            row.appendChild(cell);
        }
        table.appendChild(row);
    }

    container.appendChild(table);
});

document.getElementById("hill-decryption-form").addEventListener("submit", function (event) {
    event.preventDefault();

    const message = document.getElementById("cipher-text").value.trim().toUpperCase();
    const matrixSize = parseInt(document.getElementById("matrix-size").value);
    const alphabetChoice = document.getElementById("alphabet").value;

    // Вибір алфавіту
    const alphabet = alphabetChoice === "latin" ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ" : "АБВГДЕЄЖЗИІЇЙКЛМНОПРСТУФХЦЧШЩЬЮЯ";
    const mod = alphabet.length;

    // Збирання ключа з таблиці
    const keyMatrix = [];
    const inputs = document.querySelectorAll(".matrix-input");
    let index = 0;
    for (let i = 0; i < matrixSize; i++) {
        keyMatrix[i] = [];
        for (let j = 0; j < matrixSize; j++) {
            keyMatrix[i][j] = parseInt(inputs[index].value);
            index++;
        }
    }

    // Функція для обчислення детермінанта матриці 2x2
    function determinant2x2(matrix) {
        return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
    }

    // Функція для обчислення інверсії матриці 2x2
    function invertMatrix2x2(matrix) {
        const det = determinant2x2(matrix);
        if (det === 0) {
            alert('Матриця не має оберненої (детермінант 0).');
            return null;
        }

        const inverseMatrix = [
            [matrix[1][1], -matrix[0][1]],
            [-matrix[1][0], matrix[0][0]]
        ];

        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 2; j++) {
                inverseMatrix[i][j] = (inverseMatrix[i][j] * modInverse(det, mod)) % mod;
                if (inverseMatrix[i][j] < 0) {
                    inverseMatrix[i][j] += mod;
                }
            }
        }

        return inverseMatrix;
    }

    // Функція для обчислення детермінанта матриці 3x3
    function determinant3x3(matrix) {
        return matrix[0][0] * (matrix[1][1] * matrix[2][2] - matrix[1][2] * matrix[2][1]) -
            matrix[0][1] * (matrix[1][0] * matrix[2][2] - matrix[1][2] * matrix[2][0]) +
            matrix[0][2] * (matrix[1][0] * matrix[2][1] - matrix[1][1] * matrix[2][0]);
    }

    // Функція для обчислення інверсії матриці 3x3
    function invertMatrix3x3(matrix) {
        const det = determinant3x3(matrix);
        if (det === 0) {
            alert('Матриця не має оберненої (детермінант 0).');
            return null;
        }

        let inverseMatrix = [
            [
                matrix[1][1] * matrix[2][2] - matrix[1][2] * matrix[2][1],
                -(matrix[0][1] * matrix[2][2] - matrix[0][2] * matrix[2][1]),
                matrix[0][1] * matrix[1][2] - matrix[0][2] * matrix[1][1]
            ],
            [
                -(matrix[1][0] * matrix[2][2] - matrix[1][2] * matrix[2][0]),
                matrix[0][0] * matrix[2][2] - matrix[0][2] * matrix[2][0],
                -(matrix[0][0] * matrix[1][2] - matrix[0][2] * matrix[1][0])
            ],
            [
                matrix[1][0] * matrix[2][1] - matrix[1][1] * matrix[2][0],
                -(matrix[0][0] * matrix[2][1] - matrix[0][1] * matrix[2][0]),
                matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]
            ]
        ];

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                inverseMatrix[i][j] = (inverseMatrix[i][j] * modInverse(det, mod)) % mod;
                if (inverseMatrix[i][j] < 0) {
                    inverseMatrix[i][j] += mod;
                }
            }
        }

        return inverseMatrix;
    }

    // Функція для обчислення оберненого по модулю числа (модульної інверсії)
    function modInverse(a, mod) {
        a = (a % mod + mod) % mod;
        for (let x = 1; x < mod; x++) {
            if ((a * x) % mod === 1) {
                return x;
            }
        }
        return 1;
    }

    // Основна функція для вибору правильної інверсії матриці залежно від її розміру
    function invertMatrix(matrix) {
        if (matrix.length === 2) {
            return invertMatrix2x2(matrix);
        } else if (matrix.length === 3) {
            return invertMatrix3x3(matrix);
        } else {
            alert('Інверсія для матриць більшого розміру не підтримується.');
            return null;
        }
    }

    // Функція для множення матриці на вектор
    function multiplyMatrixVector(matrix, vector, mod) {
        const result = [];
        for (let i = 0; i < matrix.length; i++) {
            let sum = 0;
            for (let j = 0; j < matrix[i].length; j++) {
                sum += matrix[i][j] * vector[j];
            }
            result.push((sum % mod + mod) % mod);
        }
        return result;
    }

    // Основна функція дешифрування за допомогою шифру Хілла
    function hillCipherDecryption(cipherText, keyMatrix, alphabet) {
        let decryptedText = '';
        const matrixSize = keyMatrix.length;

        const invertedMatrix = invertMatrix(keyMatrix);
        if (!invertedMatrix) {
            alert('Неможливо інвертувати матрицю.');
            return '';
        }

        let numericCipherText = [];
        for (let char of cipherText) {
            let index = alphabet.indexOf(char);
            if (index === -1) {
                alert(`Символ '${char}' не знайдено в алфавіті.`);
                return '';
            }
            numericCipherText.push(index);
        }

        while (numericCipherText.length % matrixSize !== 0) {
            numericCipherText.push(alphabet.indexOf('X'));
        }

        let groupedCipherText = [];
        for (let i = 0; i < numericCipherText.length; i += matrixSize) {
            groupedCipherText.push(numericCipherText.slice(i, i + matrixSize));
        }

        for (let group of groupedCipherText) {
            let decryptedGroup = multiplyMatrixVector(invertedMatrix, group, alphabet.length);
            for (let num of decryptedGroup) {
                decryptedText += alphabet[num];
            }
        }

        return decryptedText;
    }

    const decryptedMessage = hillCipherDecryption(message, keyMatrix, alphabet);
    document.getElementById("decrypted-text").textContent = decryptedMessage;
    document.getElementById("result-box").style.display = "block";
});
