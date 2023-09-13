import { IOSConfigRole } from "./interfaces_os-config"
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

type OSConfigGroup = {
  name: TypeRoleGroup
  caption: string
  typeroles: (IOSConfigRole['roletype'])[]
}

export type TypeRoleGroup = 'system' | 'sip' | 'store' | 'media' | 'func' | 'add'

export const roleGroups: OSConfigGroup[] = [
  {
    name: "system",
    caption: 'Системные роли',
    typeroles: ["mic", "mdc", "sdc", "ic", "rpco", "rpci", "mware"],
  },
  {
    name: "sip",
    caption: 'SIP роли',
    typeroles: ["esg", "b2b", "sg", "sg", "conf", "sel", "sr"],
  },
  {
    name: "store",
    caption: "Хранилища",
    typeroles: ["sq", "logstore", "callstore", "st", 'sts']
  },
  {
    name: "media",
    caption: "Медиа",
    typeroles: ["bgmg", "mgc", "mg", "mix"]
  },
  {
    name: "func",
    caption: "Фнукциональные роли",
    typeroles: ["scr", "ivr", "cdr", "jrnl", "recmover", "vmail"]
  },
  {
    name: 'add',
    caption: "Сопутсвующие роли",
    typeroles: ["huntq", "wssubscr", "ws", "usr", "rsv"]
  }
]