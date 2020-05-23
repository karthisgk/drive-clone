import React from 'react';
import { Alert } from 'reactstrap';

class Notifier extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            visible: props.show
        };

        this.onDismiss = this.onDismiss.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if(this.state.visible !== nextProps.show) {
            this.setState({visible: nextProps.show});
        }
    }

    onDismiss() {
        this.setState({ visible: false });
    }

    render() {
        return (
            <Alert className="mt-4 mb-4" color={this.props.color} isOpen={this.state.visible} toggle={this.onDismiss}>
                {this.props.message}
            </Alert>
        );
    }
}

export default Notifier;