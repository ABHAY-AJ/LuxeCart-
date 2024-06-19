import { Modal, Tabs, Form, Input, Row, Col, Checkbox, Collapse, message } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { SetLoader } from "../../../redux/loadersSlice";
import { AddProduct, EditProduct } from "../../../apicalls/products";
import Images from "./Images";

const additionalthings = [
    {
        label: "Bill Available",
        name: "billAvailable",
    },
    {
        label: "Warranty Available",
        name: "warrantyAvailable",
    },
    {
        label: "Accessories Available",
        name: "accessoriesAvailable",
    },
    {
        label: "Box Available",
        name: "boxAvailable",
    },
];

const rules = [
    {
        required: true,
        message: "Required",
    }
];

function ProductsForm({ showProductForm, setShowProductForm, selectedProduct, getData }) {
    const [selectedTab, setSelectedTab] = React.useState("1");
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.users);

    const onFinish = async (values) => {
        try {
            dispatch(SetLoader(true));
            let response = null;
            if (selectedProduct) {
                response = await EditProduct(selectedProduct._id, values);
            } else {
                values.seller = user._id;
                values.status = "pending";
                response = await AddProduct(values);
            }
            dispatch(SetLoader(false));
            if (response.success) {
                message.success(response.message);
                getData();
                setShowProductForm(false);
            } else {
                message.error(response.message);
            }
        } catch (error) {
            dispatch(SetLoader(false));
            message.error(error.message);
        }
    };

    const formRef = React.useRef(null);

    useEffect(() => {
        if (selectedProduct) {
            formRef.current.setFieldsValue(selectedProduct);
        }
    }, [selectedProduct]);

    return (
        <Modal
            title=""
            open={showProductForm}
            onCancel={() => setShowProductForm(false)}
            centered
            width={1000}
            okText="Save"
            onOk={() => {
                formRef.current.submit();
            }}
            {...(selectedTab === "2" && { footer: false })}
        >
            <div className="px-4 py-2">
                <h1 className="text-primary text-2xl text-center font-semibold uppercase">
                    {selectedProduct ? "Edit product" : "Add Product"}
                </h1>
                <Tabs
                    defaultActiveKey='1'
                    activeKey={selectedTab}
                    onChange={(key) => setSelectedTab(key)}
                >
                    <Tabs.TabPane tab="General" key="1">
                        <Form
                            layout='vertical'
                            ref={formRef}
                            onFinish={onFinish}
                        >
                            <Row gutter={[16, 16]}>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        label="Name"
                                        name="name"
                                        rules={rules}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        label="Price"
                                        name="price"
                                        rules={rules}
                                    >
                                        <Input type='number' />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Form.Item
                                label="Description"
                                name="description"
                                rules={rules}
                            >
                                <TextArea rows={4} />
                            </Form.Item>
                            <Row gutter={[16, 16]}>
                                <Col xs={24} sm={12} md={8}>
                                    <Form.Item
                                        label="Category"
                                        name="category"
                                        rules={rules}
                                    >
                                        <select className="w-full">
                                            <option value="">Select</option>
                                            <option value="electronics">Electronics</option>
                                            <option value="fashion">Fashion</option>
                                            <option value="home">Home</option>
                                            <option value="sports">Sports</option>
                                        </select>
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12} md={8}>
                                    <Form.Item
                                        label="Age"
                                        name="age"
                                        rules={rules}
                                    >
                                        <Input type='number' />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12} md={8}>
                                    <Form.Item
                                        label="Show Bids on Product Page"
                                        name="showBidsOnProductPage"
                                        valuePropName='checked'
                                    >
                                        <Checkbox />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Collapse>
                                <Collapse.Panel header="Additional Details" key="1">
                                    <Row gutter={[16, 16]}>
                                        {additionalthings.map((item) => (
                                            <Col xs={24} sm={12} md={6} key={item.name}>
                                                <Form.Item
                                                    label={item.label}
                                                    name={item.name}
                                                    valuePropName='checked'
                                                >
                                                    <Checkbox />
                                                </Form.Item>
                                            </Col>
                                        ))}
                                    </Row>
                                </Collapse.Panel>
                            </Collapse>
                        </Form>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="Images" key="2" disabled={!selectedProduct}>
                        <Images
                            selectedProduct={selectedProduct}
                            getData={getData}
                            setShowProductForm={setShowProductForm}
                        />
                    </Tabs.TabPane>
                </Tabs>
            </div>
        </Modal>
    );
}

export default ProductsForm;
