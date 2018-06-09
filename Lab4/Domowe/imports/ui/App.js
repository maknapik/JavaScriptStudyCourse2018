import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor'

import File from './File.js';

import { Button, Input, Menu, Grid, Modal, Header } from 'semantic-ui-react';

// App component - represents the whole app
export default class App extends Component {
    constructor() {
        super();
    }
    componentWillMount() {
        this.setState({
            files1: [],
            path1: "/",
            files2: [],
            path2: "/"
        }, () => {
            Meteor.call('getFiles', this.state.path1, (err, result) => {
                if(!result) result = [];
                this.setState({files1: result});
                //console.log(this.state.files);
            });

            Meteor.call('getFiles', this.state.path2, (err, result) => {
                if(!result) result = [];
                this.setState({files2: result});
                //console.log(this.state.files);
            });
        });
    }

    componentDidMount() {
        this.refs.path1.inputRef.value = "/"
        this.refs.path2.inputRef.value = "/";
    }

    go1 = () => {
        this.setState({path1: this.refs.path1.inputRef.value});
        Meteor.call('getFiles', this.refs.path1.inputRef.value, (err, result) => {
            if(!result) result = [];
            this.setState({files1: result});
            //console.log(this.state.files);
        });
    }

    refresh1 = () => {
        Meteor.call('getFiles', this.state.path1, (err, result) => {
            if(!result) result = [];
            this.setState({files1: result});
            //console.log(this.state.files);
        });
    }

    back1 = () => {
        var path = this.state.path1;;
        if(path.charAt(path.length - 1) == '/') path = path.substr(0, path.length - 2);
        var i = path.lastIndexOf('/');
        path = path.substr(0, i + 1);
        if(path == '') path = '/';
        this.setState({path1: path});
        this.refs.path1.inputRef.value = path;
        Meteor.call('getFiles', path, (err, result) => {
            if(!result) result = [];
            this.setState({files1: result});
            //console.log(this.state.files);
        });
    }

    toggleActive1 = (i) => {
        var file = this.state.files1[i];
        if(file.active == 1) file.active = 0;
        else file.active = 1;
        var files = this.state.files1;
        files.splice(i, 1, file);
        this.setState({files1: files});
    }

    openFolder1 = (name) => {
        var path = "";
        if(this.state.path1 == '/') path = this.state.path1 + name;
        else path = this.state.path1 + '/' + name;
        this.setState({path1: path});
        this.refs.path1.inputRef.value = path;
        Meteor.call('getFiles', path, (err, result) => {
            if(!result) result = [];
            this.setState({files1: result});
            //console.log(this.state.files);
        });
    }

    renderFiles1 = () => {
        return this.state.files1.map((file, i) => (
            <Grid.Column key={file.name}><File dblClick={this.openFolder1} toggleActive={this.toggleActive1} index={i} type={file.type} name={file.name}/></Grid.Column>
        ));
    }

    go2 = () => {
        this.setState({path2: this.refs.path2.inputRef.value});
        Meteor.call('getFiles', this.refs.path2.inputRef.value, (err, result) => {
            if(!result) result = [];
            this.setState({files2: result});
            //console.log(this.state.files);
        });
    }

    refresh2 = () => {
        Meteor.call('getFiles', this.state.path2, (err, result) => {
            if(!result) result = [];
            this.setState({files2: result});
            //console.log(this.state.files);
        });
    }


    back2 = () => {
        var path = this.state.path2;
        if(path.charAt(path.length - 1) == '/') path = path.substr(0, path.length - 2);
        var i = path.lastIndexOf('/');
        path = path.substr(0, i + 1);
        if(path == '') path = '/';
        this.setState({path2: path});
        this.refs.path2.inputRef.value = path;
        Meteor.call('getFiles', path, (err, result) => {
            if(!result) result = [];
            this.setState({files2: result});
            //console.log(this.state.files);
        });
    }

    toggleActive2 = (i) => {
        var file = this.state.files2[i];
        if(file.active == 1) file.active = 0;
        else file.active = 1;
        var files = this.state.files2;
        files.splice(i, 1, file);
        this.setState({files2: files});
    }

    openFolder2 = (name) => {
        var path = "";
        if(this.state.path2 == '/') path = this.state.path2 + name;
        else path = this.state.path2 + '/' + name;
        this.setState({path2: path});
        this.refs.path2.inputRef.value = path;
        Meteor.call('getFiles', path, (err, result) => {
            if(!result) result = [];
            this.setState({files2: result});
            //console.log(this.state.files);
        });
    }

    renderFiles2 = () => {
        return this.state.files2.map((file, i) => (
            <Grid.Column key={file.name}><File dblClick={this.openFolder2} toggleActive={this.toggleActive2} key={file.name} index={i} type={file.type} name={file.name}/></Grid.Column>
        ));
    }

    copy1 = () => {
        this.state.files1.forEach((file) => {
            if(file.active == 1) {
                Meteor.call('copyFile', this.state.path1, this.state.path2, file.name);
                this.refresh2();
                return;
            }
        });
    }

    delete1 = () => {
        this.state.files1.forEach((file) => {
            if(file.active == 1) Meteor.call('deleteFile', this.state.path1, file.name);
        });
        this.refresh1();
    }

    rename1 = () => {
        this.state.files1.forEach((file) => {
            if(file.active == 1) {
                Meteor.call('renameFile', this.state.path1, file.name, this.refs.rename1.inputRef.value);
            }
        });
        this.refresh1();
    }

    copy2 = () => {
        this.state.files2.forEach((file) => {
            if(file.active == 1) {
                Meteor.call('copyFile', this.state.path2, this.state.path1, file.name);
                this.refresh1();
                return;
            }
        });
    }

    delete2 = () => {
        this.state.files2.forEach((file) => {
            if(file.active == 1) Meteor.call('deleteFile', this.state.path2, file.name);
        });
        this.refresh2();
    }

    rename2 = () => {
        this.state.files2.forEach((file) => {
            if(file.active == 1) Meteor.call('renameFile', this.state.path2, file.name, this.refs.rename2.inputRef.value);
        });
        this.refresh2();
    }

    render() {
        return (
            <div>
                <Grid columns='two' divided>
                    <Grid.Row>
                        <Grid.Column>
                            <Menu>
                                <Menu.Item>
                                    <Button color="blue" onClick={this.go1}>Go</Button>
                                    <Input ref="path1" placeholder="Path"/>
                                    <Button color="blue" onClick={this.back1}>Back</Button>
                                </Menu.Item>
                            </Menu>
                            <Menu>
                                <Menu.Item>
                                    <Button color="red" onClick={this.delete1}>Delete</Button>
                                </Menu.Item>
                                <Menu.Item>
                                    <Input ref="rename1" placeholder="Name"/>
                                    <Button color="blue" onClick={this.rename1}>Rename</Button>
                                </Menu.Item>
                                <Menu.Menu position='right'>
                                    <Menu.Item>
                                        <Button color="blue" onClick={this.copy1}>Copy -></Button>
                                    </Menu.Item>
                                </Menu.Menu>
                            </Menu>
                        </Grid.Column>
                        <Grid.Column>
                            <Menu>
                                <Menu.Item>
                                    <Button color="blue" onClick={this.go2}>Go</Button>
                                    <Input ref="path2" placeholder="Path"/>
                                    <Button color="blue" onClick={this.back2}>Back</Button>
                                </Menu.Item>
                            </Menu>
                            <Menu>
                                <Menu.Item>
                                    <Button color="blue" onClick={this.copy2}>&lt;- Copy</Button>
                                </Menu.Item>
                                <Menu.Menu position='right'>
                                    <Menu.Item>
                                        <Input ref="rename2" placeholder="Name"/>
                                        <Button color="blue" onClick={this.rename2}>Rename</Button>
                                    </Menu.Item>
                                    <Menu.Item>
                                        <Button color="red" onClick={this.delete2}>Delete</Button>
                                    </Menu.Item>
                                </Menu.Menu>

                            </Menu>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <Grid doubling columns="6" textAlign='center'>
                                {this.renderFiles1()}
                            </Grid>
                        </Grid.Column>
                        <Grid.Column>
                            <Grid doubling columns="6" textAlign='center'>
                                {this.renderFiles2()}
                            </Grid>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
        );
    }
}