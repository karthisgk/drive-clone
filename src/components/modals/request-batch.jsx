import React from 'react';
import { connect, batch } from 'react-redux';
import { getAvailableBatchAmount } from '../../const/util';
import MAXIOS from '../../services';
import { questionAjaxDataTableReload } from '../../const/util';
const defaultBatchAmount = 1;

class RequestBatch extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            amount: props.amount
        }
    }

    submit(e) {
        if(e.preventDefault){
            e.preventDefault();
        }
        const { amount } =  this.state;
        MAXIOS('post', 'analyzer/requestbatch', { amount }, null, resp => {
            const { code, message } = resp;
            if(code == 'devlabs_020'){
                this.setState({amount: defaultBatchAmount});
                $('#request-batch-modal').modal('toggle');
                Command: toastr["success"]("submited successfull");
                questionAjaxDataTableReload();
                if(this.props.onSubmit) {
                    this.props.onSubmit();
                }
            } else {
                Command: toastr["error"](message);
            }
        });
    }

    availableAmount = getAvailableBatchAmount();
    
    render() {
        const { amount } = this.state;
        return (
            <div className="modal fade" id="request-batch-modal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <form className="modal-content" action="" onSubmit={this.submit.bind(this)}>
                        <div className="modal-header">
                            <h5 className="modal-title" id="q-modal-title">Request Batch</h5>
                            <button className="close" type="button" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <input type="hidden" id="questionId" />
                                <label>Batch:</label>
                                <select className="form-control" value={amount} onChange={(e) => this.setState({amount: e.target.value})}>
                                    {
                                        this.availableAmount.map((value, index) => 
                                            <option value={value} key={index}>{value}</option>
                                        )
                                    }
                                </select>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" type="button" data-dismiss="modal">Cancel</button>
                            <button className="btn btn-primary" type="submit" onClick={this.submit.bind(this)} href="#">Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }

}

export default connect((state) => {
    return {
        amount: state.batch ? parseInt(state.batch.amount) : defaultBatchAmount
    }
})(RequestBatch);