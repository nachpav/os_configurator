import { IOSConfigRoleBasic } from "../interfaces_os-config";

/**
* Internal SIP Gate (sg)
* ```
* Точка входа в кластер по SIP для внутренних устройств, определяемых учетными записями SIP-пользователей.
* ```
* https://dev01.oktell.ru/docs/r/develop/configuration/roles/sg.html
*/
export interface IOSConfigRoleSg extends IOSConfigRoleBasic {
  /** 
   *```
   * Тип функциональной роли. Возможные значения: "sg". 
   *```
   */
  roletype: "sg"

  /** 
   *```
   * Алиас сетевого интерфейса сервера, на котором будет происходить внутреннее взаимодействие функциональных ролей между собой. 
   *```
   */
  iface: string

  /** 
   *```
   * Идентификатор функциональной роли.
   * Уникален для всей системы, независимо от сайта или сервера. Не подлежит изменению.
   * Целое число от 1 до 9999. 
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
   */
  separate: boolean

  /** 
   *```
   * Локальный порт TCP для SIP (1 - 65535). Если указано значение, отличное от UDP, то будет поднят дополнительно.
   * Например: 5060 
   *```
   *  @TJS-integer
   */
  tcp: number

  /** 
   *```
   * Локальный порт UDP для SIP (1 - 65535). Этот же порт одновременно обрабатывает и TCP.
   * Например: 5060 
   *```
   *  @TJS-integer
   */
  udp: number

  /** 
   *```
   * Локальный порт TLS для SIP (1 - 65535). По умолчанию не открывается.
   * Например: 5061 
   *```
   * default: empty
   */
  tls?: number

  /** 
   *```
   * Локальный порт WebSocketSecure для SIP (1 - 65535). По умолчанию не открывается.
   * Например: 5063 
   *```
   * default: empty
   */
  wss?: number

  /** 
   *```
   * Выключатель логирования SIP-протокола в лог trn. 
   *```
   * default: true
   */
  trn?: boolean

  /** 
   *```
   * По умолчанию при инициации звонков на адреса, подключенные по TLS, отправляется SDP-offer для нешифрованного медиа потока (rtp). С помощью параметра можно для TLS адресов включить режим инициации отправки SDP-offerа с шифрованным медиа-потоком.
   * Применяется только для звонков, использующих пограничный медиагейт. 
   *```
   * default: false
   */
  use_srtp?: boolean

  /** 
   *```
   * Алиас каталога на сервере для хранения сертификатов (файлы server.crt и server.key), в случае необходимости указания цепочки сертификатов до центра сертификации (CA - Certification Authority) его необходимо разместить в конце файла сертификата.
   * Если путь не указан, то поиск сертификатов осуществляется в каталоге "/usr/lib/rostell/rostell_sip/priv/ssl" 
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
   * Список алгоритмов шифрования, используются при установке tls соединения. Необходимо указывать RFC или openssl имена алгоритмов. При указании * будут выбраны все доступные алгоритмы.
   * По умолчанию используется default - список актуальных алгоритмов шифрования для протоколов tlsv1.1, tlsv1.2, tlsv1.3.
   * Например:
   * ["*"]
   * [<<"TLS_RSA_WITH_AES_256_GCM_SHA384">>, <<"AES256-GCM-SHA384">>] 
   *```
   * default: default
   */
  tls_ciphers?: string[]

  /** 
   *```
   * Список применяемых аудио кодеков. В качестве значения - список, содержащий имена кодеков в формате "Name/Freq". 
   *```
   * default: "G729/8000"
   */
  payloads_audio_offer?: string[]

  /** 
   *```
   * Список используемых для инициации звонка имен видеокодеков case-sensitive. 
   *```
   * default: empty
   */
  payloads_video_offer?: string[]

  /** 
   *```
   * Выключатель транскодинга видео.
   * Применяется при использовании bgmg.
   * false – все видео-кодеки из SDP INVITE-запроса, полученного от инициатора, транслируются без изменений в SDP INVITE-запросов на вызываемые устройства. В этом случае система не применяет ни свои знания о кодеках, ни транскодинг, икодек неизвестен системе, то прямая трансляция тем не менее остается возможной.
   * true – все видео-кодеки приводятся в соответствии с известными системе видео-кодеками, система предлагает вызываемой стороне все известные ей кодеки (с фильтром из payloads_video_offer), и при несовпадении выбранных устройствами кодеков осуществляется транскодинг на видео-стриме. 
   *```
   * default: false
   */
  use_video_transcoding?: boolean

  /** 
   *```
   * Алиасы сетевых интерфейсов для применения bgmg.
   * Распределение алиасов по сетевым интерфейсам обязано совпадать с аналогичным распределением у функциональной роли bgmg.
   * Формат:
   * {"key":"Alias", "value":"Interface"}
   * Достижимость конечных адресов через сетевые интерфейсы, чьи адреса принадлежат разным алиасам, означает необходимость применения медиа-шлюза, управляемого функциональной ролью bgmg.
   * Здесь должны быть указаны адреса всех сетевых интерфейсов IPv4 (исключая loopback), которые могут быть определены системой как наилучшие для достижения удаленных адресов. 
   *```
   * default: empty
   */
  aliases?: { key: string, value: string }[]

  /** 
   *```
   * Маппинги SIP ALG для применения в SDP и заголовках на исходящих запросах INVITE и ответах OK, а также обратно на входящих
   * сообщениях ACK и BYE.
   * Формат:
   * {"key":"IpAddr1", "value":"IpAddr2"}
   * Ключом выступает IP-адрес подлежащий подмене, а значением - IP-адрес, на который будет подменяться адрес в исходящем SDP.
   * IP-адрес подлежащий подмене должен совпадать с адресом на сервере с функциональной ролью MG/BGMG.
   * IP-адрес на который будет подменяться может быть любым и обычно не принадлежит серверу. 
   *```
   * default: empty
   */
  sipalg?: { key: string, value: string }[]

  /** 
   *```
   * Выключатель применения медиа-шлюза функциональной ролью b2b для звонков, перенаправляемых текущим экземпляром функциональной роли sg. 
   *```
   * default: true
   */
  b2bmedia?: boolean

  /** 
   *```
   * Максимальный размер udp пакета, отправляемый системой, в байтах.
   * Минимальное значение: 1500.
   * (Реализовано в задаче #182).
   * При превышении отправляемым пакетом установленного размера происходит автоматическая отправка через TCP.
   * При превышении отправляемым пакетом размера 1500 но до установленного в поле значения, происходит автоматическое разбиение пакета на фреймы и сборка их при получении на нижнем сетевом уровне.
   * Не все устройства поддерживают такой режим. В то же время не все устройства держат TCP открытым. 
   *```
   * default: 1500
   *  @TJS-minimum 1500
   */
  max_udp_size?: number

  /** 
   *```
   * Выключатель режима отправки запросов NOTIFY для перерегистрации UA при падении экземпляра функциональной роли sg, обслуживающего устройство.
   * true – при обнаружении внезапной недоступности экземпляра функциональной роли sg, другие экземпляры функциональной роли осуществляют отправку запроса NOTIFY со специальным содержимым, призванным инициировать перезапуск операции регистрации на устройстве.
   * Применяется в случае, если устройства поддерживают указание нескольких адресов Outbound-proxy и обработку этого NOTIFY. 
   *```
   * default: false
   */
  reregister?: boolean

  /** 
   *```
   * Выключатель режима автоматического транслита DisplayName в запросах, перенаправляемых в сторону от системы к подключенным устройствам. 
   *```
   * default: false
   */
  translit?: boolean

  /** 
   *```
   * Подстановка доменов вместо ip-адресов в заголовки To и From SIP-пакетов.
   * Применяется при работе с телефонами, которые не могут подставлять символьные доменные имена.
   * При активации режима микросервис SG подменяет пакеты при пересылке в обе стороны следующим образом:
   * * Принимаемые от устройств пакеты, содержащие IP-адрес сервера в качестве имени домена в заголовках To и From, подменяют IP-адрес в этих заголовках на сопоставленный ему домен.
   * * Отправляемые устройствам пакеты, содержащие в заголовках To и From один из доменов, указанных в опции, подменяют домен в этих заголовках на сопоставленный ему IP-адрес.
   * Формат:
   * [{"addr":"IpAddr", "domain":"DOMAIN"}, ...] 
   *```
   * default: empty
   */
  substitute_domains?: { key: string, value: string }[]

}