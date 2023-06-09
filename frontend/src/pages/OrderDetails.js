import React, { useEffect, useState } from 'react'
import useAuth from '../axios/useApi';
import { Link, useNavigate, useParams } from 'react-router-dom';
import './orderDetails.scss'
import { BASE_URL } from '../constants/constant';
import Swal from 'sweetalert2';
import { loadScript } from './razor';
function OrderDetails() {
    const [orderDetails, setOrderDetails] = useState(null);
    const [orderAddress, setOrderAddress] = useState(null);
    const navigate = useNavigate()
    const authApi = useAuth();
    const { id } = useParams()
    useEffect(() => {
        authApi.get('order-details/' + id).then(({ data }) => { setOrderDetails(data); setOrderAddress(JSON.parse(data.orderAddress)) }).catch(e => console.log(e.message));
    }, [id, authApi]);

    async function displayRazorpay() {
        const res = await loadScript(
            "https://checkout.razorpay.com/v1/checkout.js"
        );

        if (!res) {
            alert("Razorpay SDK failed to load. Are you online?");
            return;
        }
        var options = {
            currency: "INR",
            name: "Acme Corp",
            description: "Test Transaction",
            // image: "https://example.com/your_logo",
            order_id: orderDetails?.payment?.id,
            callback_url: process.env.REACT_APP_API_URL + "api/razorpay/retry-callback/?oid=" + orderDetails?.id + "&pid=" + orderDetails?.payment?.id,
            prefill: {
                name: "Rakesh Senapati",
                email: "Rakesh@example.com",
                contact: "9000090000"
            },
            notes: {
                "address": "Ahmedabad"
            },
            modal: {
                onDismiss: () => {
                    navigate('/payment-failure/' + orderDetails?.id)
                }
            },
            theme: {
                color: "#3399cc"
            }
        };
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
    }
    const requestCancel = () => {
        Swal.fire({
            title: 'Are you sure to cancel this order?',
            text: "",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, Cancel it!'
        }).then((result) => {
            if (result.isConfirmed) {
                authApi.put('/order-status-update/' + id, { status: 'Canceled' }).then((res) => Swal.fire("Your request submitted successfully"));
                window.location.reload();
            }
        })

    }
    return (
        <div>
            <div className='d-flex justify-content-between'><h2>Order details</h2>
                <Link to='/my-orders'>Back to My Orders</Link></div>
            <div className='card' style={{ zIndex: 0 }}>
                <div className='card-body p-3 row g-2'>
                    <div className='d-flex justify-content-between'><h5>{id}</h5>
                        <span>Date: {new Date(orderDetails?.createdAt).toDateString()}</span>
                    </div>
                    <hr />
                    {orderDetails?.iceCreams?.map((ele, i) => {
                        return (
                            <div key={ele.id + i} >
                                <div className="d-flex">
                                    <div className="me-3 position-relative">
                                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill text-info">
                                            {ele.order_item?.quantity}
                                        </span>
                                        <img alt="ice cream" src={BASE_URL + 'images/' + ele.image} style={{ height: "50px", width: "50px" }} className="img-sm rounded border" />
                                    </div>
                                    <div className="">
                                        <Link to={'/icecream-details/' + ele.id} className="nav-link">
                                            {ele.name} <br />
                                        </Link>
                                        <div className="price text-muted">Price: ₹ {parseFloat(ele.order_item?.quantity * ele.price).toFixed(2)}</div>
                                    </div>
                                </div>
                                <Link to={`/review/cid=${orderDetails.customerId}&iid=${ele.id}`} className='mb-3' style={{ textDecoration: 'none' }}>Write a review</Link>
                            </div>
                        )
                    })}
                    {(orderDetails?.payment?.status === 'pending' || orderDetails?.payment?.status === 'failed') && <>
                        <p>Your payment is failed due to some reason</p>
                        <button className='btn btn-warning me-2 col-auto' onClick={() => displayRazorpay()}>Retry Payment</button>
                    </>}
                    {!(orderDetails?.status === 'Canceled' || orderDetails?.status === 'Delivered') ? <button className='btn btn-danger col-auto' onClick={() => { requestCancel() }} >Request Cancel</button> : ""}
                    <h5 className='mt-5'>Shipping details</h5>
                    <hr />
                    <div className='row g-2'>
                        <div className='col-md-4'>
                            <span style={{ fontSize: '1.25rem' }}>{`${orderAddress?.firstname} ${orderAddress?.lastname}`}</span><br />
                            <span>{`${orderAddress?.house},${orderAddress?.address} `}</span><br />
                            <span>{`${orderAddress?.city}, ${orderAddress?.state}`}</span><br />
                            <span>{` ${orderAddress?.zip}`}</span>
                        </div>
                        <div className='col-md-8'>
                            {/* Add class 'active' to progress */}
                            <div className="row d-flex justify-content-center">
                                <div className="col-12">
                                    <ul id="progressbar" className="text-center">
                                        <li className="active step0" />
                                        {orderDetails?.status !== 'Canceled' ? orderDetails?.status === 'Confirmed'
                                            ?
                                            <>
                                                <li className='active step0' />
                                                <li className='step0' />
                                            </>
                                            : orderDetails?.status === 'Delivered'
                                                ?
                                                <>
                                                    <li className='active step0' />
                                                    <li className='active step0' />
                                                </>
                                                :
                                                <>
                                                    <li className='step0' />
                                                    <li className='step0' />
                                                </> : <>
                                            <li className='active step0' />
                                        </>}

                                    </ul>
                                </div>
                            </div>
                            {orderDetails?.status !== 'Canceled' ? <div className="row d-flex justify-content-center">
                                <div className="col-12">
                                    <ul id="sub-progressbar" className="text-center">
                                        <li className=" ">Placed</li>
                                        <li className=" ">Conifrmed</li>
                                        <li className="" >Delivered</li>
                                    </ul>
                                </div>
                            </div> : <div className="row d-flex justify-content-center">
                                <div className="col-12">
                                    <ul id="sub-progressbar" className="text-center">
                                        <li className=" ">Placed</li>
                                        <li className=" ">Canceled</li>
                                    </ul>
                                </div>
                            </div>}
                        </div>
                        <h5 className='mt-5'>Price details</h5>
                        <hr />
                        <div className='mt-3 d-flex justify-content-between'>
                            <span>Amount</span>
                            <span>₹ {parseFloat(orderDetails?.totalPrice).toFixed(2)}</span>
                        </div>
                        <div className='mt-3 d-flex justify-content-between'>
                            <span>Discount</span>
                            <span className='text-danger'>-₹{parseFloat(orderDetails?.couponDiscount).toFixed(2)}</span>
                        </div>
                        <div className='mt-3 d-flex justify-content-between'>
                            <span>Shipping Charge</span>
                            <span>+₹{parseFloat(orderDetails?.shippingCharge).toFixed(2)}</span>
                        </div>
                        <hr />
                        <div className='d-flex justify-content-between'>
                            <h5> Total</h5>
                            <h5>₹{parseFloat(orderDetails?.totalPrice + orderDetails?.shippingCharge - orderDetails?.couponDiscount).toFixed(2)}</h5>
                        </div>
                        <div className='d-flex'>
                            <h5>Payment method :</h5>
                            <h5>{orderDetails?.paymentMethod}</h5>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default OrderDetails
