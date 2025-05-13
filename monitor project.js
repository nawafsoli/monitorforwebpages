import React, { useState, useEffect } from 'react';

const TipGdpMonitor = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [lastChecked, setLastChecked] = useState(null);
  const [checkInterval, setCheckInterval] = useState(60); // in minutes
  const [notifications, setNotifications] = useState(false);
  const [statusHistory, setStatusHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [targetUrl, setTargetUrl] = useState("https://www.stc.com/products/tip-gdp");
  const [searchText, setSearchText] = useState("now open");
  const [error, setError] = useState("");

  // Check status by scraping website
  const checkStatus = () => {
    setLoading(true);
    setError("");
    
    // In a real implementation, this would use a proxy server to avoid CORS issues
    // Here we're simulating the check for demonstration purposes
    setTimeout(() => {
      const currentTime = new Date();
      setLastChecked(currentTime);
      
      // Simulate the web scraping result
      // In a real implementation, this would analyze the page content
      // to determine if the TIP GDP is open
      
      const newHistoryItem = {
        timestamp: currentTime,
        status: isOpen ? "Open" : "Closed",
      };
      
      setStatusHistory(prev => [newHistoryItem, ...prev].slice(0, 10));
      setLoading(false);
    }, 1500);
  };

  // Initial status check
  useEffect(() => {
    checkStatus();
    
    // Set up notifications if browser supports it
    if ("Notification" in window) {
      if (Notification.permission === "granted") {
        setNotifications(true);
      }
    }
  }, []);

  // Request notification permission
  const requestNotificationPermission = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        setNotifications(true);
        new Notification("TIP GDP Monitor", {
          body: "You'll be notified when TIP GDP opens"
        });
      }
    }
  };

  // Format date for display
  const formatDate = (date) => {
    if (!date) return "Never";
    return date.toLocaleString();
  };

  // Toggle open/closed status (for demo purposes)
  const toggleStatus = () => {
    setIsOpen(!isOpen);
    
    // Send notification if status changes to open
    if (!isOpen && notifications) {
      new Notification("TIP GDP Alert", {
        body: "TIP GDP is now OPEN!"
      });
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">TIP GDP Status Monitor</h1>
      
      <div className="mb-6 p-4 rounded-lg bg-gray-50">
        <div className="flex justify-between items-center">
          <span className="text-lg font-medium">Current Status:</span>
          <span className={`font-bold text-lg ${isOpen ? 'text-green-600' : 'text-red-600'}`}>
            {isOpen ? 'OPEN' : 'CLOSED'}
          </span>
        </div>
        
        <div className="mt-2 text-sm text-gray-600">
          Last checked: {formatDate(lastChecked)}
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex flex-col mb-3">
          <div className="flex mb-3">
            <label className="block w-24 mr-2">Website URL:</label>
            <input 
              type="text" 
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              className="border rounded px-2 py-1 flex-1"
              placeholder="https://www.stc.com/products/tip-gdp"
            />
          </div>
          
          <div className="flex mb-3">
            <label className="block w-24 mr-2">Search text:</label>
            <input 
              type="text" 
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="border rounded px-2 py-1 flex-1"
              placeholder="now open"
            />
          </div>
          
          <p className="text-xs text-gray-500 mb-3">
            The monitor will check if the search text appears on the website, indicating that TIP GDP is open
          </p>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 p-2 rounded mb-3 text-sm">
              {error}
            </div>
          )}
        </div>
        
        <div className="flex items-center mb-3">
          <button 
            onClick={checkStatus}
            disabled={loading}
            className={`mr-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Checking...' : 'Check Now'}
          </button>
          
          {/* Demo button to toggle status (would be removed in production) */}
          <button 
            onClick={toggleStatus}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Demo: Toggle Status
          </button>
        </div>
        
        <div className="flex items-center">
          <label className="block mr-3">Check every:</label>
          <select 
            value={checkInterval}
            onChange={(e) => setCheckInterval(parseInt(e.target.value))}
            className="border rounded px-2 py-1"
          >
            <option value={1}>1 minute</option>
            <option value={5}>5 minutes</option>
            <option value={15}>15 minutes</option>
            <option value={30}>30 minutes</option>
            <option value={60}>1 hour</option>
          </select>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <span className="mr-3">Notifications:</span>
          {notifications ? (
            <span className="text-green-600 font-medium">Enabled</span>
          ) : (
            <button 
              onClick={requestNotificationPermission}
              className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
            >
              Enable
            </button>
          )}
        </div>
        <p className="text-xs text-gray-500">
          Get notified when TIP GDP opens
        </p>
      </div>
      
      <div>
        <h2 className="font-medium mb-2">Status History</h2>
        <div className="border rounded overflow-hidden">
          {statusHistory.length === 0 ? (
            <p className="p-3 text-gray-500 text-sm">No history yet</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-2 text-left">Time</th>
                  <th className="p-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {statusHistory.map((item, index) => (
                  <tr key={index} className="border-t">
                    <td className="p-2">{formatDate(item.timestamp)}</td>
                    <td className="p-2 font-medium">
                      <span className={item.status === "Open" ? "text-green-600" : "text-red-600"}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default TipGdpMonitor;