import React from 'react';
import './style.scss';

export default class Ratings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.value ? parseInt(props.value) : 0
        }
    }

    componentDidMount(){
        if(!this.props._id){
            return;
        }
        const { value } = this.state;
        if(value != 0) {
            $('.rating-stars ul#'+this.props._id + ' li.star[data-value="'+value+'"]').click();
        } else {
            $('.rating-stars ul#'+this.props._id + ' li.star').removeClass('hover');
        }
    }

    componentWillReceiveProps(props){
        if(props.value && this.state.value != parseInt(props.value)){
            const value = parseInt(props.value);
            this.setState({value: value});
            if(value != 0) {
                $('.rating-stars ul#'+this.props._id + ' li.star[data-value="'+value+'"]').click();
            } else {
                $('.rating-stars ul#'+this.props._id + ' li.star').removeClass('hover');
            }
        }
    }

    hover(e) {
        const ele = e.target;
        var onStar = parseInt(ele.getAttribute('data-value'));
        this.props.onChange(onStar, this.props._id);
        this.setState({value: onStar});
        $(ele).parent().closest('.rating-stars ul').children('li.star').each((e, li) => {
            if (e < onStar) {
                if(onStar == 1 && $(li).hasClass('hover'))
                    $(li).removeClass('hover');
                else
                    $(li).addClass('hover');
            }
            else {
                $(li).removeClass('hover');
            }
            
        });
    }

    render() {
        return (
            <div className="row" style={{marginRight: 0, marginLeft: 0}}>
                <div className="pull-left">
                    <label>{this.props.name ? this.props.name : 'Rate this'}:</label>
                </div>
                <div className='rating-stars pull-right'>
                    <ul id={this.props._id ? this.props._id : 'stars'}>
                        {
                            [1,2,3,4,5].map((value) =>
                                <li className='star' onClick={this.hover.bind(this)} data-value={value} key={value}>
                                    <i data-value={value} className='fa fa-star fa-fw'></i>
                                </li>
                            )
                        }
                    </ul>
                </div>
            </div>
            
        );
    }
}