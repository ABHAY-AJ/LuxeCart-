import React, { useEffect } from 'react';
import { Tabs, Collapse, Grid } from 'antd';
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Products from './Products';
import Users from './Users';

const { TabPane } = Tabs;
const { Panel } = Collapse;
const { useBreakpoint } = Grid;

function Admin() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.users);
  const screens = useBreakpoint();

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div style={{ padding: screens.xs ? '10px' : '20px', overflow: 'auto' }}>
      {screens.md ? (
        <Tabs defaultActiveKey="1">
          <TabPane tab="Products" key="1">
            <div style={{ maxHeight: 'calc(100vh - 100px)', overflow: 'auto' }}>
              <Products />
            </div>
          </TabPane>
          <TabPane tab="Users" key="2">
            <div style={{ maxHeight: 'calc(100vh - 100px)', overflow: 'auto' }}>
              <Users />
            </div>
          </TabPane>
        </Tabs>
      ) : (
        <Collapse accordion>
          <Panel header="Products" key="1">
            <div style={{ maxHeight: 'calc(100vh - 100px)', overflow: 'auto' }}>
              <Products />
            </div>
          </Panel>
          <Panel header="Users" key="2">
            <div style={{ maxHeight: 'calc(100vh - 100px)', overflow: 'auto' }}>
              <Users />
            </div>
          </Panel>
        </Collapse>
      )}
    </div>
  );
}

export default Admin;
