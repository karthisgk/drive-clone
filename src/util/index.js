
import crypto from 'crypto';
export function get_time_difference(earlierDate, laterDate) 
{
    var oDiff = new Object();

    //  Calculate Differences
    //  -------------------------------------------------------------------  //
    laterDate = new Date(laterDate);
    earlierDate = new Date(earlierDate);
    var nTotalDiff = laterDate.getTime() - earlierDate.getTime();

    oDiff.days = Math.floor(nTotalDiff / 1000 / 60 / 60 / 24);
    nTotalDiff -= oDiff.days * 1000 * 60 * 60 * 24;

    oDiff.hours = Math.floor(nTotalDiff / 1000 / 60 / 60);
    nTotalDiff -= oDiff.hours * 1000 * 60 * 60;

    oDiff.minutes = Math.floor(nTotalDiff / 1000 / 60);
    nTotalDiff -= oDiff.minutes * 1000 * 60;

    oDiff.seconds = Math.floor(nTotalDiff / 1000);
    //  -------------------------------------------------------------------  //

    //  Format Duration
    //  -------------------------------------------------------------------  //
    //  Format Hours
    var hourtext = '00';
    if (oDiff.days > 0){ hourtext = String(oDiff.days);}
    if (hourtext.length == 1){hourtext = '0' + hourtext};

    //  Format Minutes
    var mintext = '00';
    if (oDiff.minutes > 0){ mintext = String(oDiff.minutes);}
    if (mintext.length == 1) { mintext = '0' + mintext };

    //  Format Seconds
    var sectext = '00';
    if (oDiff.seconds > 0) { sectext = String(oDiff.seconds); }
    if (sectext.length == 1) { sectext = '0' + sectext };

    //  Set Duration
    var sDuration = hourtext + ':' + mintext + ':' + sectext;
    oDiff.duration = sDuration;
    //  -------------------------------------------------------------------  //
    var d =oDiff;
    d.string = '';
    if(d.days > 0){
      d.string += d.days == 1 ? d.days+' Day' : d.days+' Days';
      if(d.hours != 0)
        d.string += d.hours == 1 ? ' '+d.hours+' Hr' : ' '+d.hours+' Hrs';
      if(d.minutes != 0)
          d.string += d.minutes == 1 ? ' '+d.minutes+' min' : ' '+d.minutes+' mins';
      if(d.seconds != 0)
            d.string += d.seconds == 1 ? ' '+d.seconds+' sec' : ' '+d.seconds+' secs';
    }
    else if(d.days == 0){
      if(d.hours > 0){
        d.string += d.hours == 1 ? d.hours+' Hr' : d.hours+' Hrs';
        if(d.minutes != 0)
          d.string += d.minutes == 1 ? ' '+d.minutes+' min' : ' '+d.minutes+' mins';
        if(d.seconds != 0)
          d.string += d.seconds == 1 ? ' '+d.seconds+' sec' : ' '+d.seconds+' secs';
      }
      else{
        if(d.minutes > 0){
          d.string += d.minutes == 1 ? d.minutes+' min' : d.minutes+' mins';
          if(d.seconds != 0)
            d.string += d.seconds == 1 ? ' '+d.seconds+' sec' : ' '+d.seconds+' secs';
        }else
          d.string += d.seconds <= 1 ? d.seconds+' sec' : d.seconds+' secs';
      }
    }
    return d;
}

export function current_time(t) {
  var t = typeof t === 'undefined' ? '' : t;
  if(t != '')
    t = typeof t !== 'object' ? new Date( t ) : t;
  var time = t == '' ? new Date() : t;
  var date = 
    time.getFullYear() +'-'+ 
    ('0' + (time.getMonth() + 1)).slice(-2) +'-'+
    ('0' + time.getDate()).slice(-2);
  var format = 
    ("0" + time.getHours()).slice(-2)   + ":" + 
    ("0" + time.getMinutes()).slice(-2) + ":" + 
    ("0" + time.getSeconds()).slice(-2);
  return date+' '+format;
}

export const isEmptyObject = function(object) {
  return Object.keys(object).length == 0;
}

export const dateFormat = (date) => {
  const d = new Date(date);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const days = ['Sun','Mon','Tues','Wed','Thus','Fri','Sat'];
  var dd = d.getDate();
  var mm = months[d.getMonth()];
  var yy = d.getFullYear();
  return yy + " " + mm + "-" +dd + " " + days[d.getDay()];
}


export const getUploadFileParams = (file) => {
  if(!file || !file.uri || !file.type) {
    return false;
  }
  let fileName = file.uri.split('/').pop();
  let match = /\.(\w+)$/.exec(fileName);
  return {
      ...file,
      name: fileName,
      type: match && match.length ? `${file.type}/${match[1]}` : `image`
  };
}

export const getRootUrl = () => {
  return location.protocol + '//' + location.host + '/';
}

export const loadScripts = () => {
  const root_url = getRootUrl();
  let links = ['src/assets/scripts/main.87c0748b313a1dda75f5.js']
  links.forEach(l => {
    $('body').append('<script src="' + root_url + l+ '" ></script>')
  })
};

export const getCrypto = (n = 32) => {
  return crypto.randomBytes(n).toString('hex');
}

export const getUrlParams = (param, murl = '') => {
  var url = new URL(murl == '' ? window.location.href : murl);
  var c = url.searchParams.get(param);
  return c;
}
const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);
export function encrypt(text) {
  let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
 }
 
export function decrypt(text) {
  let iv = Buffer.from(text.iv, 'hex');
  let encryptedText = Buffer.from(text.encryptedData, 'hex');
  let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
 }

export function humanFileSize(bytes, si=false, dp=1) {
  const thresh = si ? 1000 : 1024;

  if (Math.abs(bytes) < thresh) {
    return bytes + ' B';
  }

  const units = si 
    ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'] 
    : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
  let u = -1;
  const r = 10**dp;

  do {
    bytes /= thresh;
    ++u;
  } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);


  return bytes.toFixed(dp) + ' ' + units[u];
}

export function getUnique() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4();
}