import { Button, message, Table,Space } from 'antd'
import React, { useEffect } from 'react'
import moment from "moment";
import { GetProducts, UpdateProductStatus } from "../../apicalls/products";
import { useDispatch, useSelector } from 'react-redux';
import { SetLoader } from '../../redux/loadersSlice';
function Products() {

    const [products, setProducts] = React.useState([]);


    const dispatch = useDispatch();

    const getData = async () => {
        try {
            dispatch(SetLoader(true));
            const response = await GetProducts(null);
            dispatch(SetLoader(false));
            if (response.success) {
                setProducts(response.data)
            }
        } catch (error) {
            dispatch(SetLoader(false));
            message.error(error.message)
        }
    }


    const onStatusUpdate = async (id, status) => {
        try {
            dispatch(SetLoader(true));
            const response = await UpdateProductStatus(id, status);
            dispatch(SetLoader(false));
            if (response.success) {
                message.success(response.message);
                getData();
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            dispatch(SetLoader(false));
            message.error(error.message);
        }
    };


    const columns = [
        {
            title:"Product",
            dataIndex:"image",
            render:(text,record)=>{
              return(
                <img
                  src={record?.images?.length>0? record.images[0]:""}
                  alt=''
                  className='w-20 h-20 object-cover rounded-md'
                ></img>
              )
            }
          }
          ,
        {
            title: "Pruduct",
            dataIndex: "name",
        },
        {
            title: "Seller",
            dataIndex: "name",
            render: (text, record) => record.seller ? record.seller.name : 'Unknown Seller',

        },
        {
            title: "Price",
            dataIndex: "price",
        },
        {
            title: "Category",
            dataIndex: "category",
        },
        {
            title: "Age",
            dataIndex: "age",
        },
        {
            title: "Status",
            dataIndex: "status",
            render: (text, record) => {
                return record.status.toUpperCase();
            }
        },
        {
            title: "Added On",
            dataIndex: "createdAt",
            render: (text, record) => moment(record.createdAt).format("DD-MM-YYYY hh:mm A"),
        },
        {
            title: "Action",
            dataIndex: "action",
            render: (text, record) => {
                const { status, _id } = record;
                return (
                    <div className='flex gap-3'>
                         <Space>
                        {status === 'pending' && (
                            <Button type='primary' onClick={() => onStatusUpdate(_id, 'approved')}>
                                Approve
                            </Button>
                        )}
                        {status === 'pending' && (
                            <Button danger onClick={() => onStatusUpdate(_id, 'rejected')}>
                                Reject
                            </Button>
                        )}
                        {status === 'approved' && (
                            <Button danger onClick={() => onStatusUpdate(_id, 'blocked')}>
                                Block
                            </Button>
                        )}
                        {status === 'blocked' && (
                            <Button type='primary' onClick={() => onStatusUpdate(_id, 'approved')}>
                                Unblock
                            </Button>
                        )}
                    </Space>
                    </div>
                )
            }
        }
    ]



    useEffect(() => {
        getData();
    }, []);

    return (
        <div>

            <Table columns={columns} dataSource={products}></Table>

        </div>
    )
}

export default Products;