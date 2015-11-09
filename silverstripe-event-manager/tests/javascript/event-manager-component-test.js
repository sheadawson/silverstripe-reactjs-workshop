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
