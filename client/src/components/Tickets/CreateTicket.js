import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CreateTicket() { // base Ticket creation function
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    orderNumber: ''
  });
  
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // handle any changes in the ticket form
  const ticketChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // handles when a ticket it submitted
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // error message template
    
    // check that both fields are filled in
    if (!formData.subject || !formData.message || !formData.orderNumber) {
      setError('Subject, message, and order number are required');
      return;
    }

    // check if order number is valid (if included)
    if (formData.orderNumber && isNaN(formData.orderNumber)) {
      setError('Order number must be a number');
      return;
    }

    setIsSubmitting(true);

    try { 
      // send ticket submission request to API
      const response = await fetch('https://support-9hv8.onrender.com/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include', // security measure for cookies
        body: JSON.stringify({
          subject: formData.subject,
          message: formData.message,
          orderNumber: formData.orderNumber
        })
      });

      if (!response.ok) { // error check for invalid input
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create ticket');
      }

      // go to dashboard on success
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-ticket">
      <h2>Create New Support Ticket</h2>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="ticket-form">
        <div className="form-group">
          <label htmlFor="subject">Subject</label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={ticketChange}
            required
            maxLength="100"
          />
        </div>

        <div className="form-group">
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={ticketChange}
            required
            rows="6"
          />
        </div>

        <div className="form-group">
          <label htmlFor="orderNumber">Order Number (optional)</label>
          <input
            type="text"
            id="orderNumber"
            name="orderNumber"
            value={formData.orderNumber}
            onChange={ticketChange}
            pattern="\d*"
            title="Please enter numbers only"
          />
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="submit-button"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateTicket;