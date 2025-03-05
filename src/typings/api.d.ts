/**
 * 命名空间 Api
 *
 * 所有后端 API 类型
 */
declare namespace Api {
  namespace Common {

    /** 通用分页参数 */
    type PaginatingCommonParams = {

      /** 当前页码 */
      current: number

      /** 每页大小 */
      size: number

      /** 总记录数 */
      total: number
    }

    /** 通用分页查询记录数据 */
    type PaginatingQueryRecord<T = any> = {

      /** 记录数组 */
      records: T[]
    } & PaginatingCommonParams

    /** 通用表格搜索参数 */
    type CommonSearchParams = Pick<Common.PaginatingCommonParams, 'current' | 'size'>

    /**
     * 启用状态
     *
     * - "1": 启用
     * - "2": 禁用
     */
    type EnableStatus = '1' | '2'

    /** 通用记录 */
    type CommonRecord<T = any> = {

      /** 记录 ID */
      id: number

      /** 创建者 */
      createBy: string

      /** 创建时间 */
      createTime: string

      /** 更新者 */
      updateBy: string

      /** 更新时间 */
      updateTime: string

      /** 状态 */
      status: EnableStatus | undefined
    } & T
  }

  /**
   * 命名空间 Auth
   *
   * 后端 API 模块: "auth"
   */
  namespace Auth {

    /** 登录令牌 */
    type LoginToken = {

      /** 访问令牌 */
      token: string

      /** 刷新令牌 */
      refreshToken: string
    }

    /** 用户信息 */
    type UserInfo = {

      /** 用户 ID */
      userId: string

      /** 用户名 */
      userName: string

      /** 角色数组 */
      roles: string[]

      /** 按钮权限数组 */
      buttons: string[]
    }
  }

  /**
   * 命名空间 Route
   *
   * 后端 API 模块: "route"
   */
  namespace Route {
    type ElegantConstRoute = import('@elegant-router/types').ElegantConstRoute

    /** 菜单路由 */
    type MenuRoute = {

      /** 路由 ID */
      id: string
    } & ElegantConstRoute

    /** 用户路由 */
    type UserRoute = {

      /** 路由数组 */
      routes: MenuRoute[]

      /** 首页路由键 */
      home: import('@elegant-router/types').LastLevelRouteKey
    }
  }

  /**
   * 命名空间 SystemManage
   *
   * 后端 API 模块: "systemManage"
   */
  namespace SystemManage {

    /** 通用搜索参数 */
    type CommonSearchParams = Pick<Common.PaginatingCommonParams, 'current' | 'size'>

    /** 角色 */
    type Role = Common.CommonRecord<{

      /** 角色名称 */
      roleName: string

      /** 角色代码 */
      roleCode: string

      /** 角色描述 */
      roleDesc: string
    }>

    /** 角色搜索参数 */
    type RoleSearchParams = CommonType.RecordNullable<
      Pick<Api.SystemManage.Role, 'roleName' | 'roleCode' | 'status'> & CommonSearchParams
    >

    /** 角色列表 */
    type RoleList = Common.PaginatingQueryRecord<Role>

    /** 所有角色 */
    type AllRole = Pick<Role, 'id' | 'roleName' | 'roleCode'>

    /**
     * 用户性别
     *
     * - "1": 男
     * - "2": 女
     */
    type UserGender = '1' | '2'

    /** 用户 */
    type User = Common.CommonRecord<{

      /** 用户名 */
      userName: string

      /** 用户性别 */
      userGender: UserGender | undefined

      /** 用户昵称 */
      nickName: string

      /** 用户电话 */
      userPhone: string

      /** 用户邮箱 */
      userEmail: string

      /** 用户角色代码集合 */
      userRoles: string[]
    }>

    /** 用户搜索参数 */
    type UserSearchParams = CommonType.RecordNullable<
      Pick<Api.SystemManage.User, 'userName' | 'userGender' | 'nickName' | 'userPhone' | 'userEmail' | 'status'> &
      CommonSearchParams
    >

    /** 用户列表 */
    type UserList = Common.PaginatingQueryRecord<User>

    /**
     * 菜单类型
     *
     * - "1": 目录
     * - "2": 菜单
     */
    type MenuType = '1' | '2'

    /** 菜单按钮 */
    type MenuButton = {

      /**
       * 按钮代码
       *
       * 可用于控制按钮权限
       */
      code: string

      /** 按钮描述 */
      desc: string
    }

    /**
     * 图标类型
     *
     * - "1": iconify 图标
     * - "2": 本地图标
     */
    type IconType = '1' | '2'

    /** 菜单路由属性 */
    type MenuPropsOfRoute = Pick<
      import('vue-router').RouteMeta,
        | 'keepAlive'
        | 'order'
        | 'href'
        | 'hideInMenu'
        | 'activeMenu'
        | 'multiTab'
        | 'fixedIndexInTab'
        | 'query'
    >

    /** 菜单 */
    type Menu = Common.CommonRecord<{

      /** 父菜单 ID */
      parentId: number

      /** 菜单类型 */
      menuType: MenuType

      /** 菜单名称 */
      menuName: string

      /** 路由名称 */
      routeName: string

      /** 路由路径 */
      routePath: string
      /** 组件 */
      component?: string

      /** iconify 图标名称或本地图标名称 */
      icon: string

      /** 图标类型 */
      iconType: IconType

      /** 按钮数组 */
      buttons?: MenuButton[] | null

      /** 子菜单数组 */
      children?: Menu[] | null
    }> &
    MenuPropsOfRoute

    /** 菜单列表 */
    type MenuList = Common.PaginatingQueryRecord<Menu>

    /** 菜单树 */
    type MenuTree = {

      /** 菜单 ID */
      id: number

      /** 菜单标签 */
      label: string

      /** 父菜单 ID */
      pId: number

      /** 子菜单数组 */
      children?: MenuTree[]
    }
  }
}
