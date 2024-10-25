document.getElementById("decryption-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const message = document.getElementById("cipher-text").value.trim().toUpperCase();
    const key = document.getElementById("key").value.trim().toUpperCase();
    const alphabetChoice = document.getElementById("alphabet").value;

    const alphabet = alphabetChoice === "latin" ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ" : "АБВГҐДЕЄЖЗИІЇЙКЛМНОПРСТУФХЦЧШЩЬЮЯ";
    function findCharInFirstRowOfMatrix(matrix, char) {
        for (let j = 0; j < matrix[0].length; j++) {
            if (matrix[0][j] === char) {
                return j;
            }
        }
        throw new Error("Символ не знайдений у верхньому рядку таблиці.");
    }

    function findCharInColumnByRow(matrix, char, row) {
        for (let i = 0; i < matrix.length; i++) {
            if (matrix[row][i] === char) {
                return i;
            }
        }
        throw new Error("Символ не знайдений у стовпці."); // Зміна наявної помилки
    }
    function trimming(messageString){
        let result = "";
        for (let i = 0; i < messageString.length; i++) {
            if (messageString[i] !== " ") {
                result += messageString[i];
            }
        }
        return result;
    }

    function vigenereCipherDecryption(message, key) {
        let result = '';
        message = trimming(message).toUpperCase();
        key = trimming(key).toUpperCase();
        let matrix = [];

        // Створюємо таблицю шифрування Віженера
        for (let i = 0; i < alphabet.length; i++) {
            matrix[i] = [];
            for (let j = 0; j < alphabet.length; j++) {
                matrix[i][j] = alphabet[(i + j) % alphabet.length];
            }
        }

        for (let i = 0; i < message.length; i++) {
            const indexR = findCharInFirstRowOfMatrix(matrix, key[i % key.length]);
            const indexC = findCharInColumnByRow(matrix, message[i], indexR);
            result += matrix[0][indexC];
        }
        return result;
    }

    try {
        const decryptedMessage = vigenereCipherDecryption(message, key);
        document.getElementById("decrypted-text").textContent = decryptedMessage;
        document.getElementById("result-box").style.display = "block";
    } catch (error) {
        alert(error.message);
    }
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
