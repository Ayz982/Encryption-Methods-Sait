document.getElementById('decryption-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const cipherText = document.getElementById('cipher-text').value;
    const keyword = document.getElementById('keyword').value;
    const shift = parseInt(document.getElementById('shift').value);
    const alphabetType = document.getElementById('alphabet').value;

    try {
        const decryptedText = caesarCipherKeywordDecryption(cipherText, keyword, shift, alphabetType);
        document.getElementById('decrypted-text').textContent = decryptedText;
        document.getElementById('result-box').style.display = 'block'; // Показати результат
    } catch (error) {
        alert(error.message); // Вивести повідомлення про помилку
    }
});

// Функція дешифрування за допомогою шифру Цезаря з ключовим словом
function caesarCipherKeywordDecryption(ciphertext, key, k, alphabetType) {
    ciphertext = trimming(ciphertext).toUpperCase();
    key = removeDuplicateCharsFromKey(key.toUpperCase());
    
    const alphabet = getAlphabet(alphabetType);
    const sizeABC = alphabet.length;

    // Формування алфавіту без ключових символів
    const ABC2 = alphabet.filter(char => !key.includes(char));

    // Створення дешифрувального алфавіту
    const ABCDecryption = new Array(sizeABC);
    let index = 0, pos1 = k + key.length;
    for (let i = k; i < pos1; i++) {
        ABCDecryption[i % sizeABC] = key[index++];
    }
    let indexChar = 0;
    while (pos1 % sizeABC !== k) {
        ABCDecryption[pos1 % sizeABC] = ABC2[indexChar++];
        pos1++;
    }

    // Дешифрування
    let result = '';
    for (let i = 0; i < ciphertext.length; i++) {
        const index = ABCDecryption.indexOf(ciphertext[i]);
        if (index !== -1) {
            result += alphabet[index];  // Отримуємо символ з оригінального алфавіту
        } else {
            result += ciphertext[i];  // Якщо символ не в алфавіті, залишаємо його як є
        }
    }

    return result;
}

// Функція для отримання обраного алфавіту
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

// Функція для видалення пробілів
function trimming(message) {
    return message.trim().replace(/\s+/g, '');
}

// Функція для видалення повторюваних символів у ключі
function removeDuplicateCharsFromKey(key) {
    return [...new Set(key)].join('');
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
