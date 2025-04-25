
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// API base URL - Using Vite's environment variables format
const API_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:5000/api';

// Types
export interface BloodStock {
  _id: string;
  bloodGroup: string;
  units: number;
  updatedAt: string;
}

export interface DonationRequest {
  _id: string;
  donorId: string;
  donorName: string;
  bloodGroup: string;
  units: number;
  disease?: string;
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface BloodRequest {
  _id: string;
  userId: string;
  userName: string;
  userRole: string;
  bloodGroup: string;
  units: number;
  reason: string;
  hospital?: string;
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected';
}

// Define blood groups array for selection dropdowns
export const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

interface BloodDataContextType {
  bloodStock: BloodStock[];
  donationRequests: DonationRequest[];
  bloodRequests: BloodRequest[];
  loading: boolean;
  bloodGroups: string[];
  createDonationRequest: (data: Partial<DonationRequest>) => Promise<void>;
  createBloodRequest: (data: Partial<BloodRequest>) => Promise<void>;
  updateDonationStatus: (id: string, status: 'pending' | 'approved' | 'rejected') => Promise<void>;
  updateBloodRequestStatus: (id: string, status: 'pending' | 'approved' | 'rejected') => Promise<void>;
  updateBloodStock: (bloodGroup: string, units: number) => Promise<void>;
  getUserDonationRequests: (userId: string) => DonationRequest[];
  getUserBloodRequests: (userId: string) => BloodRequest[];
  approveDonationRequest: (id: string) => Promise<void>;
  rejectDonationRequest: (id: string) => Promise<void>;
  approveBloodRequest: (id: string) => Promise<void>;
  rejectBloodRequest: (id: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

const BloodDataContext = createContext<BloodDataContextType | null>(null);

export const useBloodData = () => {
  const context = useContext(BloodDataContext);
  if (!context) {
    throw new Error('useBloodData must be used within a BloodDataProvider');
  }
  return context;
};

export const BloodDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bloodStock, setBloodStock] = useState<BloodStock[]>([]);
  const [donationRequests, setDonationRequests] = useState<DonationRequest[]>([]);
  const [bloodRequests, setBloodRequests] = useState<BloodRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Set auth token for API requests
  const setupAuthToken = () => {
    const token = localStorage.getItem('bloodConnectToken');
    if (token) {
      axios.defaults.headers.common['x-auth-token'] = token;
    }
  };

  // Fetch data from API
  const fetchData = async () => {
    setLoading(true);
    try {
      // Ensure token is set before making requests
      setupAuthToken();
      
      const [stockRes, donationsRes, requestsRes] = await Promise.all([
        axios.get(`${API_URL}/stock`),
        axios.get(`${API_URL}/donations`),
        axios.get(`${API_URL}/requests`)
      ]);
      
      setBloodStock(stockRes.data);
      setDonationRequests(donationsRes.data);
      setBloodRequests(requestsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Refresh data - public method to allow manual refresh from components
  const refreshData = async () => {
    await fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Create donation request
  const createDonationRequest = async (data: Partial<DonationRequest>) => {
    try {
      setupAuthToken(); // Ensure token is set
      const res = await axios.post(`${API_URL}/donations`, data);
      setDonationRequests(prev => [...prev, res.data]);
    } catch (error) {
      console.error('Error creating donation request:', error);
      throw error;
    }
  };

  // Create blood request
  const createBloodRequest = async (data: Partial<BloodRequest>) => {
    try {
      setupAuthToken(); // Ensure token is set
      const res = await axios.post(`${API_URL}/requests`, data);
      setBloodRequests(prev => [...prev, res.data]);
    } catch (error) {
      console.error('Error creating blood request:', error);
      throw error;
    }
  };

  // Update donation status
  const updateDonationStatus = async (id: string, status: 'pending' | 'approved' | 'rejected') => {
    try {
      setupAuthToken(); // Ensure token is set
      const res = await axios.put(`${API_URL}/donations/${id}`, { status });
      
      // Update donation requests
      setDonationRequests(prev => 
        prev.map(req => (req._id === id ? { ...req, status } : req))
      );
      
      // If approved, refresh blood stock
      if (status === 'approved') {
        const stockRes = await axios.get(`${API_URL}/stock`);
        setBloodStock(stockRes.data);
      }
    } catch (error) {
      console.error('Error updating donation status:', error);
      throw error;
    }
  };

  // Update blood request status
  const updateBloodRequestStatus = async (id: string, status: 'pending' | 'approved' | 'rejected') => {
    try {
      setupAuthToken(); // Ensure token is set
      const res = await axios.put(`${API_URL}/requests/${id}`, { status });
      
      // Update blood requests immediately after response
      setBloodRequests(prev => 
        prev.map(req => (req._id === id ? { ...res.data, status } : req))
      );
      
      // If approved, refresh blood stock
      if (status === 'approved') {
        const stockRes = await axios.get(`${API_URL}/stock`);
        setBloodStock(stockRes.data);
      }
    } catch (error) {
      console.error('Error updating blood request status:', error);
      throw error;
    }
  };

  // Update blood stock
  const updateBloodStock = async (bloodGroup: string, units: number) => {
    try {
      setupAuthToken(); // Ensure token is set
      const res = await axios.put(`${API_URL}/stock/${bloodGroup}`, { units });
      setBloodStock(prev => {
        const stockIndex = prev.findIndex(s => s.bloodGroup === bloodGroup);
        if (stockIndex >= 0) {
          return [
            ...prev.slice(0, stockIndex),
            res.data,
            ...prev.slice(stockIndex + 1)
          ];
        }
        return [...prev, res.data];
      });
    } catch (error) {
      console.error('Error updating blood stock:', error);
      throw error;
    }
  };

  // Helper methods for blood requests
  const getUserDonationRequests = (userId: string) => {
    return donationRequests.filter(request => request.donorId === userId);
  };

  const getUserBloodRequests = (userId: string) => {
    return bloodRequests.filter(request => request.userId === userId);
  };

  // Helper methods for donation requests
  const approveDonationRequest = async (id: string) => {
    return updateDonationStatus(id, 'approved');
  };

  const rejectDonationRequest = async (id: string) => {
    return updateDonationStatus(id, 'rejected');
  };

  // Helper methods for blood requests
  const approveBloodRequest = async (id: string) => {
    return updateBloodRequestStatus(id, 'approved');
  };

  const rejectBloodRequest = async (id: string) => {
    return updateBloodRequestStatus(id, 'rejected');
  };

  return (
    <BloodDataContext.Provider
      value={{
        bloodStock,
        donationRequests,
        bloodRequests,
        loading,
        bloodGroups,
        createDonationRequest,
        createBloodRequest,
        updateDonationStatus,
        updateBloodRequestStatus,
        updateBloodStock,
        getUserDonationRequests,
        getUserBloodRequests,
        approveDonationRequest,
        rejectDonationRequest,
        approveBloodRequest,
        rejectBloodRequest,
        refreshData
      }}
    >
      {children}
    </BloodDataContext.Provider>
  );
}