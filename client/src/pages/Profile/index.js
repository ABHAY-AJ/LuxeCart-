import React, { useState } from 'react';
import { Tabs, Table, Collapse } from 'antd';
import Products from './Products/index';
import UserBids from './UserBids';
import { useSelector } from 'react-redux';
import moment from 'moment';

const { TabPane } = Tabs;
const { Panel } = Collapse;

function Profile() {
  const { user } = useSelector((state) => state.users);
  const [activeCollapseKey, setActiveCollapseKey] = useState(['1']);

  const columns = [
    {
      title: 'Attribute',
      dataIndex: 'attribute',
      key: 'attribute',
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
    },
  ];

  const data = [
    {
      key: '1',
      attribute: 'Name',
      value: user.name,
    },
    {
      key: '2',
      attribute: 'Email',
      value: user.email,
    },
    {
      key: '3',
      attribute: 'Created At',
      value: moment(user.createdAt).format('MMM D, YYYY hh:mm A'),
    },
  ];

  return (
    <div className="p-4 md:p-8">
      <Collapse
        defaultActiveKey={['1']}
        className="mt-4 md:mt-8 lg:hidden"
        activeKey={activeCollapseKey}
        onChange={keys => setActiveCollapseKey(keys)}
      >
        <Panel header="Products" key="1">
          <Tabs defaultActiveKey="1">
            {activeCollapseKey.includes('1') && (
              <TabPane tab="Products" key="1">
                <Products />
              </TabPane>
            )}
          </Tabs>
        </Panel>
        <Panel header="My Bids" key="2">
          <Tabs defaultActiveKey="1">
            {activeCollapseKey.includes('2') && (
              <TabPane tab="My Bids" key="1">
                <UserBids />
              </TabPane>
            )}
          </Tabs>
        </Panel>
        <Panel header="General" key="3">
          <Tabs defaultActiveKey="1">
            {activeCollapseKey.includes('3') && (
              <TabPane tab="General" key="1">
                <div className="max-h-[400px] overflow-y-auto">
                  <Table columns={columns} dataSource={data} pagination={false} />
                </div>
              </TabPane>
            )}
          </Tabs>
        </Panel>
      </Collapse>
      <div className="hidden lg:block">
        <Tabs defaultActiveKey="1">
          <TabPane tab="Products" key="1">
            <Products />
          </TabPane>
          <TabPane tab="My Bids" key="2">
            <UserBids />
          </TabPane>
          <TabPane tab="General" key="3">
            <div className="max-h-[400px] overflow-y-auto">
              <Table columns={columns} dataSource={data} pagination={false} />
            </div>
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
}

export default Profile;
