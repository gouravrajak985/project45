import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { ArrowLeft, Save } from 'lucide-react';
import axios from 'axios';

const UserEditScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const { user } = useSelector((state: RootState) => state.auth);
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        };
        
        const { data } = await axios.get(
          `http://localhost:5000/api/users/${id}`,
          config
        );
        
        setName(data.name);
        setEmail(data.email);
        setRole(data.role);
        setLoading(false);
      } catch (err: any) {
        setError(
          err.response && err.response.data.message
            ? err.response.data.message
            : err.message
        );
        setLoading(false);
      }
    };
    
    fetchUser();
  }, [id, user]);
  
  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`,
        },
      };
      
      await axios.put(
        `http://localhost:5000/api/users/${id}`,
        { name, email, role },
        config
      );
      
      setSuccess(true);
      setLoading(false);
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/admin/users');
      }, 2000);
    } catch (err: any) {
      setError(
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message
      );
      setLoading(false);
    }
  };

  return (
    <div>
      <Link
        to="/admin/users"
        className="flex items-center text-blue-600 mb-4 hover:underline"
      >
        <ArrowLeft size={16} className="mr-1" />
        Back to Users
      </Link>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6">Edit User</h1>
        
        {loading && <Loader />}
        {error && <Message variant="error">{error}</Message>}
        {success && (
          <Message variant="success">User updated successfully</Message>
        )}
        
        <form onSubmit={submitHandler}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-gray-700 font-medium mb-2"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 font-medium mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div className="mb-6">
            <label
              htmlFor="role"
              className="block text-gray-700 font-medium mb-2"
            >
              Role
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 flex items-center justify-center"
            disabled={loading}
          >
            <Save size={18} className="mr-2" />
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserEditScreen;