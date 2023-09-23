import {
  IOSConfigRoleAgatsg, IOSConfigRoleB2b, IOSConfigRoleBgmg, IOSConfigRoleCallstore, IOSConfigRoleCdr,
  IOSConfigRoleConf, IOSConfigRoleDbproc, IOSConfigRoleDomstore, IOSConfigRoleEsg, IOSConfigRoleHuntq,
  IOSConfigRoleIc, IOSConfigRoleIvr, IOSConfigRoleJrnl, IOSConfigRoleLogstore, IOSConfigRoleMdc, IOSConfigRoleMg,
  IOSConfigRoleMgc, IOSConfigRoleMic, IOSConfigRoleMix, IOSConfigRoleMware, IOSConfigRoleRecmover,
  IOSConfigRoleRedirect, IOSConfigRoleRepg, IOSConfigRoleRot, IOSConfigRoleRpci, IOSConfigRoleRpco,
  IOSConfigRoleRsv, IOSConfigRoleScr, IOSConfigRoleSdc, IOSConfigRoleSel, IOSConfigRoleSess,
  IOSConfigRoleSg, IOSConfigRoleSq, IOSConfigRoleSr, IOSConfigRoleSt, IOSConfigRoleSts, IOSConfigRoleUsr,
  IOSConfigRoleVmail, IOSConfigRoleWs, IOSConfigRoleWssubscr
} from "./interfaces_roles_auto/index"

/**
 * Алиасы – короткие уникальные имена для емких значений, кратно применяемых при настройке различных элементов конфигурации (серверов, функциональных ролей).
 * 
 * https://dev01.oktell.ru/docs/r/develop/configuration/categories/aliases.html#subtable_1
 */
interface IOSConfigAlias {
  /*** Псевдоним*/
  alias: string
  /**Значение */
  value: string
}

interface IOSConfigAliases {
  /**
   * Список алиасов путей к файлам и каталогам.
   * {@link https://dev01.oktell.ru/docs/r/develop/configuration/categories/aliases.html#subtable_1 | Формат элемента списка}
   * 
   * default []
   */
  paths: IOSConfigAlias[]
  /**
   * Список алиасов строк подключения к серверам БД (PostgreSQL).
   * {@link https://dev01.oktell.ru/docs/r/develop/configuration/categories/aliases.html#subtable_1 | Формат элемента списка.}
   * 
   * default []
   */
  pgdb_strings: IOSConfigAlias[]
}

interface IOSConfigDomain {
  /**
   * Описание домена
   */
  descr?: string
  /**
   * Полное имя домена (Fully Qualified Domain Name)
   */
  fqdn: string
  /**
   * Строка, может состоять из латинских букв и цифр (допускается нижнее подчеркивание), начинаться должно с буквы.
   * Используется в других разделах конфигурации при указании на домены.
   */
  name: string
}

/**
 * Конфигурация (configuration)
 * Структура, объединяющая слои инфраструктуры, логики и данных между собой. На основе активной конфигурации строится и работает весь кластер развернутой системы «R».
 * https://dev01.oktell.ru/docs/r/develop/entities/master/configuration.html
 */
export interface IOSConfig {
  /**Техническое поле*/
  $schema: string
  /**
   * 
   * https://dev01.oktell.ru/docs/r/develop/configuration/index.html
   */
  content: {
    /**
     * Алиасы – короткие уникальные имена для емких значений, кратно применяемых при настройке различных элементов конфигурации (серверов, функциональных ролей).
     * 
     * https://dev01.oktell.ru/docs/r/develop/configuration/categories/aliases.html
     */
    aliases: IOSConfigAliases
    /**
     * Список доменов, являющихся ключевыми разветвителями дерева доменов в распределении по сайтам и группам функциональных ролей.
     * 
     * https://dev01.oktell.ru/docs/r/develop/configuration/categories/domains.html
     */
    domains: IOSConfigDomain[]
    /**
     * Раздел содержит список всех сайтов текущей конфигурации и их параметров. Серверы к параметрам не относятся. Привязка серверов к сайтам осуществляется в разделе structure.
     * 
     * https://dev01.oktell.ru/docs/r/develop/configuration/categories/sites.html
     */
    sites: IOSConfigSite[]
    /**
     * Раздел содержит список всех серверов текущей конфигурации и их параметров. Функциональные роли к параметрам не относятся. Привязка серверов к сайтам и функциональных ролей к серверам происходит в разделе structure.
     * 
     * https://dev01.oktell.ru/docs/r/develop/configuration/categories/servers.html
     */
    servers: IOSConfigServer[]
    /**
     * Список функциональных ролей.
     * Раздел содержит список всех экземпляров функциональных ролей и их параметров (типы функциональных ролей).
     * Привязка функциональных ролей к серверам происходит в разделе structure.
     * 
     * https://dev01.oktell.ru/docs/r/develop/configuration/categories/roles.html
     */
    roles: IOSConfigRole[]
    /**
     * JSON-структура, объединяющая сайты, серверы и функциональные роли в одну конфигурацию.
     * 
     *  Представляет собой список сайтов, каждый содержит список серверов, каждый содержит список функциональных ролей. Один сервер может принадлежать только одному сайту, один экземпляр функциональной роли может принадлежать только одному серверу.
     * 
     * https://dev01.oktell.ru/docs/r/develop/configuration/categories/structure.html
     */
    structure: IOSConfigStructure[]
    /**
     * Общие параметры конфигурации, не относящиеся к другим разделам.
     * 
     * https://dev01.oktell.ru/docs/r/develop/configuration/categories/general.html
     */
    general: IOSConfigGeneral

  },
  /**
   * Имя конфигурации
   */
  name: string,
  /**
   * Дополнительные свойства конфигурации
   */
  opts: {
    comment: string,
    title: string
  }
}

/**Конфигурация ролей*/
export interface IOSConfigRoleBasic {
  /**
   * Имя. Может состоять из латинских букв и цифр, должно начинаться с буквы.
   */
  name: string
  /**
   * Тип функциональной роли
   */
  roletype: string
}

type IOSConfigRoleMap = {
  IOSConfigRoleAgatsg: IOSConfigRoleAgatsg
  IOSConfigRoleB2bua: IOSConfigRoleB2b
  IOSConfigRoleBgmg: IOSConfigRoleBgmg
  IOSConfigRoleCallstore: IOSConfigRoleCallstore
  IOSConfigRoleCdr: IOSConfigRoleCdr
  IOSConfigRoleConf: IOSConfigRoleConf
  IOSConfigRoleDbproc: IOSConfigRoleDbproc
  IOSConfigRoleDomstore: IOSConfigRoleDomstore
  IOSConfigRoleEsg: IOSConfigRoleEsg
  IOSConfigRoleHuntq: IOSConfigRoleHuntq
  IOSConfigRoleIc: IOSConfigRoleIc
  IOSConfigRoleIvr: IOSConfigRoleIvr
  IOSConfigRoleJrnl: IOSConfigRoleJrnl
  IOSConfigRoleLogstore: IOSConfigRoleLogstore
  IOSConfigRoleMdc: IOSConfigRoleMdc
  IOSConfigRoleMg: IOSConfigRoleMg
  IOSConfigRoleMgc: IOSConfigRoleMgc
  IOSConfigRoleMic: IOSConfigRoleMic
  IOSConfigRoleMix: IOSConfigRoleMix
  IOSConfigRoleMware: IOSConfigRoleMware
  IOSConfigRoleRecmover: IOSConfigRoleRecmover
  IOSConfigRoleRedirect: IOSConfigRoleRedirect
  IOSConfigRoleRepg: IOSConfigRoleRepg
  IOSConfigRoleRot: IOSConfigRoleRot
  IOSConfigRoleRpci: IOSConfigRoleRpci
  IOSConfigRoleRpco: IOSConfigRoleRpco
  IOSConfigRoleRsv: IOSConfigRoleRsv
  IOSConfigRoleScr: IOSConfigRoleScr
  IOSConfigRoleSdc: IOSConfigRoleSdc
  IOSConfigRoleSel: IOSConfigRoleSel
  IOSConfigRoleSess: IOSConfigRoleSess
  IOSConfigRoleSg: IOSConfigRoleSg
  IOSConfigRoleSq: IOSConfigRoleSq
  IOSConfigRoleSr: IOSConfigRoleSr
  IOSConfigRoleSt: IOSConfigRoleSt
  IOSConfigRoleSts: IOSConfigRoleSts
  IOSConfigRoleUsr: IOSConfigRoleUsr
  IOSConfigRoleVmail: IOSConfigRoleVmail
  IOSConfigRoleWs: IOSConfigRoleWs
  IOSConfigRoleWssubscr: IOSConfigRoleWssubscr

};

export type IOSConfigRole = IOSConfigRoleMap[keyof IOSConfigRoleMap];

/**
 * Раздел servers
 * 
 * Раздел содержит список всех серверов текущей конфигурации и их параметров. Функциональные роли к параметрам не относятся. Привязка серверов к сайтам и функциональных ролей к серверам происходит в разделе structure.
 * 
 * https://dev01.oktell.ru/docs/r/develop/configuration/categories/servers.html
 * 
 */
interface IOSConfigServer {
  /**
   * Название сайта, указываемое при настройках других элементов конфигурации.
   * Cтрока, может состоять из латинских букв и цифр, начинаться должно с буквы.
   *
   * Рекомендуются короткие говорящие значения.
   */
  name: string

  /**
   * Алиас интерфейса на сервере, на котором поднимается нода servershell – центральная нода сервера.
   * 
   * default eth0
   */
  logiface: string

  /**
   * ```
   * Сетевые интерфейсы IPv4, доступные на сервере.
   * 
   * [ { "Key":"IPv4_Address", …​ }, ... ]
   * ---
   * , где
   * Key – алиас интерфейса, используемый для указания интерфейсов при настройке функциональных ролей;
   * IPv4_Address - IPv4 адрес интерфейса. Адреса должны присутствовать на сервере.
   * ```
   */
  ifaces: { [key: string]: string }[]

  /**
   * Описание сервера.
   * По умолчанию значение не задано.
   */
  descr?: string

  /**
   * Период снятия данных о работе системы и генерации событий класса perfmonevents, в секундах.
   * 
   * default 30
   */
  perfmon_tick?: number

  /**
   * Порт для взаимодействия нод виртуальной машины erlang между собой.
   * Должен быть одинаковым у всех серверов конфигурации.
   * 
   * default 4369
   */
  erlangtcp?: number

  /**
   * Интерфейс приложения syncthing в рамках функциональной роли fsync, на котором поднимается порт для взаимодействия с другими экземплярами приложения syncthing в системе.
   * По умолчанию: интерфейс ноды.
   */
  fsync_iface_device?: string

  /**
   * Интерфейс приложения syncthing в рамках функциональной роли fsync, на котором поднимается порт для доступа в Web-GUI.
   * 
   * default '127.0.0.1'
   */
  fsync_iface_gui?: string

  /**
   * Диапазон портов, которые будут использоваться для ролевых нод.
   * Формат: PortFrom:PortCnt, где PortFrom – начальное значение порта, PortCnt – количество портов.
   * 
   * default 9310:90
   */
  nodesportrange?: string

  /**
   * Путь до каталога globalshare на сервере.
   * В случае, если параметр не указан, то фактически будет использоваться указанный путь по умолчанию на диске.
   * 
   * default "/var/lib/rostell/files/globalshare"
   */
  globalsharepath?: string

  /**
   * Путь до каталога siteshare на сервере.
   * В случае, если параметр не указан, то фактически будет использоваться указанный путь по умолчанию на диске.
   * default "/var/lib/rostell/files/siteshare"
   */
  sitesharepath?: string

  /**
   * Путь до каталога local на сервере.
   * В случае, если параметр не указан, то фактически будет использоваться указанный путь по умолчанию на диске.
   * 
   * default "/var/lib/rostell/files/local"
   */
  localpath?: string

  /**
   * Путь до каталога :SYNC на сервере (синхронизируется функциональной ролью fsync и приложением syncthing).
   * В случае, если параметр не указан, то фактически будет использоваться указанный путь по умолчанию на диске.
   * 
   * default "/var/lib/rostell/files/syncroot"
   */
  syncrootpath?: string

  /**
   * ```
   * Перечисление каталогов для хранения записей разговоров на текущем сервере.
   * [ { "Key":"AbsPath", …​ }, …​ ]
   * ---
   * , где
   * - Key – ключ, используемый для указания путей на сервере при настройке функциональных ролей;
   * - AbsPath – абсолютный путь на сервере к каталогу или его алиас (например, alias://paths/c).
   * ```
   * 
   * default []
   */
  recstorepath?: { [key: string]: string }[]

  /**
   * Произвольная строка, обозначающая принадлежность сервера к указанному шасси АГАТ-РТ.
   */
  agat_chassis?: string

  /**
   * Произвольная строка, имеющая смысл для администратора агат-оборудования. Будет использоваться при настройке линейных модулей для указания primary/secondary CPU, чтобы не ссылаться на имя сервера.
   */
  agat_cpu?: string
}

/**
 * Раздел sites
 * 
 * Список сайтов.
 * 
 * Раздел содержит список всех сайтов текущей конфигурации и их параметров. Серверы к параметрам не относятся. Привязка серверов к сайтам осуществляется в разделе structure.
 * 
 * https://dev01.oktell.ru/docs/r/develop/configuration/categories/sites.html
 */
export interface IOSConfigSite {
  /**
   * Cтрока, может состоять из латинских букв и цифр, начинаться должно с буквы
   */
  name: string
  /**
   * ```
   * Тип сайта.
   * Возможные варианты:
   * 
   * - master – мастер сайт.
   * - communication – рабочий сайт с полным функционалом.
   * - master_communication – мастер сайт с полным функционалом.
   * ```
   */
  sitetype: 'master' | 'communication' | 'master_communication'
  /**
   * Список обслуживаемых на сайте доменов. Указываются через имена, а не через fqdn.
   * Сайт также обслуживает все домены из дочерних деревьев указанных в свойстве доменов.
   * Один домен может обслуживаться на нескольких сайтах.
   * 
   * Если какой-либо домен указан на сайте А, и не указан на сайте Б, при этом на сайте Б указан один из его родительских доменов, то этот домен и домены из его дочернего дерева обслуживаются только на сайте Б.
   * 
   * Таким образом каждый домен полного дерева доменов обслуживается хотя бы на одном из сайтов – там где он указан явно, либо явно указан его родительский домен и так далее вплать до мастер-домена.
   * 
   * Мастер-домен автоматически привязывается исключительно к мастер-сайту и не требует отдельного указания.
   */
  domains: string[]
  /**
   * Описание сайта. По умолчанию: не задано
   */
  descr?: string
  /**
   * Список доменов, управление которыми может производиться через подключение к текущему сайту.
   * Способ указания аналогичен полю domains.
   * 
   * default []
   */
  ctrl_domains?: string[]
  /**
   * Период снятия данных о работе системы и генерации событий класса perfmonevents, в секундах.
   * 0 – выключено.
   * Применяется в случае, если не указан соответствующий параметр в разделе "servers
   */
  perfmon_tick?: number

  /**
   * Числовой номер сайта из трех цифр для применения в именах элементов сайта
   */
  num?: number

  /**
   * Буквенный префикс из трех символов для применения в именах элементов сайта
   */
  prefix?: string
}

/**
 * Раздел structure
 *  
 * JSON-структура, объединяющая сайты, серверы и функциональные роли в одну конфигурацию.
 * Представляет собой список сайтов, каждый содержит список серверов, каждый содержит список функциональных ролей. Один сервер может принадлежать только одному сайту, один экземпляр функциональной роли может принадлежать только одному серверу.
 * 
 * https://dev01.oktell.ru/docs/r/develop/configuration/categories/structure.html 
 */
export interface IOSConfigStructure {
  /**
   * Имя сайта из раздела sites, поле name.
   */
  site: string
  servers: {
    /**
     * Имя сервера из раздела servers, поле name.
     */
    server: string,
    /**
     * Массив из имен экземпляров функциональных ролей из раздела roles, поле name.
     */
    roles: string[]
  }[]
}

/**
 * Раздел general
 * 
 * Общие параметры конфигурации, не относящиеся к другим разделам.
 * 
 * https://dev01.oktell.ru/docs/r/develop/configuration/categories/general.html
 */
export interface IOSConfigGeneral {
  /**Алиас главного домена из раздела "tds" */
  generaldomain: string
  /**Версия конфигурации. Представляет собой строгое значение, известное системе. На текущий момент "3.0" */
  version: string
  /**
   * Логин мастер-администратора.
   * Учетные данные пропускают запросы в систему под ролью доступа администратора.
   *При этом самой учетной записи в домене не существует.
   */
  master_admin_login?: string
  /**
   * Пароль мастер-администратора.
   * Может быть указан в виде зашифрованного значения.
   * Зашифровать и расшифровать пароль можно через API.
   * Ключ шифра зависит от экземпляра текущей системы.
   */
  master_admin_pwd?: string

  /**
   * ```
   * Период снятия данных о работе системы и генерации событий класса perfmonevents, в секундах.
   * 0 – выключено.
   * Применяется в качестве значения по умолчанию, если иное не указано в свойствах сервера и сайта.
   * ```
   * defaul 0
   */
  perfmon_tick?: number

  /**
   * Порт, используемый приложением syncthing для работы (межсерверная синхронизация файловых систем).
   * 
   * default 2200
   */
  fsync_port_device?: number

  /**
   * Порт, используемый для доступа к Web-GUI приложения syncthing (межсерверная синхронизация файловых систем).
   * 
   * default 8384
   */
  fsync_port_gui?: number

  /**
   * Минимальный объем свободного места на диске, при достижении которого, логирование будет отключено, в ГБ.
   * default 3
   */
  logging_min_disk_space?: number

  /**
   * Количество дней, в течении которого лог-файлы хранятся в рабочей директории ролевой ноды.
   * default 2
   */
  logging_role_store_days?: number

  /**
   * Максимальный объем лог-файлов, который может быть занят одной ролевой нодой (каталог log в рабочей директории ролевой ноды).
   * 
   * default 100
   */
  logging_role_max_size?: number

  /**
   * Количество одновременных исходящих запросов из компонента веб-запрос на каждой ноде источнике. Минимальное значение 10, максимальное 10000.
   * 
   * При указании больших значений также необходимо настроить максимальное количество открытых файлов в операционной системе ulimit -n.
   * 
   * default 100
   */
  webreq_out_max?: number
}
