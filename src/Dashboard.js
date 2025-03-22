import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [assessmentHistory, setAssessmentHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const loggedInUser = localStorage.getItem('user');
    if (!loggedInUser) {
      // Redirect to login if no user found
      navigate('/login');
      return;
    }

    try {
      // Parse user data
      const userData = JSON.parse(loggedInUser);
      setUser(userData);
      
      // Fetch assessment history (replace with your actual API call)
      fetchAssessmentHistory(userData.id);
    } catch (error) {
      console.error('Error loading user data:', error);
      navigate('/login');
    }
  }, [navigate]);

  const fetchAssessmentHistory = async (userId) => {
    try {
      // Replace with your actual API endpoint
      const response = await fetch(`/api/assessments/${userId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch assessment history');
      }
      
      const data = await response.json();
      
      // Transform data for the chart
      const formattedData = data.map((assessment, index) => ({
        name: `Test ${index + 1}`,
        score: assessment.score,
        date: new Date(assessment.date).toLocaleDateString()
      }));
      
      setAssessmentHistory(formattedData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching assessment history:', error);
      // For demo purposes, generate sample data
      const sampleData = [
        { name: 'Test 1', score: 85, date: '01/15/2025' },
        { name: 'Test 2', score: 92, date: '01/22/2025' },
        { name: 'Test 3', score: 78, date: '01/29/2025' },
        { name: 'Test 4', score: 88, date: '02/05/2025' }
      ];
      setAssessmentHistory(sampleData);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('user');
    
    // Redirect to login page
    navigate('/login');
  };

  const handleStartNewAssessment = () => {
    // Redirect to the select age page
    navigate('/selectage');
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Assessment Dashboard</h1>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </header>
      
      <div className="user-info-card">
        <h2>User Information</h2>
        <div className="user-details">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>User ID:</strong> {user.id}</p>
          {/* Add more user details as needed */}
        </div>
      </div>
      
      <div className="assessment-history">
        <h2>Assessment History</h2>
        {assessmentHistory.length === 0 ? (
          <p className="no-data-message">No assessment data available yet. Take your first assessment!</p>
        ) : (
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={assessmentHistory}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [value, 'Score']}
                  labelFormatter={(label) => `${label} (${assessmentHistory.find(item => item.name === label)?.date})`}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#8884d8" 
                  activeDot={{ r: 8 }} 
                  name="Assessment Score"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
      
      <div className="assessment-actions">
        <button 
          className="start-assessment-btn" 
          onClick={handleStartNewAssessment}
        >
          Start New Assessment
        </button>
      </div>
    </div>
  );
};

export default Dashboard;