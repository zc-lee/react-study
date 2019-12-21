// State

import React, { Component } from 'react';
import { Button } from 'antd';
class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            num: 0
        }
    }

    render() {
        return <div>
            <h1>State</h1>
            <h2>num:{this.state.num}</h2>
            <p>不要直接修改 State, 直接修改不会渲染</p>
            <Button type="primary" onClick={this.changeState}>直接修改 State</Button>
            <Button type="primary" onClick={this.testSetStateAsync}>测试 setState 异步</Button>
        </div>
    }
    changeState = () => {
        this.state.num++
        console.log('after changeState:', this.state.num)
    }
    testSetStateAsync = () => {
        let { num } = this.state
        num++
        this.setState({
            num
        }, () => {
            console.log('setStateCallback:', this.state.num)
        })
        // 异步
        console.log('setState after:', this.state.num)
    }
}
export default App