import React from 'react';
import { questionAjaxDataTableReload } from '../../const/util';
import Ratings from '../ratings';
import MAXIOS from '../../services';

export default class ApproveModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            userId: '',
            remarkText: '',
            dataOption: '',
            ajaxProcess: true,
            ratings: [
                {_id: 'type_1', name: 'Personality', value: 0},
                {_id: 'type_2', name: 'Problem Solving', value: 0},
                {_id: 'type_3', name: 'Subject knowledge', value: 0}
            ]
        };
    }

    componentWillReceiveProps(props) {
        const { userId, ajaxProcess, ratings, dataOption } = this.state;

        if(props.dataOption && props.dataOption != dataOption){
            this.setState({dataOption: props.dataOption});
        }

        if(props.userId != userId && props.dataOption && ajaxProcess) {
            this.setState({ajaxProcess: false});
            MAXIOS('post', 'analyzer/getvideobyid', {userId: props.userId}, null, resp => {
                const { code, message, data } = resp;
                if(code == 'devlabs_020'){
                    this.setState({
                        userId: props.userId,
                        dataOption: props.dataOption,
                        remarkText: unescape(data.remarkText),
                        ratings: (data.ratings && data.ratings.length) ? data.ratings : ratings
                    });
                } else {
                    Command: toastr["error"](message);
                }
                this.setState({ajaxProcess: true});
            });
        }
    }

    submit(e) {
        if((e.keyCode && e.keyCode != 13))
            return;
        const { userId, dataOption, remarkText, ratings } = this.state;
        MAXIOS('post', 'remarkVideos', { 
            userId: userId,
            remarkText: remarkText,
            isApproved: dataOption == '0',
            ratings: ratings
        }, null, data => {
            const { code, message } = data;
            if(code == 'devlabs_020'){
                this.setState({userId: '', dataOption: ''});
                $('#approveModal').modal('toggle');
                Command: toastr["success"]("submited successfull");
                questionAjaxDataTableReload();
            } else {
                Command: toastr["error"](message);
            }
        })
    }

    onRate(star, _id) {
        const { ratings } = this.state;
        var newRates = [];
        ratings.forEach((rate) => {
            if(_id == rate._id){
                rate.value = star;
            }
            newRates.push(rate);
        });
        this.setState({ratings: ratings});
    }
    
    render() {
        const { remarkText, ratings } = this.state;
        return (
            <div className="modal fade" id="approveModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Remark?</h5>
                            <button className="close" type="button" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div id="video-ratings" >
                                {
                                    ratings.map((rate, index) => 
                                        <div className="form-group" key={index}>
                                            <Ratings onChange={this.onRate.bind(this)} {...rate} />
                                        </div>
                                    )
                                }
                            </div>
                            <div className="form-group">
                                <input value={remarkText} onChange={(e) => this.setState({remarkText: e.target.value})} type="text" maxLength="50" onKeyUp={this.submit.bind(this)} className="form-control" placeholder="Enter Remark" />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" type="button" data-dismiss="modal">Cancel</button>
                            <a className="btn btn-primary" onClick={this.submit.bind(this)} href="#">Submit</a>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}