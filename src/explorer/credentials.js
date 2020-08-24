if (
  localStorage.getItem('firstrun') !== undefined ||
  localStorage.getItem('firstrun') !== '' ||
  localStorage.getItem('firstrun') !== null
) {
  localStorage.setItem(
    'sessionkey',
    '417e8a04495b2974b19f726c7a9213d1e6e6bf69442789649177c5f1c215e4cf'
  );
  localStorage.setItem('firstrun', 'completed');
  localStorage.setItem('username', 'ExplorerUser');
  localStorage.setItem('password', 'OTQ2Nzc1MDIwNDA5MDcyMTM2Ng');
  localStorage.setItem('hostname', 'sb1.xoken.org');
  localStorage.setItem('port', 9091);
  localStorage.setItem('callsremaining', 10000);
}

function authprompt() {
  localStorage.setItem('username', 'ExplorerUser');
  localStorage.setItem('password', 'OTQ2Nzc1MDIwNDA5MDcyMTM2Ng');
  localStorage.setItem('hostname', 'sb1.xoken.org');
  localStorage.setItem('port', 9091);
  httpsauth();
}
