import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { selectCart } from '../feature/cartSlice'
import useAuth from '../axios/useApi';
import { ADDRESS, ADDRESS_DEFAULT, BASE_URL, PLACE_ORDER } from '../constants/constant';
import Swal from 'sweetalert2';
import axios from 'axios';
const intitalAddress = {
    firstname: "",
    lastname: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    house: "",
    zip: "",
    state: "",

}
function Checkout() {
    const items = useSelector(selectCart);
    const authApi = useAuth();
    const total = useSelector(state => state.cart.total);
    const [states, setStates] = useState({});
    const [discount, setDiscount] = useState(0);
    const [isEditable, setIsEditable] = useState(false);
    const [addAddress, setAddAddress] = useState(false);
    const [addressId, setAddressId] = useState();
    const [refetch, setRefetch] = useState(false);
    const [address, setAddress] = useState(intitalAddress);
    const [payment, setPayment] = useState({
        creditCard: false,
        debitCard: false,
        cod: true
    })
    const shippingCost = 40;
    useEffect(() => {
        authApi.get(ADDRESS_DEFAULT)
            .then(res => {
                if (!res.data) {
                    setAddAddress(true);
                    setIsEditable(true);
                    return
                }
                setAddress(res.data);
                setAddressId(res.data.id);
            })
            .catch(e => console.log(e));
        axios.get(BASE_URL + 'states').then(({ data }) => setStates(data));
    }, [authApi, refetch]);

    const handleSubmit = (e) => {

        const form = e.currentTarget;
        e.preventDefault();
        if (form.checkValidity() === false) {
            e.stopPropagation();
            form.classList.add('was-validated');
            Swal.fire("Please fill all the required fields", "", "info")
            return
        }
        if (addAddress) {
            authApi.post(ADDRESS, { ...address, default: true })
                .then(res => {
                    setIsEditable(!isEditable);
                    setAddAddress(false);
                    Swal.fire(res.data.message);
                })
                .catch(e => console.log(e.respones.data.message));
            setIsEditable(true)
            return
        }
        authApi.put(ADDRESS + "/" + addressId, address)
            .then(res => {
                setIsEditable(!isEditable);
                Swal.fire(res.data.message);
            })
            .catch(e => console.log(e.respones.data.message))
        setIsEditable(true)

    }
    const placeOrder = () => {
        let orderDetails = {
            orderAddress: JSON.stringify(address),
            paymentMethod: Object.keys(payment).filter(x => payment[x])[0],
            status: 'Placed',
            shippingCharge: shippingCost,
            couponDiscount: discount,
            totalPrice: total,
            date: new Date().toLocaleDateString().replace(/[/]/g, '-'),
            orderItems: items.map(({ id, quantity }) => ({ id, quantity }))
        }
        authApi.post(PLACE_ORDER, orderDetails).then(({ data }) => {
            Swal.fire(data.message, `Order id: ${data.orderId}`, "success");
        })
    }

    return (
        items.length ? <div className="row">
            <div className="col-xl-8 col-lg-8 mb-4">
                <div className="card shadow-0 border">
                    <div className="p-4">
                        <h5 className="card-title mb-3">Checkout</h5>
                        {!isEditable && <p>This address is selected as default address in your account.</p>}
                        <form onSubmit={handleSubmit} className="needs-validation" noValidate>
                            <div className="row">
                                <div className="col-6 mb-3">
                                    <p className="mb-0">First name</p>
                                    <div className="form-outline">
                                        <input type="text" id="typeText" placeholder="Type here" className="form-control" value={address?.firstname} onChange={e => setAddress({ ...address, firstname: e.target.value })} disabled={!isEditable} required />
                                    </div>
                                </div>
                                <div className="col-6">
                                    <p className="mb-0">Last name</p>
                                    <div className="form-outline">
                                        <input type="text" id="typeText" placeholder="Type here" value={address?.lastname} className="form-control" onChange={e => setAddress({ ...address, lastname: e.target.value })} disabled={!isEditable} required />
                                    </div>
                                </div>

                                <div className="col-6 mb-3">
                                    <p className="mb-0">Phone</p>
                                    <div className="form-outline">
                                        <input type="tel" id="typePhone" value={address?.phone} className="form-control" onChange={e => setAddress({ ...address, phone: e.target.value })} disabled={!isEditable} required />
                                    </div>
                                </div>

                                <div className="col-6 mb-3">
                                    <p className="mb-0">Email</p>
                                    <div className="form-outline">
                                        <input type="email" id="typeEmail" placeholder="example@gmail.com" value={address?.email} className="form-control" onChange={e => setAddress({ ...address, email: e.target.value })} disabled={!isEditable} required />
                                    </div>
                                </div>
                            </div>
                            <hr className="my-4" />

                            <h5 className="card-title mb-3">Shipping info</h5>
                            <div className="row">
                                <div className="col-sm-8 mb-3">
                                    <p className="mb-0">Address</p>
                                    <div className="form-outline">
                                        <input type="text" id="typeText" placeholder="Type here" value={address?.address} className="form-control" onChange={e => setAddress({ ...address, address: e.target.value })} disabled={!isEditable} required />
                                    </div>
                                </div>

                                <div className="col-sm-4 mb-3">
                                    <p className="mb-0">States</p>
                                    <select className="form-select" disabled={!isEditable} value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} required>
                                        <option></option>
                                        {Object.keys(states)?.map((ele, i) => (
                                            <option key={i}>{ele}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-sm-4 mb-3">
                                    <p className="mb-0">City</p>
                                    <select className="form-select" disabled={!isEditable} value={address.city} onChange={e => setAddress({ ...address, city: e.target.value })} required>
                                        <option ></option>
                                        {states[address?.state]?.map((ele, i) => (
                                            <option key={i}>{ele}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="col-sm-4 mb-3">
                                    <p className="mb-0">House</p>
                                    <div className="form-outline">
                                        <input type="text" id="typeText" value={address?.house} placeholder="Type here" className="form-control" onChange={e => setAddress({ ...address, house: e.target.value })} disabled={!isEditable} required />
                                    </div>
                                </div>


                                <div className="col-sm-4 col-6 mb-3">
                                    <p className="mb-0">Zip</p>
                                    <div className="form-outline">
                                        <input type="text" id="typeText" value={address?.zip} className="form-control" onChange={e => setAddress({ ...address, zip: e.target.value })} disabled={!isEditable} required />
                                    </div>
                                </div>
                            </div>


                            {!addAddress &&
                                <span className='btn btn-sm btn-primary' onClick={() => {
                                    setIsEditable(true);
                                    setAddress(intitalAddress);
                                }}>Deliver to new address</span>}
                            {!addAddress &&
                                <span className='btn btn-sm btn-primary mx-2' onClick={() => setIsEditable(true)}>Edit this address</span>}
                            {isEditable &&
                                <><button className='btn btn-sm btn-primary' type='submit' >Save</button>
                                    <button className='btn btn-sm btn-primary mx-2' type='submit' onClick={() => {
                                        setIsEditable(false);
                                        setAddAddress(false);
                                        setRefetch(!refetch)
                                    }}>Cancel
                                    </button>
                                </>}
                        </form>
                        <h4 className="mb-3">Payment</h4>
                        <div className="d-block my-3">
                            <div className="custom-control custom-radio">
                                <input id="credit" name="paymentMethod" checked={payment.creditCard} disabled onChange={() => setPayment({ debitCard: false, cod: false, creditCard: true })} type="radio" className="custom-control-input" required={true} />
                                <label className="custom-control-label" htmlFor="credit">Credit card</label><p className='text-muted mx-2'> currently unavailable</p>
                            </div>
                            <div className="custom-control custom-radio">
                                <input id="debit" name="paymentMethod" checked={payment.debitCard} disabled onChange={() => setPayment({ creditCard: false, cod: false, debitCard: true })} type="radio" className="custom-control-input" required={true} />
                                <label className="custom-control-label" htmlFor="debit">Debit card</label><p className='text-muted mx-2'> currently unavailable</p>
                            </div>
                            <div className="custom-control custom-radio">
                                <input id="COD" name="paymentMethod" checked={payment.cod} onChange={() => setPayment({ creditCard: false, debitCard: false, cod: true })} type="radio" className="custom-control-input" required={true} />
                                <label className="custom-control-label" htmlFor="COD">COD</label>
                            </div>
                        </div>
                        {(payment.debitCard || payment.creditCard) && <>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="cc-name">Name on card</label>
                                    <input type="text" className="form-control" id="cc-name" placeholder="" required={true} />
                                    <small className="text-muted">Full name as displayed on card</small>
                                    <div className="invalid-feedback"> Name on card is required </div>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="cc-number">Credit card number</label>
                                    <input type="text" className="form-control" id="cc-number" placeholder="" required={true} />
                                    <div className="invalid-feedback"> Credit card number is required </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-3 mb-3">
                                    <label htmlFor="cc-expiration">Expiration</label>
                                    <input type="text" className="form-control" id="cc-expiration" placeholder="" required={true} />
                                    <div className="invalid-feedback"> Expiration date required </div>
                                </div>
                                <div className="col-md-3 mb-3">
                                    <label htmlFor="cc-cvv">CVV</label>
                                    <input type="text" className="form-control" id="cc-cvv" placeholder="" required={true} />
                                    <div className="invalid-feedback"> Security code required </div>
                                </div>
                            </div></>}
                        <div className="float-end">
                            <Link className="btn btn-secondary mx-2" to='/'>Cancel</Link>
                            <button className="btn btn-success" disabled={isEditable} onClick={() => placeOrder()}>Continue</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-xl-4 col-lg-4 d-flex justify-content-lg-end" >
                <div className="ms-lg-4 mt-4 mt-lg-0" >
                    <h6 className="mb-3">Summary</h6>
                    <div className="d-flex justify-content-between">
                        <p className="mb-2">Total price:</p>
                        <p className="mb-2">₹{parseFloat(total).toFixed(2)}</p>
                    </div>
                    <div className="d-flex justify-content-between">
                        <p className="mb-2">Discount:</p>
                        <p className="mb-2 text-danger">- ₹{parseFloat(discount).toFixed(2)}</p>
                    </div>
                    <div className="d-flex justify-content-between">
                        <p className="mb-2">Shipping cost:</p>
                        <p className="mb-2">+ ₹{parseFloat(shippingCost).toFixed(2)}</p>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between">
                        <p className="mb-2">Total Amount:</p>
                        <p className="mb-2 fw-bold">₹{parseFloat(total - discount + shippingCost).toFixed(2)}</p>
                    </div>

                    <div className="input-group mt-3 mb-4">
                        <input type="text" className="form-control border" name="" placeholder="Promo code" />
                        <button className="btn btn-light text-primary border">Apply</button>
                    </div>

                    <hr />
                    <h6 className="text-dark my-4">Items in cart</h6>
                    {items.slice(0, 4).map((ele, i) => {
                        return (
                            <div key={i} className="d-flex mb-4">
                                <div className="me-3 position-relative">
                                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill text-info">
                                        {ele.quantity}
                                    </span>
                                    <img alt="ice cream" src={ele.image} style={{ height: "50px", width: "50px" }} className="img-sm rounded border" />
                                </div>
                                <div className="">
                                    <Link to="#" className="nav-link">
                                        {ele.name} <br />
                                        {ele.desc || ""}
                                    </Link>
                                    <div className="price text-muted">Total: ₹{parseFloat(ele.price * ele.quantity).toFixed(2)}</div>
                                </div>
                            </div>
                        )
                    })}
                    {items.length > 4 && `And ${items.length - 4} more ${items.length - 4 === 1 ? "item" : "items"} in the cart`}
                </div>
            </div>
        </div > : <><h3>No items added in the cart.</h3><Link className='btn btn-primary' to="/">Goto Shop</Link></>


    )
}

export default Checkout
