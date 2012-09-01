Ext.define('SimpleLogin.store.CurrentUser', {
	extend: 'Ext.data.Store',
	
	config: {
		model: 'SimpleLogin.model.CurrentUser',
		autoLoad: false
	}
});