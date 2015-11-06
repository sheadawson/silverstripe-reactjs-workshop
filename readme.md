# SilverStripe + ReactJS Workshop

## Introduction

Using ReactJS in SilverStripe sounds like fun right? Well it is, but before we dive into the code, let's think about what ReactJS is and why we're using it.

According to Facebook (the folks who made it) ReactJS is

> A JavaScript library for building user interfaces

Sounds cool. But why not use jQuery, jQuery UI, Bootstrap, and all those other existing tools to build a UI?

One of the nice things about React is that it plays really well existing technologies. So if you have an existing UI built in jQuery UI for example, ReactJS can be used in alongside your existing components, or you can splice it with those components giving them super powers.

One importantant distinction to make between ReactJS and other libraries you may have used, jQuery for example, is ReactJS components are rendered client-side. So what does that mean exactly?

Dynamic websites have traditionally used server-side rendering. Where the browser sends a request to the server asking for the content (let's say a webpage) that lives at a specific URL. The server works out what content should be returned passes back a string of HTML representing the page. Your JavaScript kicks in and applies some behaviour to the rendered DOM nodes.

ReactJS components work a little defferently. Instead of working purly with the HTML returned by the server, ReactJS components work with raw data, generally in the form of a JSON object. ReactJS generates HTML by transforming that data through a series of JavaScript function calls, then applies your custom behaviour to the generated component.

So going back to the origional question, why not just generate our HTML on the server and use jQuery to apply custom behaviour?

There are a number of advantages to dealing with data rather than a string of HTML. We'll go into some of these in more detail throughout the workshop.

### Faster UI

By manipulating data on the client, we're able to use less HTTP requests, which means users send less time waiting for things to load.

### Modular code

ReactJS components are self contained and keep their internal 'state' in memory as opposed to the DOM. ReactJS components are only responsible for updating themselves so don't cause side-effects in other components.

### Composable UI

Again because you're dealing with data, UI components can be passed around like any other data, which means you can build up complex UI very easily.

These are just some of the reasons ReactJS is great for building a complex and extendable UI.

## Getting started

Now we've had a quick look at what ReactJS does and some of the reasons to use it, let's get into the workshop.

After completing the workshop you'll have a solid foundation for building ReactJS components in SilverStripe CMS. We'll work through building a simple event management interface for the CMS.

### Requirements

To complete the workshop you'll need a few things.

### Some JavaScript knowledge

You don't need to be an expert but having a basic working knowledge of JavaScript is essential. Having some experience with ES6 will be useful but you'll survive without it.

### An environment with the a few things installed

In addition to the basic [SilverStripe requirements](https://docs.silverstripe.org/en/3.2/getting_started/server_requirements/), you'll need:

- composer
- git
- Node.js v4.x

If you're thinking OMG I need Node.js installed in production to use React - don't panic. Node.js is only required on you local dev environment to install dev dependencies (via npm) and run some build tasks.

### Resources

Grab a copy of these:

- [SilverStripe ReactJS workshop](https://github.com/flashbackzoo/silverstripe-reactjs-workshop) - Code examples for the workshop.
- [SilverStripe module generator](https://github.com/flashbackzoo/generator-silverstripe-module) - We'll use this when we get to integrating our ReactJS component with the CMS.

You can see the code for each part of the workshop by checking out the corresponding branch of `silverstripe-reactjs-workshop`.

## Part 1: Creating a ReactJS component

We're going to start off by creating our 'root component'. You can think of this like a container `<div>` which represents the top level of our component. In ReactJS you 'nest' components inside each other by passing one component down to the next. But more on that later. For now lets set up our `EventManagerComponent`.

__./src/event-manager-component.js__
```javascript
import React from 'react';

class EventManagerComponent extends React.Component {

    constructor(props) {
        super(props);
        
        this.state = {};
    }

    render() {
        return (
            <div className='event-manager-component'>Event Manager</div>
        );
    }
}

export default EventManagerComponent;
````

So far so good. Now we need to get the component onto the page somehow...

__./src/main.js__
```javascript
import React from 'react';
import EventManagerComponent from './event-manager-component';

React.render(
    <EventManagerComponent />,
    document.getElementById('event-manager-component-wrapper')
);
```

ES6 is not fully supported by browsers yet. So for now we have to transcompile our code back to ES5 which browsers understand. We'll get more into the specific of how this works in Part 3 so for now just open up your terminal and run `npm run build`.

Assuming that went smoothly - we can now take a look at the result. Start up a test server in working directory with `php -S localhost:8000` and open up `http://localhost:8000` in your browser. You should see 'Event Manager' on your screen.

High fives - you just made a ReactJS component!

This is cool and all, but it's not very useful, so let's plug in some data.

First we need to pass the data source to `EventManagerComponent`. Remember components should be reusable, so we're going to pass the source into the component, rather than hard coding the source _inside_ the component. This mean we can reuse the component in multiple places, each with a different data source, if we wanted.

__./src/main.js__
```javascript
import React from 'react';
import EventManagerComponent from './event-manager-component';

var props = {
    source: 'data/events.json'
};

React.render(
    <EventManagerComponent {...props} />,
    document.getElementById('event-manager-component-wrapper')
);
```

Here we're passing data into our component using [props](https://facebook.github.io/react/docs/transferring-props.html).

__./src/event-manager-component.js__
```javascript
import React from 'react';
import $ from 'jquery';

class EventManagerComponent extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            events: []
        };
    }

    componentDidMount() {
        $.getJSON(this.props.source, this.handleNewEventData.bind(this));
    }

    render() {
        var events = this.state.events.map((event) => {
            return (
                <div className='event-component'>
                    <h2>{event.title}</h2>
                    <p>Date: {event.date}</p>
                    <p>{event.description}</p>
                </div>
            );
        });

        return (
            <div className='event-manager-component'>
                {events}
            </div>
        );
    }

    handleNewEventData(data) {
        this.setState({
            events: data.events
        });
    }
}

EventManagerComponent.propTypes = {
    source: React.PropTypes.string.isRequired
}

export default EventManagerComponent;
```

ReactJS has some handy [life-cycle methods](https://facebook.github.io/react/docs/component-specs.html). Here's we're using `componentDidMount` to perform an AJAX request for our event data.

We're also using [prop validation](https://facebook.github.io/react/docs/reusable-components.html#prop-validation) to make sure the source gets passed in.

Rebuild your JavaScript with `npm run build` and refresh your browser. You should see a list of events.

This is good. But remember at the start, one of the nice things about ReactJS is everything can be broken down into modules. Let's break our `EventManagerComponent` up a bit.

__./src/event-component.js__
```javascript
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
```

__./src/event-manager-component.js__
```javascript
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
        $.getJSON(this.props.source, this.handleNewEventData.bind(this));
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

    handleNewEventData(data) {
        this.setState({
            events: data.events
        });
    }
}

EventManagerComponent.propTypes = {
    source: React.PropTypes.string.isRequired
}

export default EventManagerComponent;
```

Now we have a nice seperation between the different parts of out UI. Do another build and refresh to make sure everything is still working as expected.

Now we have our basic component structure let's take a look at how we can test it!

## Part 2: Unit testing

## Part 3: The build tool chain

## Part 4: Integrating with the CMS

## Part 5: ReactJS + Entwine

## Part 6: Making your component reusable
