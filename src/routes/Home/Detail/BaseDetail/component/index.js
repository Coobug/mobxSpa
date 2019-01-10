import React, { Component } from 'react';

import PropTypes from 'prop-types';

import { Helmet } from 'react-helmet';
import { inject, observer } from 'mobx-react';

import { Row, Col, Table } from 'antd';

import Storage from 'utils/storage'; // eslint-disable-line

import ModuleLine from 'components/ModuleLine'; // eslint-disable-line
import ImgWithSave from 'components/Image/ImgWithSave'; // eslint-disable-line
import { WithBreadcrumb } from 'components/Breadcrumb'; // eslint-disable-line
import ShareByQrModal from 'components/ShareByQrModal'; // eslint-disable-line

import InfoItem from './InfoItem';
import FrameItem from './FrameItem';

import TableHoc from '../../../../../hoc/TableHoc';

import './style.scss';

@TableHoc({ store: 'ProDetailStore', NoPager: true })
@inject('TableSearchStore')
@observer
class BaseDetail extends Component {
  static defaultProps = {
    titleValue: ['本次推广专属小程序二维码', '本次推广专属小程序链接'],
  };

  static propTypes = {
    loading: PropTypes.bool,
    titleValue: PropTypes.array,
    tableData: PropTypes.array,
    match: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired, // @TableHoc 高阶组件中绑定的 mobx store 对象
    routerData: PropTypes.object.isRequired,
    TableSearchStore: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      visibleModal: Storage.get('fromCreatePromotion') || false,
    };
  }

  componentDidMount() {
    const {
      match: { params: { id } = {} },
    } = this.props;
    const { TableSearchStore } = this.props;
    TableSearchStore.getWeiCode({ promotionId: id });
  }

  componentWillUnmount() {
    const { store, TableSearchStore } = this.props;
    TableSearchStore.delWeiCode();
    store.clearPromotionDetail();
  }

  get columns() {
    return [
      {
        title: '账号',
        dataIndex: 'mobile',
        key: 'mobile',
      },
      {
        title: '姓名',
        dataIndex: 'userName',
        key: 'userName',
      },
      {
        title: '付款时间',
        dataIndex: 'payTime',
        key: 'payTime',
      },
      {
        title: '购买内容',
        dataIndex: 'courseName',
        key: 'courseName',
      },
      {
        title: '教材版本',
        dataIndex: 'version',
        key: 'version',
      },
      {
        title: '所属年级',
        dataIndex: 'grade',
        key: 'grade',
      },
      {
        title: '金额',
        dataIndex: 'payMoney',
        key: 'payMoney',
      },
      {
        title: '我的收益',
        dataIndex: 'share',
        key: 'share',
      },
    ];
  }

  handleCloseShareModal = () => {
    this.setState({
      visibleModal: false,
    });
    Storage.del('fromCreatePromotion')
  };

  render() {
    const { visibleModal } = this.state;
    const {
      routerData,
      titleValue,
      loading,
      tableData,
      store,
      TableSearchStore,
    } = this.props;
    const { config } = routerData;

    const { chooseImgByte } = TableSearchStore;
    const { basicInformation, dataOverview } = store;

    const loadingStyle = {
      width: '40px',
      height: '40px',
      margin: '30px',
    };

    return (
      <WithBreadcrumb config={config}>
        <div className="promotionDetail-container">
          <Helmet>
            <title>基础详情 - SPA</title>
            <meta name="description" content="SPA" />
          </Helmet>
          <ModuleLine title="推广详情" />
          <div className="proInfo-container">
            <div className="proInfo-left">
              {basicInformation
                && Object.keys(basicInformation).map(key => (
                  <InfoItem
                    key={key}
                    label={basicInformation[key].label}
                    value={basicInformation[key].value}
                  />
                ))}
            </div>

            <div className="proInfo-right">
              <ImgWithSave
                record={basicInformation}
                recordType="object"
                loadingStyle={loadingStyle}
                imgByte={chooseImgByte}
                titleDownImg="保存"
              />
            </div>
          </div>
          <ModuleLine title="数据总览" />

          <div className="data-frame-container">
            <Row type="flex" justify="space-between">
              {dataOverview
                && dataOverview.map(col => (
                  <Col span={7}>
                    <FrameItem
                      key={col.key}
                      title={col.title}
                      showHint
                      titleHint={col.hint}
                      value={col.total}
                      footerTitle={col.footer}
                      footerValue={col.yesterday}
                    />
                  </Col>
                ))}
            </Row>
          </div>

          <ModuleLine title="订单列表" />

          <Table
            bordered
            loading={loading}
            dataSource={tableData}
            columns={this.columns}
            pagination={false}
          />

          <ShareByQrModal
            key="base-detail-modal"
            className="special"
            imgByte={chooseImgByte}
            width={600}
            showTitle
            title="创建成功"
            titleDownImg="保存"
            record={basicInformation}
            recordType="object"
            visible={visibleModal}
            titleValue={titleValue}
            handleClose={this.handleCloseShareModal}
          />
        </div>
      </WithBreadcrumb>
    );
  }
}

export default BaseDetail;
