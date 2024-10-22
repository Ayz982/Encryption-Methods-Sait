document.getElementById("hill-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const message = document.getElementById("plain-text").value.trim().toUpperCase();
    const keyInput = document.getElementById("key").value.trim();
    const alphabetChoice = document.getElementById("alphabet").value;

    // Вибір алфавіту
    const alphabet = alphabetChoice === "latin" ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ" : "АБВГДЕЄЖЗИІЇЙКЛМНОПРСТУФХЦЧШЩЬЮЯ";
    const keySize = Math.sqrt(keyInput.length); // Розмір матриці (квадрат)

    function hillCipherEncryption(message, keyInput, alphabet) {
        const n = Math.sqrt(keyInput.length);
        const keyMatrix = [];
        let result = '';

        // Створення матриці ключа
        for (let i = 0; i < n; i++) {
            keyMatrix[i] = [];
            for (let j = 0; j < n; j++) {
                keyMatrix[i][j] = parseInt(keyInput[i * n + j]);
            }
        }

        // Доповнення повідомлення до кратності розміру ключа
        while (message.length % n !== 0) {
            message += 'X'; // Додаємо 'X' для доповнення
        }

        // Шифрування
        for (let i = 0; i < message.length; i += n) {
            const block = message.slice(i, i + n);
            const encryptedBlock = [];

            for (let j = 0; j < n; j++) {
                let sum = 0;
                for (let k = 0; k < n; k++) {
                    const charIndex = alphabet.indexOf(block[k]);
                    sum += keyMatrix[j][k] * charIndex; // Множення матриці
                }
                encryptedBlock[j] = alphabet[sum % alphabet.length]; // Додаємо результат у шифротекст
            }
            result += encryptedBlock.join('');
        }

        return result;
    }

    const encryptedMessage = hillCipherEncryption(message, keyInput, alphabet);
    document.getElementById("encrypted-text").textContent = encryptedMessage;
    document.getElementById("result-box").style.display = "block";
});
