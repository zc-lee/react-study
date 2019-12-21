import RenderDom from './docs/RenderDom'
import State from './docs/State'
import LifeCycle from './docs/LifeCycle'
import RouterBasic from './docs/Router'
import RouterNest from './docs/RouterNest'

import Reader from './Reader'
let routes = [
    {
        title: '渲染Dom',
        path: '/',
        component: RenderDom
    },{
        title: 'State',
        path: '/State',
        component: State
    }, {
        title: '生命周期',
        path: '/LifeCycle',
        component: LifeCycle
    }, {
        title: '基本路由',
        path: '/RouterBasic',
        component: RouterBasic
    }, {
        title: '路由嵌套',
        path: '/RouterNest',
        component: RouterNest
    },{
        title: 'Reader',
        path: '/Reader',
        component: Reader
    }
]
export default routes