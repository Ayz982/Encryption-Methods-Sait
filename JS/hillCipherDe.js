document.getElementById("hill-decryption-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const message = document.getElementById("cipher-text").value.trim().toUpperCase();
    const keyInput = document.getElementById("key").value.trim();
    const alphabetChoice = document.getElementById("alphabet").value;

    // Вибір алфавіту
    const alphabet = alphabetChoice === "latin" ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ" : "АБВГДЕЄЖЗИІЇЙКЛМНОПРСТУФХЦЧШЩЬЮЯ";
    const n = Math.sqrt(keyInput.length); // Розмір матриці (квадратна)

    function hillCipherDecryption(message, keyInput, alphabet) {
        const keyMatrix = createKeyMatrix(keyInput, n);
        console.log("Key matrix:", keyMatrix);

        const det = determinant(keyMatrix);
        console.log("Determinant:", det);

        const mod = alphabet.length;
        const invDet = modInverse(det, mod);
        console.log("Inverse determinant:", invDet);

        if (invDet === -1) {
            throw new Error("Не вдалося знайти обернену матрицю для заданого ключа.");
        }

        const invKeyMatrix = getInverseMatrix(keyMatrix, invDet, mod);
        console.log("Inverse key matrix:", invKeyMatrix);

        return decryptMessage(message, invKeyMatrix, alphabet);
    }

    function createKeyMatrix(keyInput, n) {
        const keyMatrix = [];
        for (let i = 0; i < n; i++) {
            keyMatrix[i] = [];
            for (let j = 0; j < n; j++) {
                keyMatrix[i][j] = parseInt(keyInput[i * n + j]);
            }
        }
        return keyMatrix;
    }

    function determinant(matrix) {
        const n = matrix.length;

        if (n === 1) {
            return matrix[0][0];
        } else if (n === 2) {
            // Детермінант 2x2
            return (matrix[0][0] * matrix[1][1]) - (matrix[0][1] * matrix[1][0]);
        } else {
            // Загальний випадок для n x n
            let det = 0;
            for (let i = 0; i < n; i++) {
                det += matrix[0][i] * determinant(getMinor(matrix, 0, i)) * (i % 2 === 0 ? 1 : -1);
            }
            return det;
        }
    }

    function getMinor(matrix, row, col) {
        return matrix.reduce((acc, r, i) => {
            if (i !== row) {
                acc.push(r.filter((_, j) => j !== col));
            }
            return acc;
        }, []);
    }

    function modInverse(a, m) {
        a = a % m;
        for (let x = 1; x < m; x++) {
            if ((a * x) % m === 1) return x;
        }
        return -1; // Не існує оберненого
    }

    function getInverseMatrix(matrix, invDet, modulus) {
        const adjugateMatrix = adjugate(matrix, modulus);
        console.log("Adjugate matrix:", adjugateMatrix);
    
        const inverseMatrix = adjugateMatrix.map(row =>
            row.map(value => (invDet * value) % modulus)
        ).map(row => row.map(value => (value + modulus) % modulus)); // Упевніться, що значення додатні
    
        // Транспонування
        const transposedMatrix = inverseMatrix[0].map((_, colIndex) => inverseMatrix.map(row => row[colIndex]));
        return transposedMatrix;
    }

    function adjugate(matrix, modulus) {
        const n = matrix.length;
        const adjugateMatrix = [];

        for (let i = 0; i < n; i++) {
            adjugateMatrix[i] = [];
            for (let j = 0; j < n; j++) {
                const minor = getMinor(matrix, i, j);
                adjugateMatrix[i][j] = Math.pow(-1, i + j) * determinant(minor) % modulus;
                adjugateMatrix[i][j] = (adjugateMatrix[i][j] + modulus) % modulus; // Переконатися, що результат додатний
            }
        }
        return adjugateMatrix;
    }

    function decryptMessage(message, invKeyMatrix, alphabet) {
        const n = invKeyMatrix.length;
        let result = '';

        // Доповнення повідомлення до кратності розміру ключа
        while (message.length % n !== 0) {
            message += 'X'; // Додаємо 'X' для доповнення
        }

        for (let i = 0; i < message.length; i += n) {
            const block = message.slice(i, i + n);
            const decryptedBlock = [];

            for (let j = 0; j < n; j++) {
                let sum = 0;
                for (let k = 0; k < n; k++) {
                    const charIndex = alphabet.indexOf(block[k]);
                    sum += invKeyMatrix[j][k] * charIndex; // Множення матриці
                }
                decryptedBlock[j] = alphabet[(sum % alphabet.length + alphabet.length) % alphabet.length]; // Додаємо результат у відкритий текст
            }
            result += decryptedBlock.join('');
        }

        return result;
    }

    const decryptedMessage = hillCipherDecryption(message, keyInput, alphabet);
    document.getElementById("decrypted-text").textContent = decryptedMessage;
    document.getElementById("result-box").style.display = "block";
});
