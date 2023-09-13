import { IOSConfigRoleBasic } from "../interfaces_os-config";

/**
* Service Script Machine (scr)
* ```
* Процессор служебных сценариев и отложенных заданий на их выполнение.
* ```
* https://dev01.oktell.ru/docs/r/develop/configuration/roles/scr.html
*/
export interface IOSConfigRoleScr extends IOSConfigRoleBasic {
  /** 
   *```
   * Тип функциональной роли. Возможные значения: "scr". 
   *```
   */
  roletype: "scr"

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

}