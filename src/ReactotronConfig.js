import Reactotron from 'reactotron-react-js';
import { reactotronRedux } from 'reactotron-redux';

const reactotron = Reactotron.configure({ name: 'React Native Demo' })
  .use(reactotronRedux())
  .connect();

export default reactotron;
