var React = require('react');
var KudosApp = require('./components/KudosApp');

// START Temporary code - need to remove
			loginDone = function loginDone() {
				dpd.users.me(function (user) {
					currentUserBox.setState({ user: user.fullname });
					// $('main').hide();
					toggleSections('everything');
				});
			}

			toggleSections = function toggleSections(sectionToShow) {
				$('.content-login-form').hide();
				$('.content-everything').hide();

				if (sectionToShow === 'login') {
					$('.content-login-form').show();
				} else if (sectionToShow === 'everything') {
					$('.content-everything').show();
				}
			}

			// Hide login form if logged in
			toggleSections(); // hide everything
			dpd.users.me(function (user) {
				if (!user) {
					toggleSections('login');
				} else {
					toggleSections('everything');
				}
			});

// END temporary code

React.render(<KudosApp/>, document.body);
