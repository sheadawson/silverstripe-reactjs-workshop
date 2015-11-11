import React from 'react';
import EventManagerComponent from './event-manager-component';

var wrapperElement = document.getElementById('event-manager-component-wrapper');

var props = {
    source: wrapperElement.getAttribute('data-fetch-endpoint')
};

React.render(
    <EventManagerComponent {...props} />,
    wrapperElement
);
