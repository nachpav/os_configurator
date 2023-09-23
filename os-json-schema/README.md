# Проект для создания схемы для конфигурации OS

### Ссылка на схему из github репозитория:
```
"$schema": "https://raw.githubusercontent.com/ssateam/os_configurator/main/os-json-schema/public/os.config.schema.json"
```
### Принцип создания схемы
Для создания схемы используется типы из typescript, описываем JSON в виде типов.

Далее используя утилиту `typescript-json-schema` транслируем файлы `ts` в
JSON схему.

Для построения схемы можно использовать специальные аннотации `@TJS` например `@TJS-minimum 1`.
Примеры https://github.com/YousefED/typescript-json-schema/tree/master/test/programs/annotation-tjs

Чтобы заново сгенерировать схему можно использовать скрипт `npm run build-schema`, результат будет записан в папку `../public`
