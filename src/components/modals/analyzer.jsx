import React from 'react';
import MAXIOS from '../../services';
import { connect } from 'react-redux';
class AnalyzerModal extends React.Component {

    constructor(props) {
        super(props);
        const { user, settings } = props;
        this.state = {
            _id: user._id,
            First_Name: user.First_Name,
            Last_Name: user.Last_Name,
            Email_Id: user.Email_Id,
            Mobile_Number: user.Mobile_Number,
            analyzerType: user.analyzerType ? user.analyzerType : '1',
            tags: (user.tags && user.tags.length) ? user.tags : [],
            password: '',
            cpassword: '',
            isAjaxProcessing: false,
            allTags: (settings && settings.tags.length) ?  settings.tags : []
        };
        if(settings && settings.tags.length) {
            this.select2InitEvent();
        }
    }

    componentWillReceiveProps(nextProps) {
        const { user, settings } = nextProps;
        if(this.state._id != user._id) {
            var newUser = {
                _id: user._id,
                First_Name: user.First_Name,
                Last_Name: user.Last_Name,
                Email_Id: user.Email_Id,
                Mobile_Number: user.Mobile_Number,
                analyzerType: user.analyzerType ? user.analyzerType : '1',
                tags: (user.tags && user.tags.length) ? user.tags : [],
                password: '',
                cpassword: ''
            };
            this.setState(newUser);
            setTimeout(()=> {
                if(window.select2) {
                    window.select2.val((user.tags && user.tags.length) ? user.tags : []).trigger('change');
                }
            }, 100);
        }
        if( settings){
            this.setState({allTags: settings.tags});
            this.select2InitEvent();
        }
    }

    select2InitEvent() {
        window.select2 = $("#analyzer-tags").select2();
        $("#analyzer-tags").on('select2:select', (e) => {
            var data = e.params.data;
            const { tags } = this.state;
            tags.push(data.id);
            this.setState({tags: tags});
        });
        $("#analyzer-tags").on('select2:close', (e) => {
            var data = e.params.originalSelect2Event.data;
            const { tags } = this.state;
            var foundIndex = tags.indexOf(data.id);
            if(foundIndex > -1){
                tags.splice(foundIndex,1);
                this.setState({tags: tags});
            }
        });
    }

    submit(e) {
        e.preventDefault();
        const {
            _id,
            First_Name,
            Last_Name,
            Email_Id,
            Mobile_Number,
            password,
            cpassword,
            isAjaxProcessing,
            analyzerType,
            tags
        } = this.state;

        if(!$('#analyzer-modal form').parsley().validate() || isAjaxProcessing){
            return;
        }

        var postData = {
            First_Name,
            Last_Name,
            Email_Id,
            Mobile_Number,
            tags,
            analyzerType,
            isActivated: 'true'
        };
        if(_id != '')
            postData.analyzerId = _id;
        
        if (password != '' && cpassword != '') {
            postData.password = password;
            postData.cpassword = cpassword;
        }
        this.setState({isAjaxProcessing: true});
        MAXIOS('post', (_id == '' ? 'createAnalyzer' : 'editAnalyzer'), postData, null, data => {
            const { code, message } = data;
            if(code == 'devlabs_020'){
                $('#analyzer-modal').modal('toggle');
                Command: toastr["success"]('submitted successfull');
            } else {
                Command: toastr["error"](message);
            }
            this.setState({isAjaxProcessing: false});
            if(_id != ''){
                postData._id = _id;
                this.props.onSuccess(postData);
            }
        })
    }
    
    render() {
        const { 
            _id,
            First_Name,
            Last_Name,
            Email_Id,
            Mobile_Number,
            password,
            cpassword,
            isAjaxProcessing,
            analyzerType,
            tags,
            allTags
        } = this.state;
        return (
            <div className="modal fade" id="analyzer-modal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <form className="modal-content" action="" onSubmit={this.submit.bind(this)}>
                        <div className="modal-header">
                            <h5 className="modal-title">Add Analyzer</h5>
                            <button className="close" type="button" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label>User ID:</label>
                                <input type="text" required className="form-control" placeholder="User ID" value={First_Name} onChange={(e) => this.setState({First_Name: e.target.value})} />
                            </div>

                            <div className="form-group">
                                <label>Fullname:</label>
                                <input type="text" className="form-control" placeholder="Fullname" value={Last_Name} onChange={(e) => this.setState({Last_Name: e.target.value})} />
                            </div>

                            <div className="form-group">
                                <label>Email:</label>
                                <input type="email" required className="form-control" placeholder="Email address" value={Email_Id} onChange={(e) => this.setState({Email_Id: e.target.value})} />
                            </div>

                            <div className="form-group">
                                <label>Mobile:</label>
                                <input type="text" className="form-control" placeholder="Mobile number" value={Mobile_Number} onChange={(e) => this.setState({Mobile_Number: e.target.value})} />
                            </div>

                            <div className="form-group">
                                <label>Analyzer Type:</label>
                                <select className="form-control" value={analyzerType} onChange={(e) => this.setState({analyzerType: e.target.value})}>
                                    <option value="1">Type1</option>
                                    <option value="2">Type2</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Password:</label>
                                <input type="password" required={_id == ''} id="mnew-password" className="form-control" placeholder="password" value={password} onChange={(e) => this.setState({password: e.target.value})} />
                            </div>

                            <div className="form-group">
                                <label>Retype password:</label>
                                <input type="password" required={_id == ''} data-parsley-equalto="#mnew-password" className="form-control" placeholder="retype password" value={cpassword} onChange={(e) => this.setState({cpassword: e.target.value})} />
                            </div>

                            <div className="form-group">
                                <label>Department:</label>
                                <select className="form-control" value={tags} onChange={(e) => this.setState({tags: e.target.value})} id="analyzer-tags" multiple="multiple">
                                    {
                                        allTags.map((tag, index) => 
                                            <option value={tag} key={index}>{tag}</option>
                                        )
                                    }
                                </select>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" type="button" data-dismiss="modal">Cancel</button>
                            <button className="btn btn-primary" disabled={isAjaxProcessing} type="submit" onClick={this.submit.bind(this)} href="#">Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }

}

export default connect((state, ownProps) => {
    return { settings: state.settings, ...ownProps };
})(AnalyzerModal);