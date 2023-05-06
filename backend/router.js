const express = require('express');
const { register, login, forgotPassword, resetPassword } = require('./controller/auth');
const { getAllIceCreams, getOneIceCream, addIceCream, updateIceCream, deleteIceCream, getIceCreamByBrand } = require('./controller/iceCream');
const { placeOrder, findOrder, findOneOrder, findAllOrders, updateOrderStatus } = require('./controller/order');
const { profile, updateProfile, getAllAddress, makeDefaultAddress, getDefaultAddress, editAddress, addAddress, getOneAddress, deleteOneAddress } = require('./controller/user');
const { verifyAuth } = require('./middleware/auth');
const { upload } = require('./middleware/multer');
const { getAllBrands, addBrands, updateBrands, deleteBrands } = require('./controller/brands');
const { dashboardDetails, getAllMessages, postMessages } = require('./controller/dashboard');
const router = express.Router();
router.get('/home', (req, res) => res.send('home page'))
// Authentication
router.post('/auth/register', register);
router.post('/auth/login', login);
router.post('/auth/forgot-password', forgotPassword);
router.put('/auth/reset-password', resetPassword);
// Ice-creams CRUD
router.get('/ice-creams', getAllIceCreams);
router.get('/ice-creams/:id', getOneIceCream);
router.get('/ice-creams-by-brand/:name', getIceCreamByBrand);
router.post('/ice-creams', upload.single('image'), addIceCream);
router.put('/ice-creams/:id', upload.single('image'), updateIceCream);
router.delete('/ice-creams/:id', deleteIceCream);
// Brands CRUD
router.get('/brands', getAllBrands);
router.post('/brands', upload.single('image'), addBrands);
router.put('/brands/:name', upload.single('image'), updateBrands);
router.delete('/brands/:name', deleteBrands);
//messages
router.get('/messages', verifyAuth, getAllMessages)
router.post('/messages', verifyAuth, postMessages)
//Orders
router.post('/order/place', verifyAuth, placeOrder);
router.get('/my-orders', verifyAuth, findOrder);
router.get('/order-details/:id', verifyAuth, findOneOrder);
router.get('/orders', verifyAuth, findAllOrders);
router.put('/order-status-update/:id', verifyAuth, updateOrderStatus);
// user details
router.get('/user/profile', verifyAuth, profile);
router.put('/user/profile', verifyAuth, updateProfile);
router.get('/user/address', verifyAuth, getAllAddress);
router.get('/user/address/:id', verifyAuth, getOneAddress);
router.delete('/user/address/:id', verifyAuth, deleteOneAddress);
router.post('/user/address', verifyAuth, addAddress);
router.put('/user/address/:id', verifyAuth, editAddress);
router.put('/user/address-default/:id', verifyAuth, makeDefaultAddress);
router.get('/user/address-default/', verifyAuth, getDefaultAddress);
router.get('/dashboard', verifyAuth, dashboardDetails);

module.exports = router