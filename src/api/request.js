import Vue from "vue";
import axios from "axios";
import { MessageBox, Message } from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
Vue.prototype.$axios = axios;
const baseURL = Vue.prototype.BASE_URL;

const service = axios.create({
	baseURL: baseURL,
	timeout: 50000
});

service.defaults.withCredentials = true; // 让ajax携带cookie
service.interceptors.request.use(
	// 每次请求都自动携带Cookie
	config => {
		config.headers.wflowToken = localStorage.getItem('wflow-token')
		return config;
	},
	// eslint-disable-next-line handle-callback-err
	error => {
		return Promise.reject(error);
	}
);

service.interceptors.response.use(
	rsp => {

		return rsp;
	},
	// 拦截异常的响应
	err => {
		switch (err.response.status) {
			case 401:
				MessageBox.alert("登陆失效，请点击右上角头像重新切换人员");
				break;
			case 403:
				Message.warning("抱歉，您无权访问！")
				break;
			case 500:
				break;
			case 404:
				break;
			default:
				//throw 'request error'
				return Promise.reject(err);
		}
		//throw 'request error'
		return Promise.reject(err);
	}
);

export function syncRequest(config){
	let ajax = new XMLHttpRequest();
	ajax.withCredentials = true
	//ajax.responseType = 'json'
	ajax.open(config.method, baseURL + config.url, false);
	ajax.onload = function (e) {
		if (ajax.readyState === 4) {
			if (ajax.status === 200 && config.success){
				config.success(ajax.responseText)
			}else if (config.fail){
				config.fail(ajax.responseText)
			}
		}
	};
	ajax.onerror = function (e) {
		if (config.fail){
			config.fail(ajax.responseText)
		}
	}
	if (config.data){
		if (config.type === 'json'){
			ajax.setRequestHeader("Content-type","application/json");
			ajax.send(JSON.stringify(config.data))
		}else {
			ajax.setRequestHeader("Content-type","application/x-www-form-urlencoded");
			let form = new FormData()
			for (const key in config.data) {
				form.set(key, config.data[key])
			}
			ajax.send(form)
		}
	}else {
		ajax.send(null)
	}
}

export default service;
