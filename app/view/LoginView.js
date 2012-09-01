Ext.define("SimpleLogin.view.LoginView", {
	extend: 'Ext.form.Panel',
	xtype: 'loginForm',
	id: 'loginForm',

	config: {
		title: 'Log in',
		iconCls: 'user',
		items: [
			{
				html: '<div class="simple-login-logo">Simple Login</div>'
			},
			{
				xtype: 'fieldset',
				iconCls: 'home',
				defaults: {
					labelWidth: '40%'
				},

				items: [
					{
						xtype: 'emailfield',
						name: 'email',
						placeHolder: 'E-mail'
					},
					{
						xtype: 'passwordfield',
						id: 'loginPasswordField',
						name: 'password',
						placeHolder: 'Password'
					},
					{
						xtype: 'togglefield',
						label: 'Remember User Name',
						labelWidth: '60%',
						name: 'keep'
					}
				]

			},
			{
				xtype: 'button',
				text: 'Log in',
				ui: 'confirm'
			}
		]
	}
});
