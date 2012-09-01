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
//				var store = Ext.getStore('CurrentUser');
//				store.add(cachedLoggedInUser);

				console.info('Auto-Login succeeded.');

			},
			failure : function() {
				console.warn('Auto-Login failed (user was not logged in).');
				// user is not logged in, show the login
				SimpleLogin.app.switchMainView('SimpleLogin.view.LoginView');
			}
		});
	},

	doLogin : function() {
/*
		this.getLoginForm().submit({
			url : SimpleLogin.app.getApiUrl('/authorizations', true),
			success : this.handleLoginSuccess,
			failure : this.handleLoginFailure,
			scope : this
		});
*/
	},

	handleLoginSuccess : function(form, response) {
		var authorization = response ? response.data : false,
			additionalData = response.additional_data,
			user = additionalData ? additionalData.user : false,
			profile = user ? user.profile : false;

		if (
			profile
			&& profile.activated === true
			&& authorization
		) {

			this.setLoggedUserId(profile.id);

			var defaultCompanyId = additionalData.default_company_id,
				locale = user.locale,
				uses12HourClock = locale.uses_12_hour_clock;

			var currentUserObject = Ext.create('SimpleLogin.model.CurrentUser', {
					id : 1,
					userId : profile.id,
					name : profile.name,
					email : profile.email,
					permissionGroup : profile.group_key,
					defaultCurrency : profile.default_currency,
					iconUrl : profile.pic_url,

					locale : locale,
					uses12HourClock: uses12HourClock,
					timezone : user.timezone

				}),
				userStore = Ext.getStore('CurrentUser');

			userStore.add(currentUserObject);

			var companiesStore = Ext.getStore('CurrentUserCompany');
			Ext.Array.each(authorization, function(item, index) {
				var company = item.company,
					info = company.info;

				var userCompanies = Ext.create('SimpleLogin.model.CurrentUserCompany', {
					id: item.company_id,
					api_token: item.api_token,
					name: info.name,
					plan_id: info.plan_id,
					billing_currency: info.billing_currency,
					status: info.status,
					promo_code: info.promo_code,
					features: company.features,
					settings: company.settings
				});
				userCompanies.save();
				companiesStore.add(userCompanies);
			});

			companiesStore.sort();

			currentUserObject.save({
				success : function() {
					this.logUserIn(currentUserObject);
				},
				failure : function() {
					Ext.Msg.alert(
						'Error',
						'We could not log you in. Please try re-loading the application',
						Ext.emptyFn);
				},
				scope : this
			}, this);
		} else {
			this.handleLoginFailure();
		}

//		UiHelper.stopLoading(null, true);
	},

	handleLoginFailure : function() {
		this.getLoginForm().down('passwordfield').setValue('');
		Ext.Msg.alert('Error', 'We could not log you in.', Ext.emptyFn);
		UiHelper.stopLoading(null, true);
	},


	logUserIn : function(savedCurrentUser) {
		var me = this,
			log = me.getLogger();
		this.getLogger().debug('logUserIn: ', savedCurrentUser);
		var defaultCompanyId = savedCurrentUser ? savedCurrentUser.get('defaultCompanyId') : 1,
			selectedCompanyId = SimpleLogin.app.getSelectedCompanyId(defaultCompanyId),
			loggedUserId = savedCurrentUser.get('userId');


		SimpleLogin.model.CurrentUserCompany.load(selectedCompanyId, {
			success: function(currentUserCompanyData) {
				var apiToken = currentUserCompanyData.get('api_token'),
					uses12HourClock = !!savedCurrentUser.get('uses12HourClock');

				if (apiToken) {
					DateHelper.setLocaleTimeFormat(uses12HourClock);
					SimpleLogin.app.setCurrentApiToken(apiToken);
					var usersStore = Ext.getStore('Users');
					usersStore.load({
						scope: this,
						callback: function(userRecords) {
							log.debug('USER STORE LOADED: ', userRecords);
							for (var idx = 0; idx < userRecords.length; idx++) {
								var userRecord = userRecords[idx];
								if (userRecord.get('id') == loggedUserId) {
									var currentUserName = userRecord.get('name');
									userRecord.set('name', currentUserName + ' (you)');
								}
							}
							var cached = UiHelper.getNameWithYou(loggedUserId); // to check caching
							afterLogIn();
							Ext.Viewport.fireEvent('bootstrap');

						}
					});
				}
			}
		});

		function afterLogIn() {

		}
	}
});
