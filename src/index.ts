import { IOSConfig, IOSConfigSite } from "./osconfig/interfaces_os-config"
import { TypeRoleGroup, roleGroups } from "./osconfig/osconfig-group.js"

const COLUMNS_COUNT = 5
const CSS_SITE_CLASS = 'os-site'
const CSS_HEADER_CLASS = 'os-header'
const CSS_HEADER_MID_CLASS = 'os-header-mid'

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

  const getLostRoles = () => {
    const allRolesStruct = config.content.structure.map(struct => [...struct.servers.map(srv => srv.roles).flat()]).flat() as unknown as string[]
    return config.content.roles.filter(role => !allRolesStruct.includes(role.name))
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

  return {
    config,
    sitesWithSrv,
    getServersBySite,
    getServerRolesByName,
    getRoleByName,
    getLostRoles,
    getEmptyRoles
  }
}

type TypeContext = ReturnType<typeof createContext>

const renederSites = (context: TypeContext) => {
  return context.sitesWithSrv.map(siteSrv => {
    const cell = document.createElement('td') as HTMLTableCellElement
    cell.colSpan = 5
    cell.classList.add(CSS_SITE_CLASS)
    cell.textContent = siteSrv.siteName + "-" + siteSrv.srvName
    return cell
  })
}

const headers = ['Role', 'Group', 'Order', 'RoleID', 'MGC_gr']

const renederHeader1 = (context: TypeContext) => {
  return context.sitesWithSrv.map(siteSrv => {
    return headers.map((header) => {
      const cell = document.createElement('td') as HTMLTableCellElement
      cell.classList.add(CSS_HEADER_CLASS)
      cell.textContent = header
      return cell
    })
  }).flat()
}

const renederHeader2 = (context: TypeContext) => {
  return context.sitesWithSrv.map(siteSrv => {
    return headers.map((header) => {
      const cell = document.createElement('td') as HTMLTableCellElement
      cell.classList.add(CSS_HEADER_CLASS)
      cell.innerHTML = '&nbsp;'
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

    serverRoles.forEach(roles => {
      const cellHeader = row.insertCell()
      cellHeader.colSpan = 5
      cellHeader.classList.add(CSS_HEADER_MID_CLASS)
      cellHeader.innerText = (gg ? gg.caption : ' {-} ') + '-' + roles.siteSrv.srvName
    })
    return row
  })()

  const bodyRows = [...new Array(maxRows)].map((n, i) => {
    const row = document.createElement('tr') as HTMLTableRowElement

    serverRoles.forEach(roles => {
      const rr = roles.rolesGG[i]

      const cell1 = row.insertCell()
      cell1.classList.add(CSS_HEADER_CLASS)
      cell1.innerHTML = rr ? rr.name : '&nbsp;'

      const cell2 = row.insertCell()
      cell2.classList.add(CSS_HEADER_CLASS)
      cell2.innerHTML = (rr && 'group' in rr) ? '' + rr['group'] : '&nbsp;'

      const cell3 = row.insertCell()
      cell3.classList.add(CSS_HEADER_CLASS)
      cell3.innerHTML = (rr && 'order' in rr) ? '' + rr['order'] : '&nbsp;'

      const cell4 = row.insertCell()
      cell4.classList.add(CSS_HEADER_CLASS)
      cell4.innerHTML = (rr && 'roleid' in rr) ? '' + rr['roleid'] : '&nbsp;'

      const cell5 = row.insertCell()
      cell5.classList.add(CSS_HEADER_CLASS)
      cell5.innerHTML = (rr && 'mgcgroup' in rr) ? '' + rr['mgcgroup'] : '&nbsp;'

      return cell1
    })
    return row
  })
  return [headerRow, ...bodyRows]
}

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

  return table
}

export const renderLost = (jsonStr: string) => {
  const config = JSON.parse(jsonStr) as IOSConfig

  const context: TypeContext = createContext(config)

  const div = document.createElement('div')
  const items = context.getLostRoles().map(role => role.name)
  div.innerText = `Всего:${items.length}, - ` + items.join(', ')
  return div
}

export const renderEmpty = (jsonStr: string) => {
  const config = JSON.parse(jsonStr) as IOSConfig

  const context: TypeContext = createContext(config)

  const div = document.createElement('div')
  const items = context.getEmptyRoles()
  div.innerText = `Всего:${items.length}, - ` + items.join(', ')
  return div
}


