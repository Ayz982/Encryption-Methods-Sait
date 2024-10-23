document.getElementById("matrix-size").addEventListener("change", function() {
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

document.getElementById("hill-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const message = document.getElementById("plain-text").value.trim().toUpperCase();
    const alphabetChoice = document.getElementById("alphabet").value;
    const matrixSize = parseInt(document.getElementById("matrix-size").value);

    // Вибір алфавіту
    const alphabet = alphabetChoice === "latin" ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ" : "АБВГДЕЄЖЗИІЇЙКЛМНОПРСТУФХЦЧШЩЬЮЯ";

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

    // Шифрування
    const encryptedMessage = hillCipherEncryption(message, keyMatrix, alphabet);
    document.getElementById("encrypted-text").textContent = encryptedMessage;
    document.getElementById("result-box").style.display = "block";
});

function trimming(string){
    let result = "";
    for (let i = 0; i < message.length; i++) {
        if (message[i] !== " ") {
            result += message[i];
        }
    }
    return result;
}

function hillCipherEncryption(message, keyMatrix, alphabet) {
    message = trimming(message);
    const n = keyMatrix.length;
    let result = '';

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
