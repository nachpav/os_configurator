import { IOSConfigRoleBasic } from "../interfaces_os-config";

/**
* Middleware (mware)
* ```
* Обеспечивает функции переноса данных между внутренними сервисами внутри сайта, а также контроля корректности работы.
* ```
* https://dev01.oktell.ru/docs/r/develop/configuration/roles/mware.html
*/
export interface IOSConfigRoleMware extends IOSConfigRoleBasic {
  /** 
   *```
   * Тип функциональной роли. Возможные значения: "mware". 
   *```
   */
  roletype: "mware"

  /** 
   *```
   * Алиас сетевого интерфейса сервера, на котором будет происходить внутреннее взаимодействие функциональных ролей между собой. 
   *```
   */
  iface: string

  /** 
   *```
   * Номер группы.
   * В рамках горизонтального масштабирования функциональная роль может быть разделена на несколько групп на сайте, в каждой из которых активен только один экземпляр, а остальные зарезервированы.
   * Ответственность между группами разделяется по доменным множествам. Вместе все группы обслуживают полное доменное множество. Все функциональные роли одной группы должны иметь одинаковую ответственность.
   * Целое число от 1 до 9999999. 
   *```
   *  @TJS-integer
   *  @TJS-minimum 1
   *  @TJS-maximum 9999999
   */
  group: number

  /** 
   *```
   * Порядок экземпляра функциональной роли в рамках группы.
   * Определяет в каком порядке будет происходить перетекание в режиме Active-Passive. 
   *```
   */
  order: number

  /** 
   *```
   * Список имен доменов, которые обслуживает данная группа.
   * Может быть указан любой домен любого уровня. Указание домена приводит к тому, что дерево его поддоменов будет обслуживаться на этой группе и не будет обслуживаться на других группах функциональной роли, исключая только те ветви, которые упомянуты в других группах.
   * В совокупности все группы функциональной роли на сайте обслуживают полное дерево доменов. 
   *```
   * default: empty
   */
  include_domains?: string[]

  /** 
   *```
   * Настройки для контроллера серверов PostgreSQL, находящихся в режиме потоковой репликации (версия pgsql 12+).
   * Список содержит объекты-группы. Каждая группа содержит список из двух серверов, находящихся в режиме потоковой репликации.
   * Сервис mware обеспечивает в каждой группе наличие 1 мастера, автоматически приводя к состоянию 1+1.
   * Если обнаруживаются два мастера - один из них переводится в режим recovery. Изначально мастером выбирается первый из серверов в списке. В дальнейшем тот, кто выполнял функцию мастера последним.
   * Если экземпляр-мастер становится недоступен, то в течение минуты-двух recovery-сервер превращается в мастер.
   * Если предыдущий мастер появляется снова, то он переводится в режим recovery путем остановки и полного бэкапа данных с текущего мастера.
   * В лог middleware трассируется вся активность сервиса.
   * Работа с состояниями экземпляров серверов БД производится через SSH, для чего в свойствах сервера должны быть указаны соответствующие опции.
   * Операция перевода в режим recovery сопровождается перемещением каталога с данными в указанную папку для бэкапов. По умолчанию /tmp/pg_backups.
   * Перевод в режим master только после истечения 30 секунд после потери текущего мастера.
   * Перевод в режим recovery возможен только при наличии активного мастера.
   * Настройки значений для групп:
   * key - уникальный строковый ключ группы. При отсутствии генерируется автоматически.
   * servers - список серверов, входящих в группу.
   * Настройки значений для серверов:
   * ssh_host - ssh host of postgresql (default as pg_host).
   * ssh_port - ssh port of postgresql server (default 22).
   * ssh_user - ssh user of postgresql host.
   * ssh_pwd - ssh password of postgresql host.
   * pg_host - actual current postgresql host address, available for replicas (default as ssh_host).
   * pg_port - actual current postgresql port, available for replicas (default 5432). Recommended to set the same value to all replicas.
   * pg_replica_user - actual current postgresql replica user login, available for replicas. Should be the same on all replicas.
   * pg_replica_pwd - actual current postgresql replica user password, available for replicas. Should be the same on all replicas.
   * pg_ctl_command - available for ssh user command (name, path or alias) to pg_ctl of current postgresql version.
   * pg_basebackup_command - available for ssh user command (name, path or alias) to pg_basebackup of current postgresql version.
   * pg_database - actual current postgresql initial database to connect to as replica user and save state (default postgres).
   * pg_data_folder - postgresql instance data folder. Recommended to set the same value to all replicas.
   * pg_backup_folder - postgresql instance backups folder.
   * pg_log_filepath - postgresql instance log file.
   * pg_signal_filepath - recovery signal file to make master. Recommended to set the same value to all replicas.
   * Указанное значение этого параметра не проверяется валидатором конфигурации в функциональной роли mic, однако проходит через фильтр в рантайме. В случае выявления некорретных настроек группа исключается. При отсутствии корректно настроенных групп контроллер бездействует и ожидает изменений в конфигурации.
   * Все функциональные роли системы автоматически переключаются в работу с новым мастером, указанным в конфигурации, вне зависимости от данной настройки.
   * =Настройка PostgreSQL=
   * Для того, чтобы сервис контроллера работал корректно, требуется предварительная настройка экземпляров PostgreSQL.
   * Серверы могут быть установлены с помощью скрипта платформы, в этом случае они получают эту настройку автоматически.
   * Версия PostgreSQL не ниже 12.
   * Для репликации создана учетная запись (например, replicator), ей разрешено 10 или более подключений.
   * В конфигурационных файлах произведены следующие настройки (значения отдельных параметров могут варьироваться по усмотрению администратора):
   * postgresql.conf
   * listen_addresses = '*'
   * hot_standby = on
   * wal_level = replica
   * max_wal_senders = 10
   * wal_keep_segments = 32
   * promote_trigger_file = '/var/lib/postgresql/12/era_instance_01/master.signal'
   * pg_hba.conf
   * host	all	            replicator     	0.0.0.0/0		md5
   * Если второй сервер настроен в режиме мастера, то после первого запуска контроллер автоматически переведет одного из них в режим репликации. 
   *```
   * default: empty
   */
  pg_controller?: any

  /** 
   *```
   * Признак запуска процесса audio-matcher, используется для работы компонента ivr сценария - Антиробот. 
   *```
   * default: false
   */
  enable_audiomatcher?: boolean

}