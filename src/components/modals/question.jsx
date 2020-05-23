import React from 'react';
import { connect } from 'react-redux';
import { questionAjaxDataTableReload } from '../../const/util';
import MAXIOS from '../../services';

class QuestionModal extends React.Component {

    constructor(props) {
        super(props);
        window.isAjaxProcessing = false;
        const { question } = props;
        this.state = {
            ...question
        }
    }

    componentWillReceiveProps(props) {
        const { _id } = this.state;
        const { question } = props;
        if(_id != question._id) {
            this.setState({...question});
        }
    }

    submit(e) {

        if(e && e.preventDefault){
            e.preventDefault();
        }
        if(!$('#question-modal form').parsley().validate() || isAjaxProcessing){
            return;
        }
        const { _id, content, tags } = this.state;
        isAjaxProcessing = true;
        MAXIOS('post', 'modQuestions', { questionId: _id, content, tags }, null, response => {
            const { code, message } = response;
            isAjaxProcessing = false;
            if(code == 'devlabs_020'){
                Command: toastr["success"]("submited successfull");
                $('#question-modal').modal('toggle');
                questionAjaxDataTableReload();
            } else {
                Command: toastr["error"](message);
            }
        })
    }
    
    render() {
        const { _id, content, tags, modalTitle } = this.state;
        const { allTags } = this.props;
        return (
            <div className="modal fade" id="question-modal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <form className="modal-content" action="" onSubmit={this.submit.bind(this)}>
                        <div className="modal-header">
                            <h5 className="modal-title" id="q-modal-title">{modalTitle}</h5>
                            <button className="close" type="button" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <input type="hidden" id="questionId" value={_id} onChange={(e)=> this.setState({_id: e.target.value})} />
                                <label>Question:</label>
                                <textarea id="question-content" value={content} onChange={(e)=> this.setState({content: e.target.value})} required className="form-control" placeholder="Enter question" ></textarea>
                            </div>

                            <div className="form-group">
                                <label>Category: </label>
                                <select className="form-control" value={tags} onChange={(e) => this.setState({tags: e.target.value})} required>
                                    <option value="" hidden>select category</option>
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
                            <button className="btn btn-primary" type="submit" onClick={this.submit.bind(this)} href="#">Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }

}

export default connect((state) => {
    const { settings } = state;
    return {
        question: state.question.data,
        allTags: settings.categories && settings.categories.length ? settings.categories : []
    }
})(QuestionModal);