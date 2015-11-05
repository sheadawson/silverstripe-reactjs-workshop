import React from 'react';
import $ from 'jquery';
import EventComponent from './event-component';

class EventManagerComponent extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            events: []
        };
    }

    componentDidMount() {
        $.getJSON(this.props.source, (result) => {
            this.setState({
                events: result.events
            });
        })
    }

    render() {
        var events = this.state.events.map((event) => {
            var props = {
                title: event.title,
                date: event.date,
                description: event.description
            };

            return <EventComponent {...props} />
        });

        return (
            <div className='event-manager-component'>
                {events}
            </div>
        );
    }
}

EventManagerComponent.propTypes = {
    source: React.PropTypes.string.isRequired
}

export default EventManagerComponent;
