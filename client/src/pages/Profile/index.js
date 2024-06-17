import React from 'react';
import { Tabs, Table } from 'antd';
import Products from './Products/index';
import UserBids from "./UserBids";
import { useSelector } from 'react-redux';
import moment from 'moment';

const { TabPane } = Tabs;

function Profile() {
  const { user } = useSelector((state) => state.users);

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
      value: moment(user.createdAt).format("MMM D, YYYY hh:mm A"),
    },
  ];

  return (
    <div>
      <Tabs defaultActiveKey='1'>
        <TabPane tab="Products" key="1">
          <Products/>
        </TabPane>
        <TabPane tab="My Bids" key="2">
          <UserBids/>
        </TabPane>
        <TabPane tab="General" key="3">
          <div className='flex justify-center'>
            <Table columns={columns} dataSource={data} pagination={false} />
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
}

export default Profile;
