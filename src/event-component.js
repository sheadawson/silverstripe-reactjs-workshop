import React from 'react';

class EventComponent extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className='event-component'>
                <h2>{this.props.title}</h2>
                <p>Date: {this.props.date}</p>
                <p>{this.props.description}</p>
            </div>
        );
    }
}

EventComponent.propTypes = {
    title: React.PropTypes.string.isRequired,
    date: React.PropTypes.string.isRequired,
    description: React.PropTypes.string.isRequired
}

export default EventComponent;
