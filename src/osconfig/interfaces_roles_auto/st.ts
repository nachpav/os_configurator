import { IOSConfigRoleBasic } from "../interfaces_os-config";

/**
* Storage (st)
* ```
* Универсальное хранилище сайта. Используется различными функциональными ролями как внутренний сервис.
* ```
* https://dev01.oktell.ru/docs/r/develop/configuration/roles/st.html
*/
export interface IOSConfigRoleSt extends IOSConfigRoleBasic {
  /** 
   *```
   * Тип функциональной роли. Возможные значения: "st". 
   *```
   */
  roletype: "st"

  /** 
   *```
   * Алиас сетевого интерфейса сервера, на котором будет происходить внутреннее взаимодействие функциональных ролей между собой. 
   *```
   */
  iface: string

  /** 
   *```
   * Номер группы.
   * В рамках горизонтального масштабирования функциональная роль может быть разделена на несколько групп на сайте, в каждой из которых активен только один экземпляр, остальные зарезервированы.
   * Ответственность между группами разделяется по хеш-суммам ключей сохраняемых данных. Все функциональные роли одной группы должны иметь одинаковую ответственность.
   * Расчет хеш-сумм производится автоматически по внутреннему алгоритму с равномерно-случайным распределением.
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

}