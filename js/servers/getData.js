

// const baseURL = 'https://www.otimes.com/front';
// const baseURL = 'https://dbys.otimes.info/front';
const baseURL = 'http://10.0.0.17:8080/front';

// 登录
export const _getLogin = baseURL+'/member/app/login.dbys';
// token校验
export const _tokenCheck = baseURL+'/member/app/tokenCheck.dbys';
// 登出
export const _getLogout = baseURL+'/member/app/logout.dbys';

// 验证手机号
export const _verifyPhone = baseURL+'/regist/telvalid.dbys';
// 验证图片验证码
// export const _verifyCode = baseURL+'/regist/veriCodeValid.dbys';
// 注册验证短信验证码
export const _verifySMS = baseURL+'/regist/telRegist.dbys';
// 注册接口
export const _getRegistered = baseURL+'/regist/submit.dbys';

// 修改密码验证短信验证码
export const _verifySMSEdit = baseURL+'/password/telPassword.dbys';
// 找回密码接口
export const _getPasswordBack = baseURL+'/password/validInfo.dbys';
// 修改密码接口
export const _getEditPassword = baseURL+'/password/findPassword.dbys';

// 物流司机端
// 物流首页当前todo列表
export const _getTodoList = baseURL+'/logist/getTodoList.dbys';
// 物流列表
export const _getLogistList = baseURL+'/logist/seek_logist_list_app.dbys';
// 物流详情
export const _getLogistDetails = baseURL+'/logist/getDetails.dbys';
// 上传图片
export const _getImgUrl = baseURL+'/logist/trans_logist_abnormalimg.dbys';
// 待发货
export const _getOrderDoingDetails = baseURL+'/logist/trans_logist_abnormal.dbys';
//待卸货
export const _getOrderDoneDetails = baseURL+'/logist/trans_logist_end.dbys';
// 运输中
export const _getOrderWarningDetails = baseURL+'/logist/trans_logist_middle.dbys';
// 上传定位点
export const _saveLocation = baseURL+'/logist/saveLocation.dbys';
