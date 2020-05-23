import React from 'react';
import cookie from 'react-cookies';
import firebase from 'firebase';
import 'firebase/database';
import './style.scss';
import { getCrypto, current_time, getUrlParams, humanFileSize, getRootUrl, getUnique } from '../../util';
import { DRIVE_BASE_PATH } from '../../util/const';
import { Redirect } from 'react-router';
export default class AdminHome extends React.Component {
    constructor(props) {
        super(props);
        const _id = getUrlParams('path') ? getUrlParams('path') : ''; 
        let dirName = cookie.load('loc-path');
        this.state = { dirs: [], _id: DRIVE_BASE_PATH, pushPath: false, dirName: dirName ? dirName : '' };
    }

    UNSAFE_componentWillMount(){
        const _id = getUrlParams('path') ? getUrlParams('path') : ''; 
        if(_id == ''){
            this.initDirs();
        } else {
            this.setState({_id}, this.initDirs.bind(this));
        }
    }

    getLocationPath(){
        const { _id, dirName } = this.state;
        let ids = _id.split('/');
        let dirNames = dirName.split('/');
        if(ids.length == dirNames.length) {
            return ids.map((id, i) => {
                if(id == DRIVE_BASE_PATH){
                    return (
                        <span key={i}>
                            <a href="#" data-dir={DRIVE_BASE_PATH} data-href={DRIVE_BASE_PATH} onClick={this.gotoLink.bind(this)}>{dirNames[i]}</a>
                            <span>{' > '}</span>
                        </span>
                    )
                }
                else {
                    var path = _id.substring(0, _id.search(id));
                    path = path + id;
                    var dirN = dirName.substring(0, dirName.search(dirNames[i]));
                    dirN = dirN + dirNames[i];
                    return (
                        <span key={i}>
                            <a href="#" data-dir={dirN} data-href={path} data-id={id} onClick={this.gotoLink.bind(this)}>{dirNames[i]}</a>
                            <span>{' > '}</span>
                        </span>
                    )
                }
            })
        } else {
            return (<a href={DRIVE_BASE_PATH} onClick={this.gotoLink.bind(this)}>{DRIVE_BASE_PATH}</a>)
        }
    }

    gotoLink(e){
        if(e && e.preventDefault) e.preventDefault();
        let path = $(e.target).attr('data-href');
        if(path == DRIVE_BASE_PATH){
            location.href = getRootUrl() + path;
        }else {
            let _id = $(e.target).attr('data-id');
            let dirName = $(e.target).attr('data-dir');
            this.setPushPath(path, _id);
            if(typeof dirName == 'string' && dirName)
                setTimeout(() => {
                    this.setState({dirName})
                }, 1000);
        }
    }

    initDirs() {
        let ref = firebase.database().ref(this.state._id);
        ref.on('child_changed', data => {
            let dir = data.val();
            const { dirs } = this.state;
            dirs.forEach((d, k) => {
                if(d._id == dir._id){
                    dirs[k] = dir;
                }
            });
            this.setState({dirs});
        });
        ref.on('child_removed', data => {
            let dir = data.val();
            const { dirs } = this.state;
            this.setState({dirs: dirs.filter(d => d._id != dir._id)});
        })
        ref.orderByChild('name').once('value', (snapchat) => {
            const { dirs } = this.state;
            if(snapchat.length){
                snapchat.forEach(dir => {
                    dirs.push(dir.val())
                });
            } else {
                let datas = snapchat.val();
                let dn = typeof datas.name == 'undefined' ? DRIVE_BASE_PATH : datas.name;
                var dirName = this.state.dirName != '' ? (this.state.dirName + '/') : '';
                let locPath = cookie.load('loc-path');
                dirName = dirName.replace("/" + dn, "");
                dirName = locPath == '' ? dn : dirName + dn;
                if(!getUrlParams('path')){
                    dirName = DRIVE_BASE_PATH;
                }
                this.setState({dirName: dirName});
                cookie.save('loc-path', dirName);
                if(datas != null) {
                    Object.keys(datas).forEach(key => {
                        if(typeof datas[key] == 'object')
                            dirs.push(datas[key]);
                    });
                }
            }
            this.setState({dirs});
            ref.on('child_added', (data) => {
                const { dirs } = this.state;
                let ids = dirs.map(d => d._id);
                let dir = data.val();
                if(typeof dir == 'object' && ids.indexOf(dir._id) == -1){
                    dirs.push({...dir, isEdit: dir.type == 'dir'});
                    this.setState({dirs});
                }
            })
        });
    }

    componentDidMount(){
        $("#context-menu a").on("click", (e) => {
            if(e && e.preventDefault) e.preventDefault();
            let $this = e.target;
            let _id = $($this).parent().attr('data-id');
            $($this).parent().removeClass("show").hide();
            $($this).parent().attr('data-id', '');
            if(_id && $($this).attr('data-action') == 'delete'){
                let fref = firebase.database().ref(this.state._id + '/' + _id);
                fref.once('value', st => {
                    st = st.val();
                    if(st.type == 'file' && /^file_/.test(_id)) {
                        firebase.storage().ref(st.file_location).delete();
                    }
                    fref.remove();
                })
            }
            else if(_id && $($this).attr('data-action') == 'download'){
                let fref = firebase.database().ref(this.state._id + '/' + _id);
                fref.once('value', st => {
                    st = st.val();
                    if(st.type == 'file' && /^file_/.test(_id)) {
                        firebase.storage().ref(st.file_location).getDownloadURL().then(function(url) {
                            (() => {
                                var link = document.createElement("a");
                                var targetFile = url;
                                link.target = '_blank';
                                link.download = true;
                                link.href = targetFile;
                                link.click();  
                                var xhr = new XMLHttpRequest();
                                xhr.responseType = 'blob';
                                xhr.onload = function(event) {
                                    var blob = xhr.response;
                                };
                                xhr.open('GET', url);
                                xhr.send();
                            })();
                        }).catch(function(error) {
                            console.log(error);
                            Command: toastr["error"](error);
                        });
                    }
                    else  {
                        Command: toastr["error"]('folder can\'t download');
                    }
                })
            }
            else if(_id && $($this).attr('data-action') == 'rename')
                this.renameDir(_id);
        });
        $('.Main-Comp *').click(() => {
            $("#context-menu").removeClass("show").hide();
            $("#context-menu").attr('data-id', '');
        })
    }

    contextMenu(e, _id){
        if(e && e.preventDefault) e.preventDefault();
        var top = e.pageY;
        var left = e.pageX;
        $("#context-menu").css({
            display: "block",
            top: top,
            left: left
        }).addClass("show");
        $('#context-menu').attr('data-id', _id);
        return false; 
    }

    createFolder(e){
        if(e && e.preventDefault) e.preventDefault();
        const _id = 'dir_' + (this.state.dirs.length + 1) + getCrypto(8);
        let newFolder = {
            _id,
            type: 'dir',
            lastModified: current_time(),
            name: 'untiled',
            path: this.state._id + '/'
        }
        firebase.database().ref(this.state._id+'/' + newFolder._id).set(newFolder);
    }

    uploadFiles(e){
        if(e && e.preventDefault) e.preventDefault();
        if( e.target.files && e.target.files.length) {
            for(var i = 0; i < e.target.files.length; i++){
                let file = e.target.files[i];
                const _id = 'file_' + (this.state.dirs.length + 1) + getCrypto(8);
                let fileName = file.name;
                let loc = '/'+DRIVE_BASE_PATH+'/' + fileName;
                let newFolder = {
                    _id,
                    type: 'file',
                    file_location: loc,
                    size: file.size,
                    lastModified: current_time(),
                    name: fileName,
                    path: /\/$/.test(this.state._id) ? this.state._id : (this.state._id + '/')
                }
                var task = firebase.storage().ref(loc).put(file);
                task.on('state_changed', (snapshot) => {
                    var p = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    //progress.val(p);
                }, (error) => {}, () => {
                    firebase.database().ref(this.state._id+'/' + newFolder._id).set(newFolder);
                });
            }
        }
    }

    renameDir(_id){
        const { dirs } = this.state;
        dirs.forEach((d, k) => {
            if(d._id == _id){
                dirs[k].isEdit = true;
            }
        });
        this.setState({dirs});
    }

    onChangeName(e, _id) {
        if(e.keyCode && e.keyCode == 13)
            this.submitRename(_id);
        if(!e.keyCode){
            const { dirs } = this.state;
            dirs.forEach((d, k) => {
                if(d._id == _id){
                    dirs[k].name = e.target.value;
                }
            });
            this.setState({dirs});
        }
    }

    submitRename(_id) {
        let stateDir = this.state.dirs.filter(d => d._id == _id);
        let name = stateDir.length ? stateDir[0].name : '';
        if(!name)return;
        console.log(name);
        setTimeout(() => {
            let ref = firebase.database().ref(this.state._id+'/' + _id);
            ref.once('value', (data) => {
                let dir = data.val();
                dir.name = name;
                dir.lastModified = current_time();
                ref.update(dir);
            });
        }, 500);
    }

    setPushPath(path,_id){
        if(!/^dir_/.test(_id))return;
        history.pushState({page: 1}, "my_drive", "?path=" + path);
        this.setState({_id: path, dirs: []}, this.initDirs.bind(this));
    }

    render() {
        const { dirs,pushPath } = this.state;
        if(pushPath){
            return (<Redirect to={"/" + DRIVE_BASE_PATH + "?path=" +pushPath} />)
        }
        return (
            <div className="container-fluid">
                <input type="file" multiple={true} id="file-uploader" onChange={this.uploadFiles.bind(this)} />
                <div className="d-sm-flex align-items-center justify-content-between mb-4">
                    <h1 className="h3 mb-0 text-gray-800">My Drive</h1>
                    <a href="#" onClick={this.createFolder.bind(this)} className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"><i className="fas fa-plus fa-sm text-white-50"></i> Create Folder</a>
                    <a href="#" onClick={(e) => $('#file-uploader').click()} className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"><i className="fas fa-plus fa-sm text-white-50"></i> Upload Files</a>
                </div>

                <div className="d-sm-flex align-items-center justify-content-between mb-4">
                    <h1 className="h3 mb-0 text-gray-800">
                        {this.getLocationPath()}
                    </h1>
                </div>

                <div className="col-sm-12">

                    <div className="card shadow mb-4">
                        <div className="card-header py-3">
                            <div className="drive-header">
                                <div className="row">
                                    <div className="col-sm-6"><b>Name</b></div>
                                    <div className="col-sm-3"><b>Last Modified</b></div>
                                    <div className="col-sm-3"><b>Size</b></div>
                                </div>
                            </div>
                        </div>
                        <div className="card-body">
                            
                            <div className="drive-body">
                                {
                                    dirs.map((dir, index) => {
                                        return (
                                            <div key={index} onDoubleClick={(e) => this.setPushPath(dir.path + dir._id, dir._id)} onContextMenu={(e) => this.contextMenu(e, dir._id)} className="row drive-row">
                                                <div className="col-sm-6">
                                                    {!dir.isEdit ? <span>{dir.name}</span> : <input className="form-control" onChange={(e) => this.onChangeName(e, dir._id)} onKeyUp={(e) => this.onChangeName(e, dir._id)} value={dir.name} />}
                                                </div>
                                                <div className="col-sm-3"><span>{dir.lastModified}</span></div>
                                                <div className="col-sm-3"><span>{dir.type == 'dir' ? '--' : humanFileSize(dir.size)}</span></div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}