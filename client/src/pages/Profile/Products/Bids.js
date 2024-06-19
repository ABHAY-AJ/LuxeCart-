import { message, Modal, Table } from 'antd';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { SetLoader } from '../../../redux/loadersSlice';
import { GetAllBids } from '../../../apicalls/products';
import moment from 'moment';
import Divider from '../../../components/Divider';

function Bids({ showBidsModal, setShowBidsModal, selectedProduct }) {
  const [bidsData, setBidsData] = React.useState([]);
  const dispatch = useDispatch();

  const getData = async () => {
    try {
      dispatch(SetLoader(true));
      const response = await GetAllBids({
        product: selectedProduct._id,
      });
      dispatch(SetLoader(false));
      if (response.success) {
        setBidsData(response.data);
      }
    } catch (error) {
      dispatch(SetLoader(false));
      message.error(error.message);
    }
  };

  const columns = [
    {
      title: 'Bid Placed On',
      dataIndex: 'createdAt',
      render: (text, record) => {
        return moment(text).format('DD-MM-YYYY hh:mm a');
      },
    },
    {
      title: 'Name',
      dataIndex: 'name',
      render: (text, record) => {
        return record.buyer.name;
      },
    },
    {
      title: 'Bid Amount',
      dataIndex: 'bidAmount',
    },
    {
      title: 'Message',
      dataIndex: 'message',
    },
    {
      title: 'Contact Details',
      dataIndex: 'contactDetails',
      render: (text, record) => {
        return (
          <div>
            <p>Phone: {record.mobile}</p>
            <p>Email: {record.buyer.email}</p>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    if (selectedProduct) {
      getData();
    }
  }, [selectedProduct]);

  return (
    <Modal
      title=""
      visible={showBidsModal}
      onCancel={() => setShowBidsModal(false)}
      centered
      width={'90%'}
      footer={null}
    >
      <div className='px-4 py-2 overflow-x-auto'>
        <h1 className='text-2xl font-bold text-center mb-4'>Bids</h1>
        <Divider />
        {selectedProduct && (
          <>
            <h1 className='text-lg font-semibold text-center mb-4'>
              Product Name: {selectedProduct.name}
            </h1>
            <Table columns={columns} dataSource={bidsData} />
          </>
        )}
      </div>
    </Modal>
  );
}

export default Bids;
