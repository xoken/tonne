import Reactotron from 'reactotron-react-js';
import { reactotronRedux } from 'reactotron-redux';
import DebugConfig from './debugConfig';

console.tron = Reactotron;

Reactotron.clear();

export default DebugConfig.useReactotron
  ? Reactotron.configure({ name: 'Tonne', host: '127.0.0.1', port: 9000 })
      .use(reactotronRedux())
      .connect()
  : null;
