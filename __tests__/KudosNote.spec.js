jest.dontMock('../src/components/KudosNote.js');

describe('KudosNote', () => {
	it('displays the author, date and text', () => {
		let React = require('react/addons');
		let KudosNote = require('../src/components/KudosNote.js');
		let TestUtils = React.addons.TestUtils;

		let kudosNote = TestUtils.renderIntoDocument(
			<KudosNote author="Mr Foo" date='2015-01-01'>
				Some comment.
			</KudosNote>
		);

		let div = TestUtils.findRenderedDOMComponentWithTag(kudosNote, 'div');

		// Verify that the author, date and text are present
		expect(div.getDOMNode().textContent).toContain('Mr Foo');
		expect(div.getDOMNode().textContent).toContain('2015-01-01');
		expect(div.getDOMNode().textContent).toContain('Some comment.');
	});
});
