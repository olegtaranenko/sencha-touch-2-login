/**
 * Created with JetBrains WebStorm.
 * User: otaranenko
 * Date: 02.09.12
 * Time: 00:10
 * To change this template use File | Settings | File Templates.
 */
Ext.define('SimpleLogin.view.Dashboard', {
	extend: 'Ext.Panel',

	xtype: 'dashboard',

	requires: [
		'Ext.TitleBar'
	],

	initialize: function() {
		var me = this,
			config = me.getInitialConfig(),
			username = config.username,
			items = [];

		items.push({
			xtype: 'titlebar',
			docked: 'top',
			title: 'Hello ' + username
		}, {
			xtype: 'fieldset',
			items: [{
				margin: 10,
				xtype: 'button',
				action: 'logout',
				ui: 'decline',
				text: 'Log out'
			}]
		});

		me.setItems(items);
	}
});