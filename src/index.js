import { message } from 'antd'
import dva from 'dva';
import createLoading from 'dva-loading'
// import { browserHistory } from 'dva/router'
import createHistory from 'history/createBrowserHistory';
import 'babel-polyfill'

const ERROR_MSG_DURATION = 3; // 3 秒
// 1. Initialize
// const app = dva();
 const app = dva({
     history: createHistory(),
     onError (error) {
         message.error(error.message,ERROR_MSG_DURATION)
     }
 });

// 2. Plugins
app.use(createLoading({
  effects: true,
}));

// 3. Model
// app.model(require('./models/app'))
// 4. Router
app.router(require('./router'));

// 5. Start
app.start('#root');
