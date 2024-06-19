import React from 'react';
import { message, Button, Collapse } from 'antd';
import moment from 'moment';
import Divider from '../../components/Divider';
import { useNavigate, useParams } from 'react-router-dom';
import { SetLoader } from '../../redux/loadersSlice';
import { useDispatch, useSelector } from 'react-redux';
import { GetProductById } from '../../apicalls/products';
import BidModal from './BidModal';
import { GetAllBids } from '../../apicalls/products';

const { Panel } = Collapse;

function ProductInfo() {
    const { user } = useSelector((state) => state.users);
    const [showAddNewBid, setShowAddNewBid] = React.useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const [product, setProduct] = React.useState(null);

    const getData = async () => {
        try {
            dispatch(SetLoader(true));
            const response = await GetProductById(id);
            dispatch(SetLoader(false));
            if (response.success) {
                const bidsResponse = await GetAllBids({ product: id });
                setProduct({
                    ...response.data,
                    bids: bidsResponse.data,
                });
            }
        } catch (error) {
            dispatch(SetLoader(false));
            message.error(error.message);
        }
    };

    React.useEffect(() => {
        getData();
    }, []);

    return (
        product && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                {/* Images Section */}
                <div className="flex flex-col gap-5">
                    {/* Main Image */}
                    <img
                        src={product.images[selectedImageIndex]}
                        alt="Product Image"
                        className="w-full h-96 rounded-md"
                    />
                    {/* Additional Images */}
                    <div className="flex gap-5">
                        {product.images.map((image, index) => (
                            <img
                                key={index}
                                className={`w-20 h-20 object-cover rounded-md cursor-pointer ${
                                    selectedImageIndex === index ? 'border-2 border-solid border-slate-400 shadow-xl p-2' : ''
                                }`}
                                onClick={() => setSelectedImageIndex(index)}
                                alt={`Product Image ${index}`}
                                src={image}
                            />
                        ))}
                    </div>
                    <Divider />
                    {/* Added On */}
                    <div>
                        <h1 className="text-gray-600">Added On</h1>
                        <span className="text-gray-600">
                            {moment(product.createdAt).format('MMM D, YYYY hh:mm A')}
                        </span>
                    </div>
                </div>

                {/* Details Section */}
                <div className="flex flex-col gap-3">
                    {/* Product Title and Description */}
                    <div>
                        <h1 className="text-2xl font-semibold text-orange-900">{product.name}</h1>
                        <span>{product.description}</span>
                    </div>
                    <Divider />
                    {/* Product Details */}
                    <div className="flex flex-col">
                        <h1 className="text-2xl font-semibold text-orange-900">Product Details</h1>
                        {/* Price */}
                        <div className="flex justify-between mt-2">
                            <span>Price</span>
                            <span>₹ {product.price}</span>
                        </div>
                        {/* Category */}
                        <div className="flex justify-between mt-2">
                            <span>Category</span>
                            <span className="uppercase">{product.category}</span>
                        </div>
                        {/* Bill Available */}
                        <div className="flex justify-between mt-2">
                            <span>Bill Available</span>
                            <span>{product.billAvailable ? 'Yes' : 'No'}</span>
                        </div>
                        {/* Box Available */}
                        <div className="flex justify-between mt-2">
                            <span>Box Available</span>
                            <span>{product.boxAvailable ? 'Yes' : 'No'}</span>
                        </div>
                        {/* Accessories Available */}
                        <div className="flex justify-between mt-2">
                            <span>Accessories Available</span>
                            <span>{product.accessoriesAvailable ? 'Yes' : 'No'}</span>
                        </div>
                        {/* Warranty Available */}
                        <div className="flex justify-between mt-2">
                            <span>Warranty Available</span>
                            <span>{product.warrantAvailable ? 'Yes' : 'No'}</span>
                        </div>
                        {/* Purchased Year */}
                        <div className="flex justify-between mt-2">
                            <span>Purchased Year</span>
                            <span>
                                {moment().subtract(product.age, 'years').format('YYYY')} ({product.age} years ago)
                            </span>
                        </div>
                    </div>
                    <Divider />
                    {/* Seller Details */}
                    <div className="flex flex-col">
                        <h1 className="text-2xl font-semibold text-orange-900">Seller Details</h1>
                        <div className="flex justify-between mt-2">
                            <span>Name</span>
                            <span className="uppercase">{product.seller.name}</span>
                        </div>
                        <div className="flex justify-between mt-2">
                            <span>Email</span>
                            <span>{product.seller.email}</span>
                        </div>
                    </div>
                    <Divider />
                    {/* Bids Section */}
                    <div className="flex flex-col">
                        <div className="flex justify-between mb-5">
                            <h1 className="text-2xl font-semibold text-orange-900">Bids</h1>
                            <Button
                                onClick={() => setShowAddNewBid(!showAddNewBid)}
                                disabled={user._id === product.seller._id}
                            >
                                New Bid
                            </Button>
                        </div>
                        {/* Render Bids in Collapse */}
                        <Collapse accordion>
                            <Panel header="Tap to see BIDS" key="1">
                                {product.showBidsOnProductPage &&
                                    product?.bids?.map((bid, index) => (
                                        <div key={index} className="border border-gray-300 border-solid p-3 rounded mt-5">
                                            <div className="flex justify-between text-gray-700">
                                                <span>Name</span>
                                                <span>{bid.buyer.name}</span>
                                            </div>
                                            <div className="flex justify-between text-gray-600">
                                                <span>Bid Amount</span>
                                                <span>₹ {bid.bidAmount}</span>
                                            </div>
                                            <div className="flex justify-between text-gray-600">
                                                <span>Bid Place On</span>
                                                <span>{moment(bid.createdAt).format('MMM D, YYYY hh:mm A')}</span>
                                            </div>
                                        </div>
                                    ))}
                            </Panel>
                        </Collapse>
                    </div>
                </div>
                {/* Add new bid modal */}
                {showAddNewBid && (
                    <BidModal
                        product={product}
                        reloadData={getData}
                        showBidModal={showAddNewBid}
                        setShowBidModal={setShowAddNewBid}
                    />
                )}
            </div>
        )
    );
}

export default ProductInfo;