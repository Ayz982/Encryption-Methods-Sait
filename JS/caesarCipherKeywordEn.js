// Обробка події надсилання форми
document.getElementById('caesar-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const inputText = document.getElementById('message').value;
    const key = document.getElementById('key').value.trim().toUpperCase();
    const shift = parseInt(document.getElementById('shift').value);
    const alphabetType = document.getElementById('alphabet').value;

    try {
        const encryptedText = caesarCipherWithKeyword(inputText, key, shift, alphabetType);
        document.getElementById('encrypted-text').textContent = encryptedText;
        document.getElementById('result-box').style.display = 'block'; // Показати результат
    } catch (error) {
        alert(error.message); // Вивести повідомлення про помилку
    }
});

// Функція для шифрування Цезарем із ключовим словом
function caesarCipherWithKeyword(message, key, shift, alphabetType) {
    message = trimming(message).toUpperCase();
    key = removeDuplicateCharsFromKey(key);
    const alphabet = getAlphabet(alphabetType);
    const alphabetLength = alphabet.length;

    // Створення стандартного алфавіту
    const ABC = alphabet.slice();

    // Створення другого алфавіту (без символів ключа)
    const ABC2 = ABC.filter(char => !key.includes(char));

    // Створення шифрувального алфавіту
    const ABCEncryption = [];
    let index = 0, pos1 = shift + key.length;

    // Додаємо символи ключа до шифрувального алфавіту
    for (let i = shift; i < pos1; i++) {
        ABCEncryption[i % alphabetLength] = key[index++];
    }

    // Додаємо символи з ABC2 до шифрувального алфавіту
    let indexChar = 0;
    while (pos1 % alphabetLength !== shift) {
        ABCEncryption[pos1 % alphabetLength] = ABC2[indexChar];
        indexChar++;
        pos1++;
    }

    // Шифрування повідомлення
    let result = '';
    for (let i = 0; i < message.length; i++) {
        const charIndex = ABC.indexOf(message[i]);
        if (charIndex !== -1) {
            result += ABCEncryption[charIndex];
        } else {
            result += message[i]; // Якщо символ не з алфавіту, залишаємо його
        }
    }

    return result;
}

// Функція для видалення дублікатів символів з ключа
function removeDuplicateCharsFromKey(key) {
    return [...new Set(key)].join('');
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
