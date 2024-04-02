function getRules(form) {
	function ValidatePasswordAgain(rule, value, callback) {
		if (value === '') {
			callback(new Error('请再次输入密码'))
		} else if (value !== form.password) {
			callback(new Error('两次输入密码不一致'))
		} else {
			callback()
		}
	}

	return {
		name: [
			{ required: true, message: '请输入用户名', trigger: ['change', 'blur'] },
			{
				min: 2,
				max: 16,
				message: '长度只能在2-16之间',
				trigger: ['blur', 'change']
			},
			{
				type: 'regexp',
				message: '用户名只能包中文、英文和数字',
				pattern: /^[a-zA-Z0-9\u4e00-\u9fa5]+$/,
				trigger: ['blur', 'change']
			}
		],
		password: [
			{ required: true, message: '请输入密码', trigger: ['change', 'blur'] },
			{
				min: 8,
				max: 20,
				message: '长度只能在8-20之间',
				trigger: ['blur', 'change']
			},
			{
				type: 'regexp',
				message: '密码只能包含英文和数字',
				pattern: /^[a-zA-Z0-9]+$/,
				trigger: ['blur', 'change']
			}
		],
		passwordAgain: [{ validator: ValidatePasswordAgain, trigger: ['blur', 'change'] }],
		email: [
			{
				required: true,
				message: '请输入邮箱地址',
				trigger: ['blur', 'change']
			},
			{
				type: 'email',
				message: '请输入合法的邮件地址',
				trigger: ['blur', 'change']
			}
		],
		code: [
			{
				required: true,
				message: '请输入验证码',
				trigger: ['blur', 'change']
			}
		],
		oldEmailCode: [
			{
				required: true,
				message: '请输入验证码',
				trigger: ['blur', 'change']
			}
		],
		newEmailCode: [
			{
				required: true,
				message: '请输入验证码',
				trigger: ['blur', 'change']
			}
		]
	}
}

export default getRules
