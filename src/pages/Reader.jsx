import React, { Component } from 'react';

import { Layout, Menu, Button, message } from 'antd';
const { Header, Sider, Content } = Layout;


let throttle = function (func, delay = 500) {
    var timer = null;
    return function () {
        var args = arguments;
        if (!timer) {
            timer = setTimeout(() => {
                func.apply(this, args);
                timer = null;
            }, delay);
        }
    }
}

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            list: [],
            article: [],
            current: '0',
            voiceIndex: 0,
            voiceState: 0,
            isPlay: false,
            isPause: false
        }
        Object.assign(this, {
            voice: null,
            pageSize: 20,
            regExp: /第([一二三四五六七八九十零百千万]|\d){1,10}章\s*[\u4e00-\u9fa5]*/,
        })
        this.initData()
    }
    initData = () => {
        Object.assign(this, {
            list: [],
            total: 0,
            size: 100,
            loadLength: 20,
            str: `第一章 秋风秋雨
            t。哈。嘿
            第2章 秋风秋雨
            test2
            第十3章 秋风秋雨
            test3`
        })
    }
    componentDidMount() {
        console.log(window.speechSynthesis)
        this.formatStr()
        this.formatArticle()
    }
    render() {
        return <Layout style={{ height: '100%' }}>
            <Header style={{ background: '#fff', padding: 0 }}>
                <input type="file" accept="text/plain" onChange={this.importTxt} />
                <Button type="primary" onClick={this.loadMore}>加载更多</Button>
                <Button type="primary" onClick={this.control.bind(this, true)}>{this.state.isPlay ? 'stop' : 'play'}</Button>
                <Button disabled={!this.state.isPlay} type="primary" onClick={this.control.bind(this, false)}>{this.state.isPause ? '继续' : '暂停'}</Button>
                <Button type="primary" onClick={this.test}>test</Button>
            </Header>
            <Layout>
                <Sider style={{ overflow: 'auto' }}>
                    <Menu theme="dark" mode="inline" selectedKeys={[this.state.current]} onClick={this.changeMenu}>
                        {this.state.list.map((v, i) => <Menu.Item key={i}>{v.title}
                        </Menu.Item>)}
                    </Menu>
                </Sider>
                <Content style={{ padding: '20px' }}>
                    {
                        this.state.article.map((v, i) => <div onClick={this.changeVoiceLine.bind(this, i)} style={{ padding: '2px 0', color: i === this.state.voiceIndex ? '#00aaee' : '' }} key={i}>{v}</div>)
                    }
                </Content>
            </Layout>
        </Layout>
    }
    test = () => {

        var synth = window.speechSynthesis;

        var utterance1 = new SpeechSynthesisUtterance('How about we say this now? This is quite a long sentence to say.');
        var utterance2 = new SpeechSynthesisUtterance('We should say another sentence too, just to be on the safe side.');

        synth.speak(utterance1);
        synth.speak(utterance2);
        setTimeout(() => {
            console.warn('pause')
            synth.pause(); // pauses utterances being spoken
            setTimeout(() => {
                console.warn('resume')
                synth.resume() // resumes speaking
            }, 2000)
        }, 1000)

    }
    pauseVoice = () => {
        let { voice } = this
        voice.pause()
        console.log(voice)
    }
    continueVoice = () => {
        let { voice } = this
        voice.resume();
        console.log(voice)
    }
    changeVoiceLine = (voiceIndex) => {
        this.setState({
            voiceIndex
        })
    }
    stopVoice = () => {
        this.voice.end()
    }
    control = (play = true) => {
        let { isPlay, isPause } = this.state,
            state = {}
        if (play) {
            isPlay ? this.stopVoice() : this.playVoice()
            state = {
                isPlay: !isPlay
            }
        } else {
            isPause ? this.continueVoice() : this.pauseVoice()
            state = {
                isPause: !isPause
            }
        }
        this.setState(state)
    }
    playVoice = () => {
        console.log('playVoice')
        if (!('speechSynthesis' in window))
            return message.error("speechSynthesis isn't supported.")
        let { article, voiceIndex } = this.state;
        if (article.length === 0)
            return message.warning('无内容')

        let voice = window.speechSynthesis
        let read = () => {
            let voiceItem = new SpeechSynthesisUtterance(article[voiceIndex])
            Object.assign(voiceItem, {
                onstart: () => {
                    console.log('onstart')
                },
                onpause: () => {
                    console.log('onpause')
                },
                onresume: () => {
                    console.log('onresume')
                },
                onend: async () => {
                    console.log('onend')
                    // 下一句
                    if (voiceIndex < article.length - 1) {
                        voiceIndex++
                        this.changeVoiceLine(voiceIndex)
                        return read()
                    }
                    // 下一章
                    let { current, list } = this.state
                    if (list.length - 1 === Number(current)) {
                        message.warning('无更多内容')
                        this.setState({
                            isPlay: false
                        })
                        return;
                    }
                    await this.changeMenu({ key: ++current })
                    this.playVoice()
                }
            })
            voice.speak(voiceItem);
        }
        this.voice = voice

        read()
    }
    changeMenu = ({ key }) => {
        let state = {
            current: String(key)
        }
        if (this.state.voiceIndex > 0)
            state.voiceIndex = 0
        this.setState(state)
        this.formatArticle(key)
    }
    formatArticle = (i = 0) => {
        console.log(i)
        let { list } = this,
            article = list[i].article.split('。')
        this.setState({
            article
        })
    }
    loadMore = () => {
        this.loadLength += this.size
        this.formatStr()
    }
    importTxt = (e) => {
        let reader = new FileReader(),
            file = e.target.files[0];
        reader.readAsText(file, "gb2312");
        console.warn('importTxt')
        reader.onload = () => {
            console.warn('reader.onload')
            this.initData()
            this.formatStr(reader.result, true);
        };
    }
    formatStr = (str = this.str, isImport = false) => {
        let { list } = this
        let match = str.match(this.regExp);
        let setData = async (list, str) => {
            // console.log(list)
            this.total++
            this.str = str
            this.list = list
            await this.setState({
                list
            })
            if (isImport)
                this.changeMenu({ key: '0' })
        }
        if (match === null) {
            console.warn('null')
            list.push({
                title: str,
                article: str
            });
            setData(list, str)
            return;
        }
        let index = match.index + match[0].length;
        let title = str.slice(match.index, index);
        let res = str.slice(index);
        let matchArticle = res.match(this.regExp),
            article = "";
        if (matchArticle) {
            article = res.slice(0, matchArticle.index);
            list.push({
                title,
                article
            });
            setData(list, str)
            if (this.total < this.loadLength)
                window.requestAnimationFrame(this.formatStr.bind(this, res, false));
        } else {
            article = res;
            list.push({
                title,
                article
            });
            setData(list, str)
        }
    }
}
export default App