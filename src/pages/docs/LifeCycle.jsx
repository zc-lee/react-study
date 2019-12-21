// 生命周期

// function 方法

// import React from 'react';

// export default () => {
//     return <h1>lifeCycle</h1>
// }

// class 类

import React, { Component } from 'react';
import { render } from 'react-dom';
import { Button } from 'antd';


class App extends Component {
    constructor(props) {
        console.log('constructor')
        // console.log(arguments)
        super(props);
        this.state = {
            time: null
        };
    }
    render() {
        console.log('render')
        return <div>
            <h1>lifeCycle {this.state.time}</h1>
            {/* 方法内使用this bind  箭头函数 */}
            <Button onClick={() => this.getStringTime()}>change State</Button>
            {/* <button onClick={this.getStringTime.bind(this)}>change State</button> */}
            {/* 方法内未使用this */}
            <Button onClick={this.testWillUnmount}>trigger componentWillUnmount</Button>
        </div >
    }
    componentDidMount() {
        console.log('componentDidMount')
        this.getStringTime();
    }
    componentWillUnmount() {
        console.log('componentWillUnmount')
    }
    testWillUnmount(time = 1000) {
        setTimeout(() => {
            const element = <h1>componentWillUnmount doing...</h1>;
            render(element, document.getElementById('root'));
        }, time)
    }
    componentDidUpdate() {
        console.log('componentDidUpdate')
    }
    componentWillReceiveProps(props) {
        console.log('componentWillReceiveProps')
    }
    shouldComponentUpdate(props, state) {
        console.log('shouldComponentUpdate')
        return true
    }
    getStringTime() {
        this.setState({
            time: new Date().toLocaleTimeString()
        })
        // this.timer = setInterval(() => {
        //     this.setState({
        //         time: new Date().toLocaleTimeString()
        //     })
        // }, 1000)
    }
}
export default App