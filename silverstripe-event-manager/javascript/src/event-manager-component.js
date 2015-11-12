import React from 'react';
import $ from 'jquery';
import SortComponent from './sort-component';
import EventComponent from './event-component';

class EventManagerComponent extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            events: [],
            sortOrder: 'title'
        };

        this.updateSortOrder = this.updateSortOrder.bind(this);
    }

    componentDidMount() {
        $.getJSON(this.props.source, this.handleNewEventData.bind(this));
    }

    render() {
        var sortComponentProps = {
            options: ['title', 'date'],
            value: this.state.sortOrder,
            updateSortOrder: this.updateSortOrder
        };

        var events = [];

        var paginatorComponentProps = {};

        for (let i = 0; i < this.state.events.length; i += 1) {
            let eventComponentProps = {
                title: this.state.events[i].title,
                date: this.state.events[i].date,
                description: this.state.events[i].description
            };

            events.push(
                <EventComponent key={i} {...eventComponentProps} />
            );

            if (i === this.props.eventsPerPage - 1) {
                break;
            }
        }

        return (
            <div className='event-manager-component'>
                <SortComponent {...sortComponentProps} />
                {events}
            </div>
        );
    }

    handleNewEventData(data) {
        this.updateSortOrder(this.state.sortOrder, data.events);
    }

    updateSortOrder(sortOrder, events = this.state.events) {
        var comparator = null;

        switch (sortOrder) {
            case 'title':
                comparator = (a, b) => {
                    var result = 0;

                    if (a.title.toLowerCase() < b.title.toLowerCase()) {
                        result = -1;
                    } else if (a.title.toLowerCase() > b.title.toLowerCase()) {
                        result = 1;
                    }

                    return result;
                };

                break;
            case 'date':
                comparator = (a, b) => {
                    var result = 0,
                        d1 = new Date(a.date),
                        d2 = new Date(b.date);;

                    if (d1 < d2) {
                        result = -1;
                    } else if (d1 > d2) {
                        result = 1;
                    }

                    return result;
                };

                break;
            default:
                return;
        }

        this.setState({
            events: events.sort(comparator),
            sortOrder: sortOrder
        });
    }
}

EventManagerComponent.propTypes = {
    source: React.PropTypes.string.isRequired
}

export default EventManagerComponent;
