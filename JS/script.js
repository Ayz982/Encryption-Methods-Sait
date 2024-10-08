$(document).ready(function() {
    $('#search-input').on('input', function() {
        let searchValue = $(this).val().toLowerCase();
        let found = false;

        // Перебираємо всі пункти меню
        $('#menu li').each(function() {
            let menuItem = $(this).find('a').text().toLowerCase();
            
            // Якщо пункт меню відповідає введеному тексту, показуємо його
            if (menuItem.includes(searchValue)) {
                $(this).show();
                found = true;
            } else {
                $(this).hide();
            }
        });

        // Показуємо повідомлення "Нічого не знайдено", якщо немає результатів
        if (!found) {
            $('#search-message').removeClass('hidden');
        } else {
            $('#search-message').addClass('hidden');
        }
    });
});
$(document).ready(function() {
    // Функція для пошуку
    function searchMenu() {
        let searchValue = $('#search-input').val().toLowerCase();

        // Відправляємо запит до PHP-файлу
        $.ajax({
            url: 'search.php',
            type: 'GET',
            data: { q: searchValue },
            success: function(data) {
                let menu = $('#menu');
                menu.empty(); // Очищуємо старі пункти меню

                // Якщо результатів немає, показуємо повідомлення
                if (data.length === 0) {
                    $('#search-message').removeClass('hidden');
                } else {
                    $('#search-message').addClass('hidden');
                    // Додаємо нові результати
                    $.each(data, function(index, value) {
                        menu.append('<li><a href="#">' + value + '</a></li>');
                    });
                }
            }
        });
    }

    // Блокуємо стандартну дію форми і викликаємо пошук при натисканні "Enter"
    $('#search-form').on('submit', function(event) {
        event.preventDefault(); // Блокуємо перезавантаження сторінки
        searchMenu(); // Викликаємо пошук
    });

    // Викликаємо пошук під час введення в поле
    $('#search-input').on('input', function() {
        searchMenu();
    });
});

$('#header').prepend('<div id="menu-icon"><span class="first"></span><span class="second"></span><span class="third"></span></div>');
	
$("#menu-icon").on("click", function(){
$("nav").slideToggle();
$(this).toggleClass("active");
});
