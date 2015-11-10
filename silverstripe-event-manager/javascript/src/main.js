import React from 'react';
import EventManagerComponent from './event-manager-component';

var props = {
    source: '/silverstripe-event-manager/data/events.json'
};

React.render(
    <EventManagerComponent {...props} />,
    document.getElementById('event-manager-component-wrapper')
);
