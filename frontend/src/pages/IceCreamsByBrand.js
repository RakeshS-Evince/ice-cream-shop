import React, { useContext, useEffect, useState } from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import axios from "axios";
import { BASE_URL } from "../constants/constant"
import { addToCart } from '../feature/cartSlice'
import { useDispatch } from 'react-redux'
import { UserContext } from '../context/UserContextProvider';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';
function IceCreamByBrand() {
    const [data, setData] = useState([]);
    const { user } = useContext(UserContext);
    const navigate = useNavigate()
    const showCart = () => {
        document.getElementById('cartSidebar').classList.add('cart_wrapper_show');
    }
    const { name } = useParams()
    const dispatch = useDispatch();
    useEffect(() => {
        axios.get(BASE_URL + 'ice-creams-by-brand/' + name).then((res) => setData(res?.data)).catch(e => console.log(e))
    }, [name])
    const cartClickHandler = (data) => {
        if (!user?.isLoggedIn) {
            Swal.fire('You are not logged in please login and add items to cart');
            return
        }
        showCart();
        dispatch(addToCart(data))
    }
    return (
        <>

            <div className='d-flex justify-content-between mb-3'>
                <h3>{name} Icecreams</h3>
                {/* <div className='d-flex align-items-center'>
                    <label>Filter: </label>
                    <select className='form-control ms-2' >
                        <option>Newer first</option>
                        <option>Older first</option>
                        <option>Price Low to High</option>
                        <option>Price High to Low</option>
                    </select>
                </div> */}
            </div>
            <Row className='g-3'>
                {data.length ? data.map((ele, i) => (
                    <Col key={i} lg={3} sm={4}>
                        <Card className='menu-card'>
                            <Card.Img className='menu-image' onClick={() => navigate('/icecream-details/' + ele.id)} variant="top" src={BASE_URL + 'images/' + ele.image} height={"250px"} />
                            <Card.Body>
                                <Card.Title className='menu-title' onClick={() => navigate('/icecream-details/' + ele.id)}>{ele.name}</Card.Title>
                                <Card.Text>
                                    Some quick example text to build on the card title and make up the
                                    bulk of the card's content.
                                </Card.Text>
                                <span className='mt-2'>Price: ₹{parseFloat(ele.price).toFixed(2)}</span>
                                <div className='d-flex justify-content-end'>
                                    <i className='bi bi-cart-plus btn btn-primary' onClick={() => {
                                        cartClickHandler({
                                            name: ele.name,
                                            id: ele.id,
                                            image: ele.image,
                                            price: ele.price,
                                            available: ele.quantity,
                                            quantity: 1,
                                        })
                                    }}>
                                    </i>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                )) : <p>No ice-creams are there</p>}
            </Row>
        </>

    )
}

export default IceCreamByBrand
