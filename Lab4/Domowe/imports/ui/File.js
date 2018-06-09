import React, { Component } from 'react';

// App component - represents the whole app
export default class File extends Component {
    constructor() {
        super();
    }

    componentWillMount() {
        this.setState({
            active: ""
        });
    }

    toggleActive = () => {
        if(this.state.active == "") {
            this.setState({active: "active"});
            this.props.toggleActive(this.props.index)
        } else {
            this.setState({active: ""});
            this.props.toggleActive(this.props.index)
        }
    }

    dblClick = () => {
        if(this.props.type != "file") this.props.dblClick(this.props.name);
    }

    renderFile = () => {
        return (
            <div onDoubleClick={this.dblClick} onClick={this.toggleActive} className={'col-sm-3 text-center file ' + this.state.active}>
                <img src="/images/file.png" width="50" height="50" />
                <p>{this.props.name}</p>
            </div>
        );
    }

    renderDir = () => {
        return (
            <div onDoubleClick={this.dblClick} onClick={this.toggleActive} className={'col-sm-3 text-center file ' + this.state.active}>
                <img src="/images/folder.png" width="50" height="50" />
                <p>{this.props.name}</p>
            </div>
        );
    }

    render() {
        if(this.props.type == 'file') {
            return (this.renderFile());
        } else {
            return (this.renderDir());
        }
    }
}