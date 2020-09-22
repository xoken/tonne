import { httpClient, authAPI } from 'nipkow-sdk';

async function setConfig(nexaHost, nexaPort, username, password) {
  try {
    if (nexaHost && nexaPort && username && password) {
      await init(nexaHost, nexaPort, username, password);
    } else {
      throw new Error('Incorrect settings');
    }
  } catch (error) {
    setDefaultConfig();
    throw error;
  }
}

async function setDefaultConfig() {
  try {
    const nexaHost = 'sb1.xoken.org';
    const nexaPort = 9091;
    const username = 'ExplorerUser';
    const password = 'OTQ2Nzc1MDIwNDA5MDcyMTM2Ng';
    if (nexaHost && nexaPort && username && password) {
      await init(nexaHost, nexaPort, username, password);
    }
  } catch (error) {
    throw error;
  }
}

async function init(nexaHost, nexaPort, username, password) {
  try {
    httpClient.init(nexaHost, nexaPort);
    const {
      auth: { sessionKey, callsRemaining },
    } = await authAPI.login(username, password);
    if (sessionKey) {
      localStorage.setItem('nexaHost', nexaHost);
      localStorage.setItem('nexaPort', nexaPort);
      localStorage.setItem('userName', username);
      localStorage.setItem('password', password);
      localStorage.setItem('sessionKey', sessionKey);
      localStorage.setItem('callsRemaining', callsRemaining);
    } else {
      throw new Error('Incorrect settings');
    }
  } catch (error) {
    throw error;
  }
}

export { setConfig, setDefaultConfig };
