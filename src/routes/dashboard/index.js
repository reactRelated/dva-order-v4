import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Row, Col, Card } from 'antd'
import { color } from '../../utils'
import { Loader } from '../../components'
import {  User,AreaChart,Hello } from './components'
import styles from './index.less'



const bodyStyle = {
  bodyStyle: {
    height: 432,
    background: '#fff',
  },
}




function Dashboard ({ dashboard, loading }) {
  const { area,user } = dashboard
 /* const numberCards = numbers.map((item, key) => (<Col key={key} lg={6} md={12}>
    <NumberCard {...item} />
  </Col>))*/

  return (
    <div>
      {console.log("loading.models.dashboard start")}
      {console.log(loading.models.dashboard)}
      {console.log("loading.models.dashboard end")}
      <Loader spinning={loading.models.dashboard} />
      <Hello compiler="1" framework="2"/>
      <Row gutter={24}>
        {/*{numberCards}*/}
        <Col lg={16} md={24}>
          <Card
            title="数据统计"
            bordered={false} >
            <AreaChart {...area} />
          </Card>
        </Col>
        <Col lg={8} md={24}>
          <Card
            bordered={false}  bodyStyle={{ ...bodyStyle.bodyStyle, padding: 0 }}>
            <User {...user}  />
          </Card>
        </Col>
      </Row>
    </div>
  )
}

Dashboard.propTypes = {
  dashboard: PropTypes.object,
  loading: PropTypes.object,
}

export default connect(({ dashboard, loading }) => ({ dashboard, loading }))(Dashboard)
