import React, {useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router';
import axios from 'axios';
import {useSelector} from 'react-redux';

const SellerOrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const loggedinUser = useSelector(state => state.Users?.loggedinUser);
  const token = loggedinUser?.token;
  const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:3030/api';

  useEffect(() => {
    if (!id) return;
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BASE_URL}/order/get-seller-details/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        if (res.data && res.data.status === 'success') {
          setOrder(res.data.order);
        } else {
          setError(res.data?.message || 'Order not found');
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch order');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id, token]);

  const statusSteps = ['order placed','processing','shipped','out for delivery','delivered','cancelled'];
  const [status, setStatus] = useState('');

  useEffect(()=>{
    if(order) setStatus(order.status || 'order placed');
  },[order])

  const updateStatus = async () => {
    try{
      await axios.put(`${BASE_URL}/order/update-order-status/${id}`, { status }, { headers: { Authorization: `Bearer ${token}` } });
      alert('Status updated');
      // refresh
      const res = await axios.get(`${BASE_URL}/order/get-seller-details/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setOrder(res.data.order);
    }catch(err){
      alert(err.response?.data?.message || err.message || 'Failed to update status');
    }
  }

  if(loading) return <div className="p-4">Loading...</div>
  if(error) return <div className="p-4 text-red-600">{error}</div>
  if(!order) return <div className="p-4">Order not found</div>

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="mb-4">
        <button onClick={() => navigate(-1)} className="px-3 py-1 bg-gray-200 rounded">Back</button>
      </div>
      <h2 className="text-2xl font-bold mb-2">Order Details</h2>
      <div className="mb-4">
        <div><strong>Order ID:</strong> {order.orderId}</div>
        <div><strong>Tracking ID:</strong> {order.trackingId}</div>
        <div><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleString()}</div>
        <div><strong>Status:</strong> {order.status}</div>
      </div>

      <div className="flex gap-4 mb-4">
        <div className="w-1/3">
          <img src={order.product?.images} alt={order.product?.name} className="w-full h-48 object-cover rounded" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold">{order.product?.name}</h3>
          <p className="text-sm text-gray-600">{order.product?.description}</p>
          <div className="mt-2">Quantity: {order.quantity} {order.unit || 'Unit'}</div>
          <div className="mt-1">Amount: ₹{order.amount}</div>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="font-semibold">Buyer</h4>
        <div>Name: {order.buyer?.name}</div>
        <div>Email: {order.buyer?.email}</div>
        <div>Address: {order.address}</div>
        <div>Pincode: {order.pincode}</div>
      </div>

      <div className="mb-4">
        <h4 className="font-semibold">Update Status</h4>
        <select value={status} onChange={e=>setStatus(e.target.value)} className="border p-1 rounded">
          {statusSteps.map(s=> <option key={s} value={s}>{s}</option>)}
        </select>
        <button onClick={updateStatus} className="ml-2 bg-green-500 text-white px-3 py-1 rounded">Update</button>
      </div>

    </div>
  )
}

export default SellerOrderDetails;

