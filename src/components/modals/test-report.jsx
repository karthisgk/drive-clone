import React from 'react';
import MAXIOS from '../../services';

export default class TestReport extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            userId: '',
            ajaxProcess: false,
            playVideoTab: true,
            questionsTab: false,
            questions: [],
            videoUrl: ''
        };
    }

    videoPlayer = (url) => {
        return '\
        <video id="video-player" style="width: 100%;" controls name="media">\
                <source src="' + url + '" />\
        </video>';
    }

    getModal() {
        return $('#test-report-modal');
    }

    componentWillReceiveProps(props) {
        const { ajaxProcess } = this.state;
        const { userId } = props;
        if( userId != '' && !ajaxProcess && this.state.userId != userId ) {
            this.setState({userId, ajaxProcess: true});
            MAXIOS('post', 'analyzer/gettestreport', {userId}, null, resp => {
                const { code, message, data: { videoUrl, questions } } = resp;
                if( code == 'devlabs_020' ) {
                    this.setState({questions: questions, videoUrl: videoUrl});
                } else {
                    Command: toastr["error"](message);
                    this.getModal().modal('toggle');
                }
                this.setState({ajaxProcess: false});
            });
        }
    }

    submit(e) {

        if(e && e.preventDefault){
            e.preventDefault();
        }
    }
    
    render() {
        const { questionsTab, playVideoTab, videoUrl, questions } = this.state;
        return (
            <div className="modal fade" id="test-report-modal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <form className="modal-content" action="" onSubmit={this.submit.bind(this)}>
                        <div className="modal-header">
                            <h5 className="modal-title" id="q-modal-title">Test Report</h5>
                            <button className="close" type="button" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-lg-6 col-sm-12">
                                    <label>Questions asked:</label>
                                    <div className="questtion-list scrolable-content scrolable-bar">
                                        {
                                            questions.map((quest, index) => 
                                                <div key={index}>
                                                    {quest.content}
                                                </div>
                                            )
                                        }
                                    </div>
                                </div>
                                <div className="col-lg-6 col-sm-12" dangerouslySetInnerHTML={{__html: this.videoPlayer(videoUrl)}}>
                                </div>
                                <h3>{videoUrl}</h3>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        )
    }

}