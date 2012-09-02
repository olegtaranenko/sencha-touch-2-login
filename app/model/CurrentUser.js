Ext.define('SimpleLogin.model.CurrentUser', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'id', type: 'int'},
//			{name: 'userId', type: 'int'},
			{name: 'name', type: 'string'},
			{name: 'email', type: 'string'},
			{name: 'locale', type: 'auto'},
			{name: 'timezone', type: 'auto'},
			{name: 'loginTime', type: 'int'}
		],

		proxy: {
			type: 'localstorage',
			id: 'simple-login-data'
		}
	}
});
