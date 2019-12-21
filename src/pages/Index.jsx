import React, { Component } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import { Layout, Menu, Icon } from 'antd';
import routes from './routes'

const { Header, Sider, Content } = Layout;

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            collapsed: false,
            menus: routes,
            currentMenu: '0',
            routes: getRoutes(routes)
        }
        function getRoutes(routes = []) {
            function valid(v) {
                return v.path === '/'
            }
            if (!routes.some(v => valid(v))) {
                return console.warn("Don`t have route who path === '/'")
            } else if (routes.findIndex(v => valid(v)) === routes.length - 1) {
                console.warn("Route`s index already in last who path === '/'")
                return
            }
            let base = null;
            routes = routes.filter(v => {
                if (valid(v))
                    base = v
                return !valid(v)
            })
            routes.push(base)
            return routes
        }
    }

    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    }

    render() {
        return <Router>
            <Layout style={{ height: '100%' }}>
                <Header style={{ background: '#fff', padding: 0 }}>
                    <Icon
                        className="trigger"
                        type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                        onClick={this.toggle}
                    />
                </Header>
                <Layout>
                    <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
                        <Menu theme="dark" mode="inline" defaultSelectedKeys={[this.state.currentMenu]}>
                            {this.state.menus.map((v, i) => <Menu.Item key={i}>
                                <Link to={v.path}>{v.title}</Link>
                            </Menu.Item>)}
                        </Menu>
                    </Sider>
                    <Content>
                        <Switch>
                            {this.state.routes.map((v, i) => <Route key={i} {...v} />)}
                            {/* <Route path="/LifeCycle" component={LifeCycle} /> */}
                            {/* 一条路径= " / "将* *总是匹配 　　因为所有的URL网址以/开头。这是为什么我们把这最后一个* / */}
                            {/* <Route path="/" component={RenderDom} /> */}
                        </Switch>
                    </Content>
                </Layout>
            </Layout>
        </Router>
    }
}
export default App
