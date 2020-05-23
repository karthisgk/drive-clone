import cookie from 'react-cookies';
import MAXIOS from './';
export function Logout(){
    MAXIOS('get', 'logout', null, null, (data) => {
        if (data.code == 'devlabs_024') {
            cookie.save('session','',  { path: '/' });
            window.location.reload();
        }
    });
}