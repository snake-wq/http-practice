// --- Получение ссылок на HTML-элементы ---
// Находим кнопки на странице по их ID, чтобы позже повесить на них обработчики кликов
const btnGetPosts = document.getElementById('getPosts');
const btnGetPost5 = document.getElementById('getPost5');
const btnGetPostsUser1 = document.getElementById('getPostsUser1');
const btnGetCommentsPost3 = document.getElementById('getCommentsPost3');
const btnCreatePost = document.getElementById('createPost');
const btnUpdatePost5 = document.getElementById('updatePost5');
const btnPatchPost5 = document.getElementById('patchPost5');
const btnDeletePost5 = document.getElementById('deletePost5');
// Находим элемент <pre>, куда будем выводить результаты от сервера
const resultDiv = document.getElementById('result');

// --- Вспомогательная функция для вывода результата ---
/**
 * Выводит данные в элемент на странице.
 * @param {any} data - Данные для вывода (объект, массив, строка).
 */
function displayResult(data) {
    // JSON.stringify делает объект красивой строкой.
    // Второй аргумент null - без замены функций.
    // Третий аргумент 2 - добавляет отступы в 2 пробела для читаемости.
    resultDiv.textContent = JSON.stringify(data, null, 2);
}

// --- Универсальная функция для отправки запросов ---
/**
 * Отправляет асинхронный запрос на сервер.
 * @param {string} url - Адрес запроса.
 * @param {string} method - HTTP метод (GET, POST, PUT, PATCH, DELETE).
 * @param {object|null} body - Тело запроса (для POST/PUT/PATCH), иначе null.
 */
async function sendRequest(url, method = 'GET', body = null) {
    // Настраиваем объект параметров для fetch
    const options = {
        method: method, // Метод запроса
        headers: {
            'Content-Type': 'application/json' // Говорим серверу, что шлем JSON
        }
    };

    // Если есть тело запроса (для POST, PUT, PATCH), добавляем его в options
    if (body) {
        options.body = JSON.stringify(body); // Превращаем объект в JSON-строку
    }

    try {
        // Ждем ответа от сервера
        const response = await fetch(url, options);

        // Проверяем, успешен ли ответ (статус 200-299)
        if (!response.ok) {
            // Если нет, выбрасываем ошибку с текстом статуса
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Пытаемся распарсить ответ как JSON.
        // Для DELETE запроса тело ответа может быть пустым, поэтому проверяем.
        const text = await response.text();
        const data = text ? JSON.parse(text) : { message: 'Успешно удалено (пустой ответ)' };
        
        // Выводим данные на экран
        displayResult(data);
    } catch (error) {
        // Если произошла ошибка на любом этапе, выводим её в элемент result и в консоль
        resultDiv.textContent = `Ошибка: ${error.message}`;
        console.error('Fetch error:', error);
    }
}

// --- Привязка функций к кнопкам ---
// При клике на кнопку вызываем sendRequest с нужными параметрами

// GET все посты
btnGetPosts.addEventListener('click', () => {
    sendRequest('https://jsonplaceholder.typicode.com/posts');
});

// GET один пост с ID 5
btnGetPost5.addEventListener('click', () => {
    sendRequest('https://jsonplaceholder.typicode.com/posts/5');
});

// GET посты пользователя с ID 1 (используем query-параметр userId)
btnGetPostsUser1.addEventListener('click', () => {
    sendRequest('https://jsonplaceholder.typicode.com/posts?userId=1');
});

// GET комментарии к посту с ID 3
btnGetCommentsPost3.addEventListener('click', () => {
    sendRequest('https://jsonplaceholder.typicode.com/posts/3/comments');
});

// POST (создание) нового поста
btnCreatePost.addEventListener('click', () => {
    const newPost = {
        title: 'Новый пост из браузера',
        body: 'Текст нового поста',
        userId: 1
    };
    sendRequest('https://jsonplaceholder.typicode.com/posts', 'POST', newPost);
});

// PUT (полное обновление) поста с ID 5
btnUpdatePost5.addEventListener('click', () => {
    const updatedPost = {
        id: 5,
        title: 'Обновленный пост (PUT)',
        body: 'Новое содержимое',
        userId: 1
    };
    sendRequest('https://jsonplaceholder.typicode.com/posts/5', 'PUT', updatedPost);
});

// PATCH (частичное обновление) поста с ID 5 - меняем только заголовок
btnPatchPost5.addEventListener('click', () => {
    const patchData = {
        title: 'Измененный заголовок (PATCH)' // Отправляем только поле title
    };
    sendRequest('https://jsonplaceholder.typicode.com/posts/5', 'PATCH', patchData);
});

// DELETE (удаление) поста с ID 5
btnDeletePost5.addEventListener('click', () => {
    sendRequest('https://jsonplaceholder.typicode.com/posts/5', 'DELETE');
});
