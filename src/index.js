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
     ...createLoading({
         effects: true,
     }),
     history: createHistory(),
     onError (error) {
         message.error(error.message,ERROR_MSG_DURATION)
     }
 });

// 2. Plugins
// app.use({});

// 3. Model
// app.model(require('./models/example'));
app.model(require('./models/app'))
// 4. Router
app.router(require('./router'));

// 5. Start
app.start('#root');
