jest.dontMock('./index.js');
let React = require('react/addons');
let KudosList = require('./index.js');
let TestUtils = React.addons.TestUtils;

describe('KudosList', () => {
	it('renders an empty div if there is no selected user', () => {
		let element = TestUtils.renderIntoDocument(<KudosList/>);
		let div = TestUtils.findRenderedDOMComponentWithTag(element, 'div');

		// Verify that the div is empty
		expect(div.getDOMNode().textContent).toEqual('');
	});

	it('renders an empty div if there is no data', () => {
		let element = TestUtils.renderIntoDocument(<KudosList/>);
		let div = TestUtils.findRenderedDOMComponentWithTag(element, 'div');

		// Verify that the div is empty
		expect(div.getDOMNode().textContent).toEqual('');
	});

	// doesn't show all kudos - only the current user's
	// shows kudos in reverse chrono order
	// shows a relative date?
	it('renders a list of KudosNote components for the selected user', () => {
		let user = {
			username: 'smitha',
			fullname: 'Agent Smith'
		};

		let data = [
			{
			
			}
		]

	});
});
