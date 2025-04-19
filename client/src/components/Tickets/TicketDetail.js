import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './TicketDetail.css';

function TicketDetail() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // order sidebar data
  const [zipInput, setZipInput] = useState('');
  const [zipVerified, setZipVerified] = useState(false);
  const [orderInfo, setOrderInfo] = useState(null);
  

  // zip code confirmation 
  const handleVerifyZip = async () => {
    try {
      const res = await fetch(`https://your-api.com/orders/${ticket.orderNumber}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add auth headers if needed
        }
      });
  
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch order info');
  
      if (data.shippingZip === zipInput.trim()) {
        setZipVerified(true);
        setOrderInfo(data); // store full order info for display
      } else {
        alert('ZIP code does not match this order.');
      }
    } catch (err) {
      console.error(err);
      alert('Error verifying order.');
    }
  };

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await fetch(`https://support-9hv8.onrender.com/api/tickets/${id}`, {
          credentials: 'include'
        });

        const isJson = response.headers
          .get('content-type')
          ?.includes('application/json');

        const data = isJson ? await response.json() : null;

        if (!response.ok) {
          throw new Error(data?.error || 'Failed to load ticket');
        }

        setTicket(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id]);

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner"></div>
        <p>Loading ticket details...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (!ticket) { 
    return <div className="empty-ticket">Ticket not found</div>;
  }

  return (
    <div className="ticket-detail-container">
      <button 
        onClick={() => navigate(-1)} 
        className="back-button"
      >
        Back to Tickets
      </button>
      
      <div className="ticket-detail-card">
        <div className="ticket-header">
          <h2 className="ticket-subject">{ticket.subject}</h2>
          <span className={`ticket-status status-${ticket.status.toLowerCase()}`}>
            {ticket.status}
          </span>
        </div>

        <div className="ticket-meta">
          {ticket.orderNumber && (
            <span className="ticket-order-number">Order #: {ticket.orderNumber}</span>
          )}
          <span className="ticket-date">
            Created: {new Date(ticket.createdAt).toLocaleString()}
          </span>
        </div>

        <div className="ticket-message">
          <h3>Message</h3>
          <p>{ticket.message}</p>
        </div>

        <div className="ticket-replies">
          <h3>Replies ({ticket.replies?.length || 0})</h3>
          {ticket.replies?.length > 0 ? (
            <ul className="reply-list">
              {ticket.replies.map(reply => (
                <li key={reply.id} className="reply-item">
                  <div className="reply-meta">
                    <span className="reply-author">{reply.user?.name || 'Support'}</span>
                    <span className="reply-date">
                      {new Date(reply.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="reply-message">
                    {reply.message}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-replies">No replies yet</p>
          )}
        </div>
        {!zipVerified && user?.role !== 'SUPPORT' && (
          <div className="zip-auth-box">
            <p>Enter your ZIP code to view order details:</p>
            <input
              type="text"
              value={zipInput}
              onChange={e => setZipInput(e.target.value)}
              placeholder="ZIP Code"
            />
            <button onClick={handleVerifyZip}>Verify</button>
          </div>
        )}
        {(zipVerified || user?.role === 'SUPPORT') && orderInfo && (
          <aside className="order-sidebar">
            <h3>Order Information</h3>
            <p><strong>Shipping Address:</strong> {orderInfo.shippingAddress}</p>
            <p><strong>Billing Address:</strong> {orderInfo.billingAddress || 'Same as shipping address'}</p>
            <p><strong>Subtotal:</strong> ${orderInfo.subtotal.toFixed(2)}</p>
            <p><strong>Shipping Cost:</strong> ${orderInfo.shippingCost.toFixed(2)}</p>
            <p><strong>Tracking Number:</strong> {orderInfo.tracking || 'Not yet shipped'}</p>

          </aside>
        )}
      </div>
    </div>
  );
}

export default TicketDetail;