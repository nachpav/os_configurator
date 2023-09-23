# Генератор таблиц конфигурации

## Как пользоваться?

Нужно запустить лайв сервер для папки `public`.

Можно использовать команду `npm run live`, тогда будет запущен 
сервер который будет обновлять страницу каждый раз когда будет меняться папка `public`.

Порядок работы такой:
- Запускаем лайв сервер.
- В файл config.json вставляем свой json конфиг, сохраняем файл.
- Далее получаем через сервер в браузере таблицу конфига.
- Если нужно чтото поменять то меняем в файле config.json и сохраняем.
- Лайв сервер обновляет странцу с таблицей конфига.

## Почему файл конфига остается на стороне сервера?
Потому что необходимо использовать схему и валидацию встроенную в редактор (например, vscode прекрасно работает со схемой).

