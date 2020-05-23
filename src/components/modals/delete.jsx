import React from 'react';

export default class DeleteModal extends React.Component {

    constructor(props) {
        super(props);
    }

    onClick(e){
        return;
    }
    
    render() {
        const { headText, infoText, btnText, btnAction } = this.props;
        return (
            <div className="modal fade" id="delete-modal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">{headText ? headText : 'Delete'}</h5>
                            <button className="close" type="button" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div className="modal-body">{infoText ? infoText : 'Are you sure, you want delete it?'}</div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" type="button" data-dismiss="modal">Cancel</button>
                            <a className="btn btn-primary" onClick={typeof btnAction == 'function' ? btnAction : this.onClick} href="#">{btnText ? btnText : 'Ok'}</a>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}