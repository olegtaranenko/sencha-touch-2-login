Ext.define('SimpleLogin.controller.AuthController', {
	extend : 'Ext.app.Controller',
	requires : ['Ext.form.FieldSet', 'Ext.field.Email', 'Ext.field.Password'],

	config : {

		loggedUserId: null,

		refs : {
			'emailField': '#loginEmailField',
			'passwordField': '#loginPasswordField',
			'logOutButton': '#logOutButton',
			'loginForm': 'loginForm'
		},
		control : {
			'logOutButton': {
				tap: 'logOut'
			},
			'loginForm button' : {
				tap: 'doLogin'
			}
		}
	},


	launch : function() {
		var me = this;

		Ext.ModelMgr.getModel('SimpleLogin.model.CurrentUser').load(1, {
			scope : this,
			success : function(cachedLoggedInUser) {
				delete cachedLoggedInUser.phantom;
				// fill up the store.
				var store = Ext.getStore('CurrentUser');
				store.add(cachedLoggedInUser);

				console.info('Auto-Login succeeded.');
				this.logUserIn(cachedLoggedInUser);

			},
			failure : function() {
				console.warn('Auto-Login failed (user was not logged in).');
				// user is not logged in, show the login
				SimpleLogin.app.switchMainView('SimpleLogin.view.LoginView');
			}
		});
	},


	logOut: function() {
		Ext.ModelMgr.getModel('SimpleLogin.model.CurrentUser').load(1, {
				success: function(user) {

					Ext.Msg.confirm('Confirm', 'Are you sure you want to log out?', function(confirmed) {
						if (confirmed == 'yes') {
							this.doLogout(user);
						}
					}, this);
				},

				failure: function() {
					// this should not happen, nevertheless:
					window.location.reload();
				}

			},
			this
		);
	},


	doLogout: function(user) {

		user.erase({
			success: function() {
				window.location.reload();
			}
		});
	},



	doLogin : function() {
	},

	handleLoginSuccess : function(form, response) {
	},

	handleLoginFailure : function() {
		this.getLoginForm().down('passwordfield').setValue('');
		Ext.Msg.alert('Error', 'We could not log you in.', Ext.emptyFn);
	},


	logUserIn : function(savedCurrentUser) {
		var me = this;

		console.log('logUserIn: ', savedCurrentUser);

		SimpleLogin.app.switchMainView('SimpleLogin.view.Dashboard');
	}
});
