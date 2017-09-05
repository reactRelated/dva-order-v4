import React from 'react'
import PropTypes from 'prop-types'
import {Router, Switch, Route, Redirect } from 'dva/router';
import dynamic from 'dva/dynamic';
import App from './routes/app'


/*注册 Model*/
/*const registerModel = (app, model) => {
    if (!(app._models.filter(m => m.namespace === model.namespace).length === 1)) {
        app.model(model)
    }
}
const Routers = function ({ history, app }) {
    const routes = [
        {
            path: '/',
            component: App,
            getIndexRoute (nextState, cb) {
                require.ensure([], (require) => {
                    registerModel(app, require('./models/dashboard'))
                    cb(null, { component: require('./routes/dashboard/') })
                }, 'dashboard')
            },
            childRoutes: [
                {
                  path: 'login',
                  getComponent (nextState, cb) {
                    require.ensure([], (require) => {
                      registerModel(app, require('./models/login'))
                      cb(null, require('./routes/login/'))
                    }, 'login')
                  },
                },
                {
                    path: 'dashboard',
                    getComponent (nextState, cb) {
                        require.ensure([], (require) => {
                            registerModel(app, require('./models/dashboard'))
                            cb(null, require('./routes/dashboard/'))
                        }, 'dashboard')
                    },
                },
                {
                  path: '*',
                  getComponent (nextState, cb) {
                    require.ensure([], (require) => {
                      cb(null, require('./routes/error/'))
                    }, 'error')
                  },
                }
            ],
        },
    ]

    return <Router history={history} routes={routes} />
}*/

function Routers({ history, app }) {
  console.log(app)
  const dashboard  = dynamic({
    app,
    models: () => [
      import('./models/dashboard'),
    ],
    component: () => import('./routes/dashboard/'),
  });

  const login = dynamic({
    app,
    models: () => [
      import('./models/login'),
    ],
    component: () => import('./routes/login/'),
  });

  const error = dynamic({
    app,
    component: () => import('./routes/error/'),
  })

  return (
    <Router history={history}>
      <Switch>
        <Route exact path='/login' component={login} />

        <App>
          <Route exact path='/' render={() => (
            <Redirect to='/dashboard' />
          )} />
          <Route exact path='/dashboard' component={dashboard} />

          <Redirect to="/error" />
          <Route exact  path='/error'  component={error} />
        </App>

      </Switch>
    </Router>
  );
}

export default Routers;
