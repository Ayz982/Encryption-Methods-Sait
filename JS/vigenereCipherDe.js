document.getElementById("decryption-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const message = document.getElementById("cipher-text").value.trim().toUpperCase();
    const key = document.getElementById("key").value.trim().toUpperCase();
    const alphabet = document.getElementById("alphabet").value;


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
            if (matrix[i][row] === char) {
                return i;
            }
        }
        throw new Error("Символ не знайдений у стовпці."); // Зміна наявної помилки
    }
    function trimming(string){
        let result = "";
        for (let i = 0; i < message.length; i++) {
            if (message[i] !== " ") {
                result += message[i];
            }
        }
        return result;
    }
    function createMatrix(ABC) {
        const size = ABC.length;
        const string1 = Array.from({ length: size }, (_, i) => Array.from({ length: size }, (_, j) => ABC[(i + j) % size]));
        return string1;
    }

    function vigenereCipherDecryption(message, key) {
        let result = '';
        const ABC = alphabet === "latin" ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ" : "АБВГДЕЄЖЗИІЇЙКЛМНОПРСТУФХЦЧШЩЬЮЯ";
        message = trimming(message);
        key = trimming(key);
        const string1 = createMatrix(ABC);

        for (let i = 0; i < message.length; i++) {
            const indexR = findCharInFirstRowOfMatrix(string1, key[i % key.length]);
            const indexC = findCharInColumnByRow(string1, message[i], indexR);
            result += string1[0][indexC];
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
