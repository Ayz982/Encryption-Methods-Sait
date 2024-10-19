// Обробка події надсилання форми дешифрування
document.getElementById('decryption-form').addEventListener('submit', function (event) {
    event.preventDefault(); // Зупинити стандартну поведінку форми

    const inputText = document.getElementById('plain-text').value;
    const a = parseInt(document.getElementById('a-value').value);
    const b = parseInt(document.getElementById('b-value').value);
    const alphabetType = document.getElementById('alphabet').value;

    try {
        const decryptedText = affineCipherDecryption(inputText, a, b, alphabetType);
        document.getElementById('decrypted-text').textContent = decryptedText;
        document.getElementById('result-box').style.display = 'block'; // Показати результати
    } catch (error) {
        alert(error.message); // Вивести повідомлення про помилку
    }
});

// Функція для дешифрування афінною підстановкою
function affineCipherDecryption(ciphertext, a, b, alphabetType) {
    ciphertext = trimming(ciphertext).toUpperCase();
    const alphabet = getAlphabet(alphabetType);
    const m = alphabet.length;

    // Перевірка, чи 'a' та 'm' є взаємно простими
    if (gcd(a, m) !== 1) {
        throw new Error("Число 'a' та довжина алфавіту не є взаємно простими. Дешифрування неможливе.");
    }

    // Знайти обернене значення 'a' модулем m
    const aInverse = modInverse(a, m);
    let result = '';

    for (let i = 0; i < ciphertext.length; i++) {
        const char = ciphertext[i];
        const index = alphabet.indexOf(char);

        if (index !== -1) { // Якщо символ належить алфавіту
            const decryptedChar = alphabet[(aInverse * (index - b + m)) % m];
            result += decryptedChar;
        } else {
            result += char; // Якщо символ не належить алфавіту, додаємо його як є
        }
    }

    return result;
}
// Функція для обчислення оберненого значення 'a' модулем m
function modInverse(a, m) {
    for (let x = 1; x < m; x++) {
        if ((a * x) % m === 1) {
            return x;
        }
    }
    throw new Error(`Обернене значення для 'a' не знайдено.`);
}

// Функція для обчислення НСД
function gcd(a, b) {
    while (b) {
        let temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

// Функція для видалення пробілів
function trimming(message) {
    return message.trim().replace(/\s+/g, ''); // Видаляємо пробіли
}
// Функція для отримання алфавіту
function getAlphabet(type) {
    const latinAlphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const cyrillicAlphabet = 'АБВГДЕЄЖЗИІЇЙКЛМНОПРСТУФХЦЧШЩЬЮЯ'.split('');

    if (type === 'latin') {
        return latinAlphabet;
    } else if (type === 'cyrillic') {
        return cyrillicAlphabet;
    } else {
        throw new Error("Неправильний вибір алфавіту.");
    }
}
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
