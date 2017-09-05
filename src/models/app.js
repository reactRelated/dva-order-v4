/* global window */
/* global document */
/* global location */
import { routerRedux } from 'dva/router'
import { parse } from 'qs'
import config from 'utils/config'
import { EnumRoleType } from 'utils/enums'
import { query, logout } from '../services/app'
import * as menusService from '../services/menus'

const { prefix } = config

const contentHeight=function (ddc) {
 return ddc-160
}

export default {
  namespace: 'app',
  /**
   * 初始化数据源
   * user        用户状态
   * siderFold   true  [localStorage] 右侧菜单是否收起
   * darkTheme   true  [localStorage] 右侧面板主題
   * isNavbar    如果 document.body.clientWidth < 769
   * menuPopoverVisible
   * navOpenKeys
   * menu
   * permissions
   */
  state: {
    user: {},
    permissions: {
      visit: [],
    },
    menu: [
      {
        id: 1,
        icon: 'laptop',
        name: 'Dashboard',
        router: '/dashboard',
      },
    ],
    menuPopoverVisible: false,
    siderFold: window.localStorage.getItem(`${prefix}siderFold`) === 'true',
    darkTheme: window.localStorage.getItem(`${prefix}darkTheme`) === 'true',
    isNavbar: document.body.clientWidth < 769,
    // contentHeight: window.screen.height-(47+64+48+48),
    contentHeight: contentHeight(document.documentElement.clientHeight),
    navOpenKeys: JSON.parse(window.localStorage.getItem(`${prefix}navOpenKeys`)) || [],
  },
  subscriptions: {
    setup ({ dispatch }) {
      dispatch({ type: 'query' })
      let tid
      window.onresize = () => {
        clearTimeout(tid)
        tid = setTimeout(() => {
          dispatch({ type: 'changeNavbar' })
          dispatch({ type: 'monitorContent',payload: contentHeight(document.documentElement.clientHeight)  })
        }, 300)
      }
    },

  },
  effects: {

    * query ({
      payload,
    }, { call, put }) {
      //请求查询 用户数据
      const userc= yield call(query, payload)
      console.log(userc)
      const { success, user }=userc
      //请求成功
      if (success && user) {
        //请求菜单
        const { data } = yield call(menusService.query)

        const { permissions } = user
        let list=data.list
        let menu = list
        if (permissions.role === EnumRoleType.ADMIN || permissions.role === EnumRoleType.DEVELOPER) {
          permissions.visit = list.map(item => item.id)
        } else {
          menu = list.filter((item) => {
            const cases = [
              permissions.visit.includes(item.id),
              item.mpid ? permissions.visit.includes(item.mpid) || item.mpid === '-1' : true,
              item.bpid ? permissions.visit.includes(item.bpid) : true,
            ]
            return cases.every(_ => _)
          })
        }
        yield put({
          type: 'updateState',
          payload: {
            user,
            permissions,
            menu
          },
        })
        console.log("location.pathname")
        console.log(location.pathname)
        if (location.pathname === '/login') {
          yield put(routerRedux.push('/dashboard'))
        }
      } else if (config.openPages && config.openPages.indexOf(location.pathname) < 0) {
        console.log("2$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$")
        let from = location.pathname
        window.location = `${location.origin}/login?from=${from}`
      }
    },

    * logout ({
      payload,
    }, { call, put }) {
      const data = yield call(logout, parse(payload))
      console.log(data)
      if (data.success) {
        yield put({ type: 'query' })
      } else {
        throw (data)
      }
    },

    * changeNavbar (action, { put, select }) {
      const { app } = yield (select(_ => _))
      const isNavbar = document.body.clientWidth < 769
      if (isNavbar !== app.isNavbar) {
        yield put({ type: 'handleNavbar', payload: isNavbar })

      }
    },

  },
  reducers: {
    updateState (state, { payload }) {
      console.log(state)
      console.log(payload)
      return {
        ...state,
        ...payload,
      }
    },

    switchSider (state) {
      window.localStorage.setItem(`${prefix}siderFold`, !state.siderFold)
      return {
        ...state,
        siderFold: !state.siderFold,
      }
    },

    switchTheme (state) {
      window.localStorage.setItem(`${prefix}darkTheme`, !state.darkTheme)
      return {
        ...state,
        darkTheme: !state.darkTheme,
      }
    },

    switchMenuPopver (state) {
      return {
        ...state,
        menuPopoverVisible: !state.menuPopoverVisible,
      }
    },

    handleNavbar (state, { payload }) {
      return {
        ...state,
        isNavbar: payload,
      }
    },
    monitorContent (state, { payload }) {
      return {
        ...state,
        contentHeight: payload,
      }
    },
    handleNavOpenKeys (state, { payload: navOpenKeys }) {
      console.log(state)
      return {
        ...state,
        ...navOpenKeys,
      }
    },
  },
}
