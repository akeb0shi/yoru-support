import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'CreateTicket.css';

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
        credentials: 'include',
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
    <div className="create-ticket-container">
      <h2 className="create-ticket-title">Create New Support Ticket</h2>
      
      {error && (
        <div className="create-ticket-error">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="create-ticket-form">
        <div className="form-group">
          <label htmlFor="subject" className="form-label">Subject*</label>
          <input
            type="text"
            id="subject"
            name="subject"
            className="form-input"
            value={formData.subject}
            onChange={handleChange}
            required
            maxLength="100"
          />
        </div>

        <div className="form-group">
          <label htmlFor="message" className="form-label">Message*</label>
          <textarea
            id="message"
            name="message"
            className="form-textarea"
            value={formData.message}
            onChange={handleChange}
            required
            rows="6"
          />
        </div>

        <div className="form-group">
          <label htmlFor="orderNumber" className="form-label">Order Number (optional)</label>
          <input
            type="text"
            id="orderNumber"
            name="orderNumber"
            className="form-input"
            value={formData.orderNumber}
            onChange={handleChange}
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
            {isSubmitting ? (
              <>
                <span className="spinner"></span>
                Submitting...
              </>
            ) : 'Submit Ticket'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateTicket;