import { IOSConfig, IOSConfigSite } from "../../os-json-schema/src/interfaces_os-config"
import { TypeRoleGroup, roleGroups } from "../../os-json-schema/src/osconfig-group.js"

const COLUMNS_COUNT = 5
const CSS_SITE_CLASS = 'os-table-caption-site'
const CSS_HEADER_CLASS = 'os-table-header'
const CSS_HEADER_MID_CLASS = 'os-table-header-midle'
const CSS_BODY_CLASS = 'os-table-body'
const CSS_SERVER_INFO = 'os-table-server-info'

/**
 * 
 * @param config Конфигурация
 * @returns вернет основной контекст для конфигурации
 */
const createContext = (config: IOSConfig) => {
  const content = config.content

  const getServersBySite = (siteName: string) => {
    return content.structure.filter(item => item.site == siteName).map(site => site.servers).flat()
  }

  const getServerRolesByName = (targetSrvName: string) => {
    return config.content.structure.map(struct => struct.servers).flat().find(server => server.server == targetSrvName)
  }

  const getRoleByName = (roleName: string) => {
    return content.roles.find(role => role.name == roleName)
  }

  const getServerByName = (serverName: string) => {
    return content.servers.find(server => server.name == serverName)
  }

  const getDomainsAliasBySite = (siteName: string) => {
    return content.sites.find(item => item.name == siteName)?.domains ?? []
  }

  const getDomainsBySite = (siteName: string) => {
    const domainAliases = getDomainsAliasBySite(siteName)
    return domainAliases.map(item => content.domains.find(domain => domain.name == item))
  }

  const getLostRoles = () => {
    const allRolesStruct = config.content.structure.map(struct => [...struct.servers.map(srv => srv.roles).flat()]).flat() as unknown as string[]
    return config.content.roles.filter(role => !allRolesStruct.includes(role.name))
  }

  const getLostServers = () => {
    const allServers = config.content.servers
    const siteServers = config.content.structure.map(site => site.servers.map(srv => srv.server)).flat() as string[]

    return allServers.filter(server => !siteServers.includes(server.name))
  }

  /** Возвращает список ролей у которых есть пересечение по roleid */
  const getIntersectionedRoles = () => {
    const allRoles = config.content.roles
    const getRoleId = (obj: object) => 'roleid' in obj ? obj.roleid : undefined;

    const intersectedRoles = allRoles.filter((obj, index, arr) => {
      const currentRoleId = getRoleId(obj)
      if (!currentRoleId) { return false }
      return arr.filter((innerObj) => currentRoleId == getRoleId(innerObj)).length > 1;
    });

    return intersectedRoles
  }

  //Роли которые в структуре есть, но в описании нет
  const getEmptyRoles = () => {
    const allRolesStruct = config.content.structure.map(struct => [...struct.servers.map(srv => srv.roles).flat()]).flat() as unknown as string[]
    const allRoles = config.content.roles.map(role => role.name)
    return allRolesStruct.filter(roleStruct => !allRoles.includes(roleStruct))
  }

  const sites = content.sites.sort((a, b) => a.name > b.name ? 1 : -1)
  const sitesWithSrv = sites.map(site => {
    return (getServersBySite(site.name) ?? []).sort().map(server => ({ siteName: site.name, srvName: server.server }))
  }).flat()
    .map((siteSrv, i, arr) => {
      return {
        ...siteSrv,
        /**Указывает что был сделан преход на следующий сайт */
        isBorderLeft: siteSrv.siteName != arr[i - 1]?.siteName,
      }
    })

  return {
    config,
    sitesWithSrv,
    getServersBySite,
    getServerRolesByName,
    getRoleByName,
    getServerByName,
    getDomainsBySite,
    getLostRoles,
    getLostServers,
    getIntersectionedRoles,
    getEmptyRoles
  }
}

type TypeContext = ReturnType<typeof createContext>

/** Применяем стиль для отметки следующего сайта */
const applySiteBorderLeft = (cell: HTMLTableCellElement, isBorderneed: boolean) => {
  if (isBorderneed) {
    cell.classList.add('site-border-left')
  }
  return cell
}

const renederSites = (context: TypeContext) => {
  return context.sitesWithSrv.map(siteSrv => {
    const cell = document.createElement('td') as HTMLTableCellElement
    cell.colSpan = COLUMNS_COUNT
    cell.classList.add(CSS_SITE_CLASS)
    cell.textContent = siteSrv.siteName + "-" + siteSrv.srvName
    applySiteBorderLeft(cell, siteSrv.isBorderLeft)
    return cell
  })
}

const headers = ['Role', 'Group', 'Order', 'RoleID', 'MGC_gr']

const renederHeader1 = (context: TypeContext) => {
  return context.sitesWithSrv.map(siteSrv => {
    return headers.map((header, i) => {
      const cell = document.createElement('td') as HTMLTableCellElement
      cell.classList.add(CSS_HEADER_CLASS)
      cell.textContent = header
      if (i == 0) { applySiteBorderLeft(cell, siteSrv.isBorderLeft) }
      return cell
    })

  }).flat()
}

/**Если группа не указана то выбираем роли не попавшие в группы */
const renederBodyGroup = (context: TypeContext, group?: TypeRoleGroup) => {
  const gg = roleGroups.find(item => item.name == group)
  console.log(gg)
  if (group && !gg) throw new Error('Group not found! > ' + group)

  const serverRoles = context.sitesWithSrv.map(siteSrv => {
    const { server, roles: nameRoles } = context.getServerRolesByName(siteSrv.srvName) ?? {}
    if (!nameRoles) return { siteSrv, rolesGG: [] }
    const roles = nameRoles.map(roleName => context.getRoleByName(roleName))

    const rolesGG = (() => {
      if (group) { return roles.filter(role => role ? gg!.typeroles.includes(role.roletype) : false) }
      else {
        const allRoleTypesInAllGroups = roleGroups.map(group => [...group.typeroles]).flat()
        return roles.filter(role => role ? !allRoleTypesInAllGroups.includes(role.roletype) : false)
      }
    })()

    return { siteSrv, rolesGG }
  })
  console.log(context.sitesWithSrv)
  console.log(serverRoles)

  const maxRows = [...serverRoles].sort((a, b) => a.rolesGG.length > b.rolesGG.length ? 1 : -1).reverse()[0].rolesGG.length + 1
  console.log(maxRows)

  const headerRow = (() => {// добавляем заголовок 
    const row = document.createElement('tr') as HTMLTableRowElement

    row.title = !group ? 'Роли без группы' : ''

    serverRoles.forEach(item => {
      const cellHeader = row.insertCell()
      cellHeader.colSpan = COLUMNS_COUNT
      cellHeader.classList.add(CSS_HEADER_MID_CLASS)
      cellHeader.innerText = (gg ? gg.caption : 'Иное') + ' - ' + item.siteSrv.srvName
      applySiteBorderLeft(cellHeader, item.siteSrv.isBorderLeft)
    })
    return row
  })()

  const bodyRows = [...new Array(maxRows)].map((n, i) => {
    const row = document.createElement('tr') as HTMLTableRowElement

    serverRoles.forEach(roles => {
      const rr = roles.rolesGG[i]

      const cell1 = row.insertCell()
      cell1.classList.add(CSS_BODY_CLASS)
      cell1.innerHTML = rr ? rr.name : '&nbsp;'
      cell1.title = JSON.stringify(rr, null, 2)
      applySiteBorderLeft(cell1, roles.siteSrv.isBorderLeft)


      const cell2 = row.insertCell()
      cell2.classList.add(CSS_BODY_CLASS)
      cell2.innerHTML = (rr && 'group' in rr) ? '' + rr['group'] : '&nbsp;'

      const cell3 = row.insertCell()
      cell3.classList.add(CSS_BODY_CLASS)
      cell3.innerHTML = (rr && 'order' in rr) ? '' + rr['order'] : '&nbsp;'

      const cell4 = row.insertCell()
      cell4.classList.add(CSS_BODY_CLASS)
      cell4.innerHTML = (rr && 'roleid' in rr) ? '' + rr['roleid'] : '&nbsp;'

      const cell5 = row.insertCell()
      cell5.classList.add(CSS_BODY_CLASS)
      cell5.innerHTML = (rr && 'mgcgroup' in rr) ? '' + rr['mgcgroup'] : '&nbsp;'

      return cell1
    })
    return row
  })
  return [headerRow, ...bodyRows]
}

/**
 * Выводит основую информацию по серверам
 * @param context контекст 
 * @returns 
 */
const renderServerInfo = (context: TypeContext) => {
  return context.sitesWithSrv.map(siteSrv => {
    const cell = document.createElement('td') as HTMLTableCellElement
    cell.colSpan = COLUMNS_COUNT
    cell.classList.add(CSS_SERVER_INFO)
    const server = context.getServerByName(siteSrv.srvName)
    cell.innerHTML =
      [
        (server?.ifaces || []).map(ifrace => `${ifrace.key} - ${ifrace.value}`).join('<br/>'),
        `Описание:${server?.descr || ''} `.split('\n').join('<br/>')
      ].join('<br/>')

    cell.title = JSON.stringify(server, null, 2)
    applySiteBorderLeft(cell, siteSrv.isBorderLeft)
    return cell
  }).flat()
}

/**
 * Выводит основую информацию по доментам 
 * @param context контекст 
 * @returns 
 */
const renderDomainInfo = (context: TypeContext) => {
  return context.sitesWithSrv.map(siteSrv => {
    const cell = document.createElement('td') as HTMLTableCellElement
    cell.colSpan = COLUMNS_COUNT
    cell.classList.add(CSS_SERVER_INFO)
    const domains = context.getDomainsBySite(siteSrv.siteName)
    cell.innerHTML =
      domains.map(item => `${item?.name ?? '?'} - ${item?.fqdn ?? '?'}`)
        .join('<br/>')

    cell.title = JSON.stringify(domains, null, 2)
    applySiteBorderLeft(cell, siteSrv.isBorderLeft)
    return cell
  }).flat()
}


/**
 * Выводит список ролей которые описаны ноне добавлены к серверу
 * @param jsonStr конфиг
 * @returns 
 */
export const renderLostRoles = (jsonStr: string) => {
  const config = JSON.parse(jsonStr) as IOSConfig

  const context: TypeContext = createContext(config)

  const div = document.createElement('div')
  const items = context.getLostRoles().map(role => role.name)
  div.innerText = `Всего:${items.length}, - ` + items.join(', ')
  return div
}

/**
 * Выводит роли которые были добавлены серверу, но роли в описании нет
 * @param jsonStr кофиг
 * @returns 
 */
export const renderEmpty = (jsonStr: string) => {
  const config = JSON.parse(jsonStr) as IOSConfig

  const context: TypeContext = createContext(config)

  const div = document.createElement('div')
  const items = context.getEmptyRoles()
  div.innerText = `Всего:${items.length}, - ` + items.join(', ')
  return div
}


/**
 * Выводит список серверов которые описаны но не добавлены на сайт
 * @param jsonStr конфиг
 * @returns 
 */
export const renderLostServers = (jsonStr: string) => {
  const config = JSON.parse(jsonStr) as IOSConfig

  const context: TypeContext = createContext(config)

  const div = document.createElement('div')
  const items = context.getLostServers().map(server => server.name)
  div.innerText = `Всего:${items.length}, - ` + items.join(', ')
  return div
}

/**
 * Выводит список серверов которые описаны но не добавлены на сайт
 * @param jsonStr конфиг
 * @returns 
 */
export const renderIntersectionRoleId = (jsonStr: string) => {
  const config = JSON.parse(jsonStr) as IOSConfig

  const context: TypeContext = createContext(config)

  const div = document.createElement('div')
  const items = context.getIntersectionedRoles().map(roles => roles.name)
  div.innerText = `Всего:${items.length}, - ` + items.join(', ')
  return div
}


/**
 * Основная фнукция построения таблицы
 * @param jsonStr конфиг
 * @returns 
 */
export const renderTable = (jsonStr: string) => {
  const config = JSON.parse(jsonStr) as IOSConfig

  const context: TypeContext = createContext(config)

  const table = document.createElement('table') as HTMLTableElement


  const tableRowSite = table.insertRow()
  tableRowSite.append(...renederSites(context))

  const tableRowHeader = table.insertRow()
  tableRowHeader.append(...renederHeader1(context))

  // const tableRowEmpty = table.insertRow()
  // tableRowEmpty.append(...renederHeader2(context))

  table.tBodies[0].append(...renederBodyGroup(context, "system"))

  table.tBodies[0].append(...renederBodyGroup(context, "sip"))
  table.tBodies[0].append(...renederBodyGroup(context, "store"))
  table.tBodies[0].append(...renederBodyGroup(context, "media"))
  table.tBodies[0].append(...renederBodyGroup(context, "func"))
  table.tBodies[0].append(...renederBodyGroup(context, "add"))
  table.tBodies[0].append(...renederBodyGroup(context))

  const tableRowDomainInfo = table.insertRow()
  tableRowDomainInfo.append(...renderDomainInfo(context))
  const tableRowServerInfo = table.insertRow()
  tableRowServerInfo.append(...renderServerInfo(context))

  return table
}

////////////////////////////////////
////////////////////////////////////

/**
 * Выводит всплывающее сообщение 
 */
const showMsg = (() => {
  let msg_timerId: number
  const SHOWED_ATTR = 'showed'

  return (text: string, ms = 2000) => {
    clearTimeout(msg_timerId)

    const msgEl = document.getElementById('popup-msg')
    if (!msgEl) { return }

    msgEl.setAttribute(SHOWED_ATTR, 'true')
    msgEl.innerText = text

    msg_timerId = setTimeout(() => msgEl.removeAttribute(SHOWED_ATTR), ms)
  }
})()

/**
 *  Копирование таблицы в виде csv в Буфер обмена
 */
export const copyTableToClipboard = () => {
  const tableEl = document.querySelector('#targetTableContainer>table')
  if (tableEl == null) {
    showMsg('Ошибка копирования!')
    return
  }
  // Get the text field
  const copyText = [...tableEl.querySelectorAll('tr')].map(row => {
    return [...row.cells]
      .map(cell => `"${cell.innerText}"${[...new Array(cell.colSpan)].map(item => ',').join('')}`)
      .map(cellText => cellText.replace(/\r\n|\r/mg, '\n'))
  }).join('\n')

  // Copy the text inside the text field
  navigator.clipboard.writeText(copyText);
  showMsg('Скопировано!')
}
{
  const el = document.getElementById('copy-to-clipboard')
  if (el) { el.onclick = copyTableToClipboard }
}

/**
 * Скачиваем в виде файла Excel
 */
export const downloadAsExcel = () => {
  const tableEl = document.querySelector('#targetTableContainer>table') as HTMLElement
  if (tableEl == null) {
    showMsg('Ошибка копирования!')
    return
  }

  const dataType = 'application/vnd.ms-excel'
  const tableHTML = tableEl.outerHTML
  const fileName = `osconfig_${formatDate(new Date())}.xls`
  const a = window.document.createElement('a');
  a.href = `data:${dataType};base64,${base64Str(tableHTML)}`
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  showMsg('Скачивание XLS...')
}
{
  const el = document.getElementById('download-as-excel')
  if (el) { el.onclick = downloadAsExcel }
}

/**
 * Скачиваем текущий конфик в виде файла с текущей датой
 */
export const downloadConfigJson = () => {
  const textArea = document.querySelector('#sourceJSON') as HTMLTextAreaElement
  if (textArea == null) {
    showMsg('Ошибка копирования!')
    return
  }

  const dataType = 'application/json'
  const jsonText = textArea.value
  console.log(jsonText)
  const fileName = `osconfig_${formatDate(new Date())}.json`
  const a = window.document.createElement('a');
  a.href = `data:${dataType};base64,${base64Str(jsonText)}`
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  showMsg('Скачивание JSON...')
}
{
  const el = document.getElementById('download-as-config-json')
  if (el) { el.onclick = downloadConfigJson }
}


const base64Str = (str: string) => window.btoa(unescape(encodeURIComponent(str))); //Buffer.from(str, 'utf-8').toString('base64');

const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}_${hours}-${minutes}`;
}