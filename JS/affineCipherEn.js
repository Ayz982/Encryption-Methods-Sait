// Обробка події надсилання форми
document.getElementById('encryption-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const inputText = document.getElementById('plain-text').value;
    const a = parseInt(document.getElementById('a-value').value);
    const b = parseInt(document.getElementById('b-value').value);
    const alphabetType = document.getElementById('alphabet').value;

    try {
        const encryptedText = affineCipherEncryption(inputText, a, b, alphabetType);
        document.getElementById('encrypted-text').textContent = encryptedText;
        document.getElementById('result-box').style.display = 'block'; // Показати результати
    } catch (error) {
        alert(error.message); // Вивести повідомлення про помилку
    }
});

// Функція для шифрування афінною підстановкою
function affineCipherEncryption(plaintext, a, b, alphabetType) {
    plaintext = trimming(plaintext).toUpperCase();
    const alphabet = getAlphabet(alphabetType);
    const m = alphabet.length;

    // Перевірка, чи 'a' та 'm' є взаємно простими
    if (gcd(a, m) !== 1) {
        throw new Error("Число 'a' та довжина алфавіту не є взаємно простими. Шифрування неможливе.");
    }

    let result = '';

    for (let i = 0; i < plaintext.length; i++) {
        const char = plaintext[i];
        const index = alphabet.indexOf(char);

        if (index !== -1) { // Якщо символ належить алфавіту
            const encryptedChar = alphabet[(a * index + b) % m];
            result += encryptedChar;
        } else {
            result += char; // Якщо символ не належить алфавіту, додаємо його як є
        }
    }

    return result;
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
// Функція для обчислення НСД (алгоритм Евкліда)
function gcd(a, b) {
    while (b) {
        let temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

// Функція для видалення пробілів на початку та в кінці
function trimming(message) {
    return message.trim().replace(/\s+/g, ''); // Видаляємо пробіли
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
