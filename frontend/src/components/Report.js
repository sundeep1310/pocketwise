import React, { useState } from 'react';
import API from '../api';
import { toast } from 'react-toastify';

const Report = () => {
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
  const [loading, setLoading] = useState({ pdf: false });
  const [currency, setCurrency] = useState('USD');

  const handleChange = (e) => {
    setDateRange({ ...dateRange, [e.target.name]: e.target.value });
  };

  const downloadReport = async (type) => {
    setLoading({ ...loading, [type]: true });
    try {
      const res = await API.get(`/reports/${type}`, {
        responseType: 'blob',
        params: { ...dateRange, currency }
      });
      
      // Create a blob from the response data
      const contentType = 'application/pdf';
      const blob = new Blob([res.data], { type: contentType });
      
      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);
      
      // Create a link element and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = `pocketwise-report-${new Date().toISOString().slice(0, 10)}.${type}`;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
      
      toast.success(`${type.toUpperCase()} report downloaded successfully!`);
    } catch (err) {
      console.error(`Error downloading ${type} report:`, err);
      toast.error(`Failed to download ${type} report`);
    } finally {
      setLoading({ ...loading, [type]: false });
    }
  };

  return (
    <div className="report-container">
      <h3>Generate Reports</h3>
      
      <div className="date-filter">
        <h4>Filter by Date Range</h4>
        <div className="date-inputs">
          <div className="form-group">
            <label>Start Date</label>
            <input
              type="date"
              name="startDate"
              value={dateRange.startDate}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label>End Date</label>
            <input
              type="date"
              name="endDate"
              value={dateRange.endDate}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label>Currency</label>
            <select 
              value={currency} 
              onChange={(e) => setCurrency(e.target.value)}
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="JPY">JPY (¥)</option>
              <option value="INR">INR (₹)</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="report-options">
        <div className="report-option">
          <div className="report-icon pdf">
            <i className="fas fa-file-pdf"></i>
          </div>
          <div className="report-details">
            <h4>PDF Report</h4>
            <p>Download as document</p>
            <button 
              onClick={() => downloadReport('pdf')}
              disabled={loading.pdf}
              className="download-btn"
            >
              {loading.pdf ? 'Generating...' : 'Download PDF'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;