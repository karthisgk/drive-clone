import React from 'react';
import './style.scss';
import { PROVIDER } from '../../const/usertypes';
import MAXIOS from '../../services';
import { getPassFields } from '../../const/util';
export default class Package extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            ...props.package,
            nameEdit: false,
            amountEdit: false,
            creditPointsEdit: false,
            jobPostingsEdit: false,
            videoAccessEdit: false,
            planDurationEdit: false,
            isAjaxProcessing: false
        };
    }

    apiCall = () => {
        const data = getPassFields(["_id","name", "creditPoints", "amount", "planDuration", "jobPostings", "videoAccess", "videoAccessLength"], {...this.state});
        if(this.state.isAjaxProcessing) {
            return;
        }
        var request = {_id: data._id, name: data.name};
        Object.keys(data).forEach(key => {
            if(["creditPoints", "planDuration", "jobPostings", "videoAccess", "videoAccessLength"].indexOf(key) > -1){
                request[key] = typeof data[key] != 'undefined' ? parseInt(data[key]) : this.props.package[key];
            }
        });
        request.amount = parseFloat(data.amount).toFixed(2);
        this.setState({isAjaxProcessing: true});
        MAXIOS('post','admin/editpackage', request, null, resp => {
            const { code, message } = resp;
            this.setState({isAjaxProcessing: false});
            if(code == 'devlabs_020'){
                Command: toastr["success"]('saved changes');
            } else {
                Command: toastr["error"](message);
            }
        });
    }

    nameOnChange(e) {
        if(e.keyCode){
            if(e.keyCode == 27){
                this.setState({nameEdit: false});
            }
            else if(e.keyCode == 13){
                this.setState({nameEdit: false});
                this.apiCall();
            }
        }else{
            this.setState({name: e.target.value});
        }
    }

    amountOnChange(e) {
        if(e.keyCode){
            if(e.keyCode == 27){
                this.setState({amountEdit: false, amount: parseFloat(this.state.amount).toFixed(2)});
            }
            else if(e.keyCode == 13){
                this.setState({amountEdit: false, amount: parseFloat(this.state.amount).toFixed(2)});
                this.apiCall();
            }
        }else{
            this.setState({amount: e.target.value == '' ? 0 : parseInt(e.target.value)});
        }
    }

    creditPointsOnChange(e) {
        if(e.keyCode){
            if(e.keyCode == 27){
                this.setState({creditPointsEdit: false});
            }
            else if(e.keyCode == 13){
                this.setState({creditPointsEdit: false});
                this.apiCall();
            }
        }else{
            this.setState({creditPoints: e.target.value == '' ? 0 : parseInt(e.target.value)});
        }
    } 

    jobPostingsOnChange(e) {
        if(e.keyCode){
            if(e.keyCode == 27){
                this.setState({jobPostingsEdit: false});
            }
            else if(e.keyCode == 13){
                this.setState({jobPostingsEdit: false});
                this.apiCall();
            }
        }else{
            this.setState({jobPostings: e.target.value == '' ? 0 : parseInt(e.target.value)});
        }
    }

    videoAccessOnChange(e) {
        if(e.keyCode){
            if(e.keyCode == 27){
                this.setState({videoAccessEdit: false});
            }
            else if(e.keyCode == 13){
                this.setState({videoAccessEdit: false});
                this.apiCall();
            }
        }else{
            this.setState({videoAccess: e.target.value == '' ? 0 : parseInt(e.target.value)});
        }
    }

    videoAccessLengthOnChange(e) {
        if(e.keyCode){
            if(e.keyCode == 27){
                this.setState({videoAccessEdit: false});
            }
            else if(e.keyCode == 13){
                this.setState({videoAccessEdit: false});
                this.apiCall();
            }
        }else{
            this.setState({videoAccessLength: e.target.value == '' ? 0 : parseInt(e.target.value)});
        }
    }

    planDurationOnChange(e) {
        if(e.keyCode){
            if(e.keyCode == 27){
                this.setState({planDurationEdit: false});
            }
            else if(e.keyCode == 13){
                this.setState({planDurationEdit: false});
                this.apiCall();
            }
        }else{
            this.setState({planDuration: e.target.value == '' ? 0 : parseInt(e.target.value)});
        }
    }

    planDurationText(planDuration){
        if(parseInt(planDuration / 12) == 0){
            return planDuration + " month" + (planDuration != 1 ? "s" : "");
        }
        else {
            var month = (planDuration % 12);
            var year = parseInt(planDuration / 12);
            return  year + " year " + (month != 0 ? month + " month" + (month != 1 ? "s" : "") : ""); 
        }
    }

    videoUI(){
        const { videoAccess, videoAccessLength  } = this.state;
        return (
            <div>
                <input type="number" onChange={this.videoAccessOnChange.bind(this)} value={videoAccess} onKeyUp={this.videoAccessOnChange.bind(this)} className="form-control" />
                <input type="number" onChange={this.videoAccessLengthOnChange.bind(this)} value={videoAccessLength} onKeyUp={this.videoAccessOnChange.bind(this)} className="form-control" />
            </div>
        )
    }
        
    render() {
        const {
            amount, name, creditPoints, singleContact, _id, jobPostings, planDuration, videoAccess, userType, videoAccessLength,
            nameEdit,
            amountEdit,
            creditPointsEdit,
            jobPostingsEdit,
            videoAccessEdit,
            planDurationEdit
        } = this.state;
        return(
            <div className={"span3 pack "} id={_id} >
                
                    <div className="well">
                        <div className="p-name" onDoubleClick={(e) => this.setState({nameEdit: true})}>
                            {
                                !nameEdit ?
                                <h6>{name}</h6> :
                                <input type="text" className="form-control" value={name} onChange={this.nameOnChange.bind(this)} onKeyUp={this.nameOnChange.bind(this)} />
                            }
                        </div>
                        <div className="p-rate" onDoubleClick={(e) => this.setState({amountEdit: true, amount: parseInt(amount)})}>
                            {
                                !amountEdit ? 
                                "₹" + amount + (singleContact ? " Per Credit Point" : "") :
                                <input type="number" className="form-control" value={amount} onChange={this.amountOnChange.bind(this)} onKeyUp={this.amountOnChange.bind(this)} />
                            }
                        </div>
                        <div className="plan-feature"> 
                            <ul>
                                { 
                                    !singleContact && userType == PROVIDER ? 
                                    <li onDoubleClick={(e) => this.setState({creditPointsEdit: true})} >{!creditPointsEdit ? creditPoints + " Credit Points" : <input type="number" onChange={this.creditPointsOnChange.bind(this)} value={creditPoints} onKeyUp={this.creditPointsOnChange.bind(this)} className="form-control" />}</li> :
                                    <li>-</li>
                                }
                                {!singleContact && userType == PROVIDER ? 
                                <li onDoubleClick={(e) => this.setState({jobPostingsEdit: true})} >{!jobPostingsEdit ? jobPostings + " Job Posting’s" : <input type="number" onChange={this.jobPostingsOnChange.bind(this)} value={jobPostings} onKeyUp={this.jobPostingsOnChange.bind(this)} className="form-control" />}</li> : 
                                <li>-</li>
                                }
                                {typeof videoAccess == 'number' && !singleContact && userType == PROVIDER ? 
                                <li onDoubleClick={(e) => this.setState({videoAccessEdit: true})} >{ !videoAccessEdit ? (videoAccess != 0 && videoAccessLength ? (videoAccess + " Video Access " + ( videoAccessLength % 7 == 0 ? videoAccessLength / 7 + " weak" : videoAccessLength + " days")  ) : "Unlimited Video Access") : this.videoUI() }</li> :
                                <li>-</li>}
                                { !singleContact && this.state.forSignUp && userType == PROVIDER ? 
                                <li onDoubleClick={(e) => this.setState({planDurationEdit: true})} >{ !planDurationEdit ? this.planDurationText(planDuration) : <div> <input type="number" onChange={this.planDurationOnChange.bind(this)} value={planDuration} onKeyUp={this.planDurationOnChange.bind(this)} className="form-control" /> <span>months</span> </div> }</li> :
                                <li>-</li>}
                            </ul>
                        </div>
                    </div>
                
            </div>
        )
    }
}