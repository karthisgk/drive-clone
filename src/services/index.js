import axios from 'axios';
import cookie from 'react-cookies';
import { API_URL } from '../util/const';


const ROOT_URL = API_URL;

function getToken() {
	return cookie.load('session');
}

function MAXIOS(method, url, data, type, callback, file) {
	console.log('Calling API for the method of ' + method + ' : ' + ROOT_URL + url);
	let header = {};
	if (getToken()) {
		header['token'] = getToken();
	}
	if (callback) {
		axios({
			method,
			url: ROOT_URL + url,
			data,
			headers: header,
			responseType: file ? 'arraybuffer' : 'json'
		}).then((data) => {
			return callback(data.data);
		});
	} else {
		return (dispatch) => {
			dispatch({
				type: type.REQ
			});
			axios({
				method,
				url: ROOT_URL + url,
				data,
				headers: header
			})
				.then((response) => {
					if (response.data.code == 'devlabs_005') {
						cookie.remove('session', { path: '/' });
						window.location.reload();
					} else {
						dispatch({
							type: type.RES,
							payload: response.data
						});
					}
				})
				.catch((error) => {
					dispatch({
						type: type.FAIL,
						payload: error
					});
				});
		};
	}
}

export default MAXIOS;
