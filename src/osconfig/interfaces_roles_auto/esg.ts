import { IOSConfigRoleBasic } from "../interfaces_os-config";

/**
* External SIP Gate (esg)
* ```
* Точка доступа в кластер по SIP для внешних устройств – провайдеров телефонии, шлюзов и вышестоящими и одноранговыми АТС, находящихся во внешнем номерном плане, не управляемом системой. Вся работа происходит на основе учетных записей SIP-провайдеров. Для стыковки внутреннего номерного плана с одноранговыми и вышестоящими АТС и провайдерами применяются правила преобразования CallerId и CalledId (provider_callerid).
* ```
* https://dev01.oktell.ru/docs/r/develop/configuration/roles/esg.html
*/
export interface IOSConfigRoleEsg extends IOSConfigRoleBasic {
  /** 
   *```
   * Тип функциональной роли. Возможные значения: "esg". 
   *```
   */
  roletype: "esg"

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
   * Локальный порт UDP для SIP. Этот же порт одновременно обрабатывает и TCP.
   * Например: 5080 
   *```
   *  @TJS-integer
   */
  udp: number

  /** 
   *```
   * Локальный порт TCP для SIP. Если указано значение, отличное от UDP, то будет поднят дополнительно.
   * Например: 5080 
   *```
   *  @TJS-integer
   */
  tcp: number

  /** 
   *```
   * Локальный порт для соединений по tls. По умолчанию не открывается.
   * Например: 5081 
   *```
   * default: empty
   */
  tls?: number

  /** 
   *```
   * Локальный порт для соединений по wss. По умолчанию не открывается.
   * Например: 5083 
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
   * Применяется только для звонков, использующих пограничный медиагейт (media=1). 
   *```
   * default: false
   */
  use_srtp?: boolean

  /** 
   *```
   * Алиас каталога на сервере для хранения сертификатов (файлы server.crt и server.key).
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
   * Список применяемых аудио кодеков.
   * В качестве значения список, содержащий имена кодеков в формате "Name/Freq".
   * Поддерживаются: PCMU/8000, GSM/8000, PCMA/8000, G722/8000, CN/8000, G729/8000, speex/8000, speex/16000, speex/32000, telephone-event/8000, G726-16/8000, G726-24/8000, G726-32/8000, G726-40/8000, iLBC/8000, opus/48000/2. 
   *```
   * default: ["PCMA/8000", "PCMU/8000", "G729/8000", "telephone-event/8000"]
   */
  payloads_audio_offer?: string[]

  /** 
   *```
   * Список используемых для инициации звонка имен видеокодеков case-sensitive.
   * Поддерживаются: H263/90000, H263-1998/90000, H264/90000, VP8/90000, VP9/90000. 
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
  sipalg?: { "key": string, "value": string }

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
   * Выключатель применения медиа-шлюза функциональной ролью b2b для звонков, инициированных текущим экземпляром функциональной роли esg. 
   *```
   * default: true
   */
  b2bmedia?: boolean

  /** 
   *```
   * Список IP-адресов текущего сервера.
   * Применяется в одном из алгоритмов поиска учетной записи провайдера при получении INVITE-запросов извне, допуская указание в качестве домена в заголовке "To" одного из перечисленных в списке адресов.
   * Обычно необходимости в использовании этого поля не возникает, поскольку имеется возможность указать необходимое значение в настройках учетной записи провайдера.
   * Тем не менее в целях оптимизации и снятия потребности указывать в большом количестве учетных записей провайдеров одних и тех же значений, они могут быть указаны в опции функциональной роли esg. 
   *```
   * default: empty
   */
  extaddrs?: string[]

  /** 
   *```
   * Список внешних STUN-серверов для определения внешнего IP-адреса сервера при работе за NAT.
   * Применяется в одном из алгоритмов поиска учетной записи провайдера при получении INVITE-запросов извне, допуская указание в качестве домена в заголовке "To" внешнего адреса NAT. 
   *```
   * default: empty
   */
  stunserver?: string[]
}