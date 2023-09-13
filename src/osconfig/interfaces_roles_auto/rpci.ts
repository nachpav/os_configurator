import { IOSConfigRoleBasic } from "../interfaces_os-config";

/**
* RPC Inner (rpci)
* ```
* Служебная функциональная роль, обеспечивающая регистрацию активных экземпляров функциональных ролей, резервирующихся в режиме Active-Passive. Каждая нода внутри системы имеет клиента rpci для осуществления таких запросов. В конфигурации настраиваются функциональные роли-серверы rpci для каждого сайта. Сервис rpci обеспечивает выдачу адресов микросервисов внутри сайта.
* ```
* https://dev01.oktell.ru/docs/r/develop/configuration/roles/rpci.html
*/
export interface IOSConfigRoleRpci extends IOSConfigRoleBasic {
  /** 
   *```
   * Тип функциональной роли. Возможные значения: "rpci". 
   *```
   */
  roletype: "rpci"

  /** 
   *```
   * Алиас сетевого интерфейса сервера, на котором будет происходить внутреннее взаимодействие функциональных ролей между собой. 
   *```
   */
  iface: string

}