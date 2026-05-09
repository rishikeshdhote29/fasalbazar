import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:3030/api';

const statusSteps = [
  'order placed',
  'processing',
  'shipped',
  'out for delivery',
  'delivered',
  'cancelled'
];

export default function TrackOrder() {
  const { trackingId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!trackingId) {
      setError('Tracking ID is required');
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(`${BASE_URL}/order/get-details-tackingId/${trackingId}`);
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
  }, [trackingId]);

  const getStepIndex = (statusValue) => {
    const normalized = String(statusValue || 'order placed').toLowerCase();
    return statusSteps.indexOf(normalized);
  };

  if (loading) {
    return <div className="p-4">Loading tracking details...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-600">{error}</div>;
  }

  if (!order) {
    return <div className="p-4">Order not found.</div>;
  }

  const currentStatus = String(order.status || 'order placed').toLowerCase();
  const isCancelled = currentStatus === 'cancelled';
  const currentIndex = getStepIndex(currentStatus);

  return (
    <div className="space-y-2 p-4">
      <div className="text-sm text-gray-600">Tracking ID: {order.trackingId || trackingId}</div>
      {statusSteps.map((step, idx) => {
        const done = idx <= currentIndex && currentIndex !== -1;

        if (isCancelled) {
          return (
            <div
              key={step}
              className={`p-3 rounded ${step === 'cancelled' ? 'bg-red-100' : 'bg-gray-100'}`}
            >
              <div className="font-semibold">{step}</div>
            </div>
          );
        }

        if (step === 'cancelled') return null;

        return (
          <div key={step} className={`p-3 rounded ${done ? 'bg-green-100' : 'bg-gray-100'}`}>
            <div className="font-semibold">{step}</div>
          </div>
        );
      })}
    </div>

  );
}

