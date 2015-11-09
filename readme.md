# SilverStripe + ReactJS Workshop

## Introduction

Using ReactJS in SilverStripe sounds like fun right? Well it is but before we dive into the code, let's think about what ReactJS is, and why we're using it.

According to Facebook (the folks who made it) ReactJS is:

> A JavaScript library for building user interfaces

Sounds cool. But why not use jQuery, jQuery UI, Bootstrap, and all those other existing tools to build a UI?

One of the nice things about React is that it plays really well existing technologies. So if you have an existing UI built with jQuery UI for example, ReactJS can be used in alongside your existing components, or you can splice it with those components to give them super powers.

One important distinction to make between ReactJS and other libraries, jQuery for example, is ReactJS components are rendered client-side.

Dynamic websites traditionally use server-side rendering. Your browser sends a request to a server asking for some content (let's say a webpage). The server works out what content should be returned, generates some HTML, and passes it back to your browser in the response. Your browser renders the HTML, any JavaScript is executed, and applies some behaviour to the rendered DOM nodes.

ReactJS components work a little defferently. Instead of applying behaviour to HTML returned by the server, ReactJS components work with raw data, generally in the form of a JSON object. ReactJS generates HTML by transforming that data through a series of function calls, then applies your custom behaviour to the generated markup.

So going back to the origional question, why not just generate HTML on the server and use jQuery to apply custom behaviour?

There are a number of advantages to dealing with data rather than an HTML string. We'll go into some of these in more detail throughout the workshop.

### Faster UI

By manipulating data on the client, we're able to use less HTTP requests, which means users spend less time waiting for things to load.

### Seperation of concerns

The server is left to deal with data. It doesn't have to worry about layout or how the UI is displayed. All of that is handled on the client-side.

### Composable UI

Because you're dealing with data, UI components can be passed around like any other data, which means you can build up complex UI very easily.

## Getting started

After completing the workshop you'll have a solid foundation for building ReactJS components in SilverStripe CMS. We'll work through building a simple event management interface for the CMS.

### Requirements

To complete this workshop you'll need a few things.

### Some JavaScript knowledge

You don't need to be an expert but having a basic working knowledge of JavaScript is essential. Some experience with ES6 will be useful but you'll survive without it.

### An environment with a few things installed

In addition to the basic [SilverStripe requirements](https://docs.silverstripe.org/en/3.2/getting_started/server_requirements/), you'll also need:

- composer
- git
- Node.js v4.x

If you're thinking OMG I need Node.js installed in production to use React - don't panic. Node.js is only required on your local dev environment to install dev dependencies (via npm) and run some build tasks.

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

ES6 is not fully supported by browsers yet. So for now we have to transcompile our code back to ES5 which browsers understand. We'll get more into the specifics of how this works when we look at the build tool chain so for now just open up your terminal and run `npm run build`.

Assuming that went smoothly - we can now take a look at the result. Start up a test server in your working directory with `php -S localhost:8000` and open up `http://localhost:8000` in your browser. You should see 'Event Manager' on your screen.

High fives - you just made a ReactJS component!

This is cool and all, but it's not very useful, so let's plug in some data.

First we need to pass the _data source_ to `EventManagerComponent`. Remember components should be reusable, so we're going to pass the data source _into_ the component, rather than hard coding the source _inside_ the component. This means we can reuse the component in multiple places, each with a different data source, if we want.

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

ReactJS has some handy [life-cycle methods](https://facebook.github.io/react/docs/component-specs.html). Here we're using `componentDidMount` to perform an AJAX request for our event data.

We're also using [prop validation](https://facebook.github.io/react/docs/reusable-components.html#prop-validation) to make sure the source gets passed in.

Rebuild your JavaScript with `npm run build` and refresh your browser. You should see a list of events.

This is good. But we can make things a bit more modular here. Let's break our `EventManagerComponent` up a bit.

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
        var events = this.state.events.map((event, i) => {
            var props = {
                title: event.title,
                date: event.date,
                description: event.description
            };

            return <EventComponent key={i} {...props} />
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

Unit testing is an important part of the development cycle. Having unit tests means you can make code changes and develop new features without having to worry (as much) about your changes breaking other parts of the application. Unit testing isn't a replacement for manual and end-to-end testing, it's an addition, add focusses on isolated parts of you application's functionality.

Let's write a test for our new `EventManagerComponent` using the [Jest](https://facebook.github.io/jest/) unit testing framework.

__./tests/javascript/event-manager-component-test.js__

```javascript
jest.dontMock('../../src/event-manager-component');

describe('EventManagerComponent', () => {

    var React = require('react/addons'),
        $ = require('jquery'),
        TestUtils = React.addons.TestUtils,
        EventManagerComponent = require('../../src/event-manager-component'),
        props = {
            source: 'data/events.json'
        };

    describe('component bootstrap', () => {
        var component;

        beforeEach(() => {
            component = TestUtils.renderIntoDocument(
                <EventManagerComponent {...props} />
            );
        });

        it('should set up some default state', () => {
            expect(component.state.events).toBeDefined();
        });

        it('should make an AJAX request for event data', () => {
            expect($.getJSON).toBeCalledWith(props.source, jasmine.any(Function));
        });
    });

    describe('handleNewEventData()', () => {
        var component = TestUtils.renderIntoDocument(
            <EventManagerComponent {...props} />
        );

        it('should update the component state with new event data', () => {
            expect(component.state.events.length).toBe(0);

            component.handleNewEventData({
                "events": [{
                    "title": "Hack Day",
                    "date": "Fri Nov 06 2015",
                    "description": "Come along and hack code, eat pizza, and learn some new things at our next Hack Day!"
                },
                {
                    "title": "Show and Tell",
                    "date": "Wed Nov 18 2015",
                    "description": "We've got some awesome presentations at this months Show and Tell. Bring along some lunch and enjoy."
                },
                {
                    "title": "JavaScript Guild",
                    "date": "Thu Nov 26 2015",
                    "description": "This month we're looking at how you can integrate ReactJS with SilverStripe."
                }]
            });

            expect(component.state.events.length).toBe(3);
        });
    });
});
```

You can run the tests with `npm run test`. Unit tests should be run whenever make code changes to ensure you haven't broken anything. If you're developing a new component, write a unit test to go along with it, it will save you a whole lot of headaches down the track.

After running the tests you'll see a `coverage` folder in your working directory. Jest uses the [Istanbul](https://github.com/gotwarlost/istanbul) library to generate code coverage reports. These reports are useful for finding holes in your suite of unit tests. At this stage our application is very simple so it's not all that useful. Well check back in on our coverage report once we start building out some features.

## Part 3: The build tool chain

We've been running commands like `npm run build` and `npm run test` which run dev tasks for us. But what's actually going on there? Let's take a closer look.

### npm

npm is a package manager for JavaScript. It makes it really easy to share and reuse code. The configuration for an npm package lives in `package.json` and includes things like the package's name, repository, and dependencies. A handy feature of npm is scripts. These allow us to run CLI commands with any `node_modules` dependencies included in our `$PATH`. You run them with `npm run <NAME>`. That's how we're able to run our build and unit tests. Take a look at `package.json` and see the `script` property.

For more info on npm see the [getting started video](https://docs.npmjs.com/getting-started/what-is-npm).

### Gulp

Gulp is an automation tool and build system for JavaScript projects. There's a large ecosystem of [plugins](http://gulpjs.com/plugins/) which can be combined to automate a lot of common tasks like transcompiling, minifying, and generating docs.

In our project we're using Gulp (and some plugins) to transform out ES6 code to ES5 with Babel and generate a bundle file with Browserify.

Take a look at  `gulpfile.js` to see how our tasks are defined.

For more info on Gulp see [gulpjs.com](http://gulpjs.com/).

### Babel

Babel is a JavaScript compiler. Well - sort of. It's not a compiler in the traditional sense. Babel 'transcompiles' JavaScript to errr more JavaScript. In our case we're transcompiling from ES6 to ES5 and also transforming some [JSX](https://facebook.github.io/react/docs/jsx-in-depth.html) to JavaScript along the way.

For more info on Babel take a look at [babeljs.io](https://babeljs.io/).

### Browserify

Browsers don't natively support modules yet. So we're using Browserify to fill that gap. Browserify uses the CommonJS pattern popularised by Node.js to allow developers to write modular code. The pattern looks like this in ES5.

```javascript
function MyModule() {
    this.name = 'My Module';
}

MyModule.prototype.doStuff = function () {
    return 'I did some stuff';
}

module.exports = MyModule
```

Here we have create a module called 'MyModule' which we can now include in another JavaScript file like this.

```javascript
var MyModule = require('my-module');

(function () {
    var myStuff = new MyModule();
    
    myStuff.doStuff(); // I did some stuff
}());
```

We're using ES6 so the syntax looks slightly different with `import` and `export` but the idea is the same. We can write modules which live in seperate files and include them where we like. Babel takes care for transcompiling our `import` statements into `require` statements.

The result of Browserifing your project is a 'bundle' file. The bundle file (see `./dist/bundle.js`) is a concatenated blob of JavaScript which has all of the JavaScript required to run the application.

Browserify starts at an 'entry file' (see `./src/main.js`) then creates a dependency tree from all of the `require` statements it finds. All of those files are wrapped in a browser usable `require` implementation and output to a single bundle file.

Browserify bundles are more than just concatenated JavaScript, there is also an API you can use to do some interesting things, but we'll look at that a little later.

### Creating a 'watch' task

Now that we've seen what makes up our build tool chain let's make a little task to take the hassle out of running `npm run build` all the time.

Our watch task will monitor the JavaScript files in our `./src` directory and automatically trigger a build whenever a file changes.

__./gulpfile.js__

```javascript
var gulp = require('gulp'),
    browserify = require('browserify'),
    babelify = require('babelify'),
    source = require('vinyl-source-stream'),
    packageJSON = require('./package.json'),
    semver = require('semver');

var nodeVersionIsValid = semver.satisfies(process.versions.node, packageJSON.engines.node);

if (!nodeVersionIsValid) {
    console.error('Invalid Node.js version. You need to be using ' + packageJSON.engines.node);
    process.exit();
}

gulp.task('js:watch', function () {
    gulp.watch('./src', ['js']);
});

gulp.task('js', function () {
    browserify({
        entries: packageJSON.main,
        extensions: ['.js'],
        debug: true
    })
    .transform(babelify)
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('default', ['js']);
gulp.task('watch', ['js:watch', 'js']);
```

__package.json__

```json
{
  "name": "silverstripe-event-manager",
  "version": "1.0.0",
  "description": "An event management interface for SilverStripe CMS",
  "main": "./src/main.js",
  "scripts": {
    "build": "gulp",
    "build:watch": "gulp watch",
    "test": "jest --coverage"
  },
  "keywords": [
    "SilverStripe",
    "ReactJS"
  ],
  "engines": {
    "node": "^4.0.0"
  },
  "devDependencies": {
    "babel-jest": "^5.3.0",
    "babelify": "^6.3.0",
    "browserify": "^12.0.1",
    "gulp": "^3.9.0",
    "jest-cli": "^0.5.10",
    "jquery": "^2.1.4",
    "react": "^0.13.0",
    "semver": "^5.0.3",
    "vinyl-source-stream": "^1.1.0"
  },
  "jest": {
    "scriptPreprocessor": "<rootDir>/node_modules/babel-jest",
    "testDirectoryName": "tests/javascript",
    "unmockedModulePathPatterns": [
      "<rootDir>/node_modules/react"
    ],
    "bail": true
  }
}
```

Now we can run `npm run build:watch` to start watching for changes to our source files.

## Part 4: Integrating with the CMS

## Part 5: ReactJS + Entwine

## Part 6: Making your component reusable
