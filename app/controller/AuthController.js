Ext.define('SimpleLogin.controller.AuthController', {
	extend : 'Ext.app.Controller',
	requires : ['Ext.form.FieldSet', 'Ext.field.Email', 'Ext.field.Password'],

	config : {

		loggedUserId: null,

		refs : {
			usernameCt: 'loginForm [name=username]',
			passwordCt: 'loginForm [name=password]',
			logOutButton: 'dashboard [action=logout]',
			keepUserCt: 'loginForm [name=keepUser]',
			loginForm: 'loginForm'
		},
		control : {
			'logOutButton': {
				tap: 'onLogoutTap'
			},
			'loginForm button' : {
				tap: 'onLoginTap'
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

				var prevLoginTime = cachedLoggedInUser.get('loginTime'),
					now = new Date(),
					interval = now - prevLoginTime;


				if (interval <= SimpleLogin.app.sessionTimeout) {
					console.info('Auto-Login succeeded.');
					this.logUserIn(cachedLoggedInUser);
				} else {
					console.warn('Session Timeout');
					SimpleLogin.app.switchMainView('SimpleLogin.view.LoginView', {
						username: cachedLoggedInUser.get('name')
					});
				}

			},
			failure : function() {
				console.warn('Auto-Login failed (user was not logged in).');
				// user is not logged in, show the login
				SimpleLogin.app.switchMainView('SimpleLogin.view.LoginView');
			}
		});
	},


	onLogoutTap: function() {
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

	checkCredentials: function(username, password) {
		var checked = !Ext.isEmpty(password) && !Ext.isEmpty(username),
			ret = {
				ok: checked,
				username: username
			};

		return ret;
	},

	onLoginTap: function() {
		var usernameCt = this.getUsernameCt(),
			passwordCt = this.getPasswordCt(),
			credentials = this.checkCredentials(usernameCt.getValue(), passwordCt.getValue());

		if (credentials.ok) {
			this.handleLoginSuccess(credentials)
		} else {
			this.handleLoginFailure();
		}
	},

	handleLoginSuccess: function(credentials) {
		var user = Ext.create('SimpleLogin.model.CurrentUser', {
			id: 1,
			name: credentials.username,
			loginTime: (new Date()).valueOf()
		});

		var keepUserCt = this.getKeepUserCt(),
			keepUser = keepUserCt.getValue();

		if (keepUser) {
			user.save({
				success: function() {
					this.logUserIn(user);
				}
			}, this);
		} else {
			this.logUserIn(user);
		}
	},

	handleLoginFailure : function() {
		var passwordCt = this.getPasswordCt();

		passwordCt.setValue('');
		Ext.Msg.alert('Error', 'We could not log you in.', Ext.emptyFn);
	},


	logUserIn : function(savedCurrentUser) {
		var me = this;

		console.log('logUserIn: ', savedCurrentUser);

		SimpleLogin.app.switchMainView('SimpleLogin.view.Dashboard', {
			username: savedCurrentUser.get('name')
		});
	}
});
