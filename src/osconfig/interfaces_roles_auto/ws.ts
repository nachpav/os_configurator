import { IOSConfigRoleBasic } from "../interfaces_os-config";

/**
* Web Server (ws)
* ```
* Предоставляет доступ к API системы через HTTP и WebSocket, а также обслуживает выдачу статических файлов системных и ролевых веб-приложений. Для доступа к API проводит авторизацию и работает с HTTP-сессиями через выставление и использование Cookie. Для некоторых endpoint’ов доступна авторизация по токену с использованием заголовка `Authorization: Bearer <intergation_point.token_local>`.
* ```
* https://dev01.oktell.ru/docs/r/develop/configuration/roles/ws.html
*/
export interface IOSConfigRoleWs extends IOSConfigRoleBasic {
  /** 
   *```
   * Тип функциональной роли. Возможные значения: "ws". 
   *```
   */
  roletype: "ws"

  /** 
   *```
   * Алиас сетевого интерфейса сервера, на котором будет происходить внутреннее взаимодействие функциональных ролей между собой. 
   *```
   */
  iface: string

  /** 
   *```
   * Идентификатор функциональной роли.
   * Уникален для всей системы, независимо от сайта или сервера. Нельзя изменить после присвоения. Целое число от 1 до 9999 
   *```
   *  @TJS-minimum 1
   *  @TJS-maximum 9999
   *  @TJS-uniqueItems
   *  @TJS-integer
   */
  roleid: number

  /** 
   *```
   * Признак выделения функциональной роли в отдельную ноду. 
   *```
   * default: false
   */
  separate?: boolean

  /** 
   *```
   * Алиас каталога на сервере для хранения файлов autoprovision. 
   *```
   * default: empty
   */
  apdir?: string

  /** 
   *```
   * Алиас каталога на сервере для хранения сертификатов (файлы server.crt и server.key), в случае необходимости указания цепочки сертификатов до центра сертификации (CA - Certification Authority) его необходимо разместить в конце файла сертификата.
   * Если путь не указан, то поиск сертификатов осуществляется в каталоге "/usr/lib/rostell/rostell_ws/priv/ssl" 
   *```
   * default: empty
   */
  certdir?: string

  /** 
   *```
   * Пароль для расшифровки файла секретного ключа сертификата. 
   *```
   * default: empty
   */
  keypass?: string

  /** 
   *```
   * Локальный порт веб-сервера для открытых TCP подключений. 
   *```
   * default: 80
   */
  httpport?: number

  /** 
   *```
   * Локальный порт веб-сервера для TLS поключений. 
   *```
   * default: 443
   */
  httpsport?: number

  /** 
   *```
   * Режим работы портов.
   * Возможные значения:
   * "both" – http и https порты открыты;
   * "http-only" – открыт только http порт;
   * "https-only" – открыт только https порт;
   * "http+redir" – http и https порты открыты, но https работает в режиме перенаправления на http;
   * "https+redir" – http и https порты открыты, но http работает в режиме перенаправления на https. 
   *```
   * default: "both"
   */
  ports_mode?: string

  /** 
   *```
   * Режим обслуживания запросов
   * "both" – обе части работают (и API, и статика (системные и ролевые веб-приложения));
   * "api-only" – работает только api;
   * "static-only" – работает только статика. 
   *```
   * default: empty
   */
  service_mode?: string

  /** 
   *```
   * Уровень логирования сообщений протокола websocket.
   * По умолчанию: 0.
   * Возможные значения:
   * 0 – не логирует;
   * 1 – логирует старты стопы подключений;
   * 2 – логирует простые ошибки;
   * 3 – логирует ошибки с упоминанием тела ошибочного сообщения;
   * 4 – логирует факт всех входящих и исходящих сообщений;
   * 5 – логирует все входящие и исходящие сообщения, отрезая первые 1024 байта;
   * 6 – логирует полностью все входящие и исходящие сообщения. 
   *```
   * default: 0
   */
  websock_debug_level?: number

  /** 
   *```
   * Алиас каталога на сервере со статическими ресурсами web-сервера.
   * По умолчанию: "/usr/lib/rostell/rostell_ws/priv/www" 
   *```
   * default: empty
   */
  wwwdir?: string

}