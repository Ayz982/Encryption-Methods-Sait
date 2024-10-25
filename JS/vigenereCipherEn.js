document.getElementById("vigenere-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const message = document.getElementById("plain-text").value.trim().toUpperCase();
    const key = document.getElementById("key").value.trim().toUpperCase();
    const alphabetChoice = document.getElementById("alphabet").value;

    const alphabet = alphabetChoice === "latin" ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ" : "АБВГҐДЕЄЖЗИІЇЙКЛМНОПРСТУФХЦЧШЩЬЮЯ";
    function trimming(messageString){
        let result = "";
        for (let i = 0; i < messageString.length; i++) {
            if (messageString[i] !== " ") {
                result += messageString[i];
            }
        }
        return result;
    }
function findCharInFirstRowOfMatrix(matrix, letter) {
    for (let i = 0; i < alphabet.length; i++) {
        if (matrix[0][i] === letter) {
            return i;
            }
            }
}
function findCharInFirstColumnOfMatrix(matrix, letter) {
    for (let i = 0; i < alphabet.length; i++) {
        if (matrix[i][0] === letter) {
            return i;
            }
            }
        }
    function vigenereCipherEncryption(message, key, alphabet) {
        message = trimming(message).toUpperCase();
        key = trimming(key).toUpperCase();
        let result = '';
        let matrix = [];

        // Створюємо таблицю шифрування Віженера
        for (let i = 0; i < alphabet.length; i++) {
            matrix[i] = [];
            for (let j = 0; j < alphabet.length; j++) {
                matrix[i][j] = alphabet[(i + j) % alphabet.length];
            }
        }
        console.log(matrix);
        
        // Процес шифрування
        for (let i = 0; i < message.length; i++) {
            let row = findCharInFirstRowOfMatrix(matrix, key[i % key.length]);
            let col = findCharInFirstColumnOfMatrix(matrix, message[i]);
            if (row === -1 || col === -1) {
                throw new Error("Символ не знайдений в алфавіті");
            }
            result += matrix[row][col];
        }

        return result;
    }

    try {
        const encryptedMessage = vigenereCipherEncryption(message, key, alphabet);
        document.getElementById("encrypted-text").textContent = encryptedMessage;
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
