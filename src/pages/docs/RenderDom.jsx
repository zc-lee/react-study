// renderDom 

// const element = <h1>Hello, world</h1>;
// ReactDOM.render(element, document.getElementById('root'));

// function 方法

// import React from 'react';
// export default () => {
//   return <h1>Dom</h1>
// }

// class 类

import React, { Component } from 'react';
class App extends Component {
    render() {
        return <h1>Dom</h1>
    }
}
export default App