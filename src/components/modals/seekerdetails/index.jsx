import React from 'react';
import { connect } from 'react-redux';
import './style.scss';
import { FormGroup } from 'reactstrap';

class RequestBatch extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            seeker: false
        }
    }

    componentWillReceiveProps(props){
        this.setState({seeker: props.seeker});
    }
    
    render() {
        const { seeker } = this.state;
        return (
            <div className="modal fade" id="seeker-detail-modal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="q-modal-title">Seeker Detail</h5>
                            <button className="close" type="button" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            {seeker ?
                            <div className="row">
                                <div className="col-lg-6 col-xs-12">
                                    <table className="table table-bordered table-responsive">
                                        <tbody>
                                        {
                                            Object.keys(seeker).map((key, i) => {
                                                if(key == 'location'){
                                                    return (
                                                        <tr key={i}>
                                                            <td>{key}</td>
                                                            <td>{seeker[key] && seeker[key].text ? seeker[key].text : 'null'}</td>
                                                        </tr>
                                                    )
                                                } else if(key == 'avatar'){
                                                    return (
                                                        <tr key={i}>
                                                            <td>{key}</td>
                                                            <td><img style={{width: '50px'}} src={seeker[key]} alt="avatar" /></td>
                                                        </tr>
                                                    )
                                                } else if(key == 'Gender'){
                                                    return (
                                                        <tr key={i}>
                                                            <td>{key}</td>
                                                            <td>{seeker[key] == 'm' ? 'Male' : 'Female'}</td>
                                                        </tr>
                                                    )
                                                } else if(key == 'tags'){
                                                    return (
                                                        <tr key={i}>
                                                            <td>{key}</td>
                                                            <td>{seeker[key] && seeker[key].length ? seeker[key].join(', ') : 'null'}</td>
                                                        </tr>
                                                    )
                                                } else if(key == 'resume'){
                                                    return (
                                                        <tr key={i}>
                                                            <td>{key}</td>
                                                            <td>{seeker[key] ? <a href={seeker[key]} target="_blank">click here</a> : 'null'}</td>
                                                        </tr>
                                                    )
                                                } else if(key == 'qualification'){
                                                    return null;
                                                } else {
                                                    return (
                                                        <tr key={i}>
                                                            <td>{key}</td>
                                                            <td>{typeof seeker[key] == "object" ? JSON.stringify(seeker[key]) : (seeker[key] ? seeker[key] : 'null')}</td>
                                                        </tr>
                                                    )
                                                }
                                            })
                                        }
                                        </tbody>
                                    </table> 
                                </div>
                                <div className="col-lg-6 col-xs-12">
                                        <h4 className="text-center">Qualifications</h4>
                                        {
                                            seeker.qualification && seeker.qualification.length ?
                                            <div className="qualification-list">
                                                {
                                                    seeker.qualification.map((q, i) => 
                                                        <div className="education" key={i}>
                                                            <FormGroup className="info">
                                                                <label>
                                                                    <strong>Course Name : <span className="values">{q.courseName.value}</span></strong>
                                                                    ({q.type.value}){', '}
                                                                </label> 
                                                                <label><strong>School / Clg / Univ: </strong><span className="values">{q.centerName.value},</span></label> 
                                                                <label><strong>Year Of Passing / Mark Obtained: </strong><span className="values">{q.yearOfPassing.value}</span>, { q.markObtained.value + (q.markType.value == 'percentage' ? '%' : (' '+q.markType.value.toUpperCase())) }</label> 
                                                            </FormGroup>
                                                        </div>
                                                    )
                                                }
                                            </div>
                                            : <span className="text-center">No Qualifications</span>
                                        }
                                </div>
                            </div>: null}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}

export default connect()(RequestBatch);