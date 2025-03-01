import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import {
  fetchProductDetails,
  updateProduct,
  createProduct,
  clearProductDetails,
} from '../slices/productSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { ArrowLeft, Save, Upload } from 'lucide-react';
import axios from 'axios';

const ProductEditScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('In Stock');
  const [description, setDescription] = useState('');
  const [productType, setProductType] = useState('Digital');
  const [downloadLink, setDownloadLink] = useState('');
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  
  const { loading, error, product } = useSelector(
    (state: RootState) => state.product
  );
  
  const { user } = useSelector((state: RootState) => state.auth);
  
  const isEdit = id !== 'new';
  
  useEffect(() => {
    if (isEdit) {
      if (!product || product._id !== id) {
        dispatch(fetchProductDetails(id!));
      } else {
        setTitle(product.title);
        setPrice(product.price);
        setImage(product.image);
        setCategory(product.category);
        setStatus(product.status);
        setDescription(product.description);
        setProductType(product.productType);
        setDownloadLink(product.downloadLink || '');
      }
    } else {
      dispatch(clearProductDetails());
    }
    
    return () => {
      dispatch(clearProductDetails());
    };
  }, [dispatch, id, product, isEdit]);
  
  const uploadFileHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);
    
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user?.token}`,
        },
      };
      
      const { data } = await axios.post(
        'http://localhost:5000/api/upload',
        formData,
        config
      );
      
      setImage(data.url);
      setUploading(false);
    } catch (error) {
      console.error(error);
      setUploading(false);
    }
  };
  
  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (productType === 'Digital' && !downloadLink) {
      setMessage('Download link is required for digital products');
      return;
    }
    
    const productData = {
      title,
      price,
      image,
      category,
      status,
      description,
      productType,
      downloadLink: productType === 'Digital' ? downloadLink : '',
    };
    
    if (isEdit) {
      dispatch(updateProduct({ id: id!, productData }))
        .unwrap()
        .then(() => {
          if (user?.role === 'admin') {
            navigate('/admin/products');
          } else {
            navigate('/seller/products');
          }
        });
    } else {
      dispatch(createProduct(productData))
        .unwrap()
        .then(() => {
          if (user?.role === 'admin') {
            navigate('/admin/products');
          } else {
            navigate('/seller/products');
          }
        });
    }
  };
  
  const categories = [
    'E-books',
    'Courses',
    'Software',
    'Templates',
    'Art',
    'Music',
    'Physical Products',
    'Other',
  ];

  return (
    <div>
      <Link
        to={user?.role === 'admin' ? '/admin/products' : '/seller/products'}
        className="flex items-center text-blue-600 mb-4 hover:underline"
      >
        <ArrowLeft size={16} className="mr-1" />
        Back
      </Link>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6">
          {isEdit ? 'Edit Product' : 'Create Product'}
        </h1>
        
        {message && <Message variant="error">{message}</Message>}
        {error && <Message variant="error">{error}</Message>}
        {loading && <Loader />}
        
        <form onSubmit={submitHandler}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="mb-4">
                <label
                  htmlFor="title"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  placeholder="Enter title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label
                  htmlFor="price"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Price
                </label>
                <input
                  type="number"
                  id="price"
                  placeholder="Enter price"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label
                  htmlFor="image"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Image
                </label>
                <input
                  type="text"
                  id="image"
                  placeholder="Enter image URL"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <div className="mt-2">
                  <label
                    htmlFor="image-file"
                    className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 cursor-pointer"
                  >
                    <Upload size={16} className="mr-2" />
                    Choose File
                    <input
                      type="file"
                      id="image-file"
                      onChange={uploadFileHandler}
                      className="hidden"
                    />
                  </label>
                  {uploading && <Loader />}
                </div>
              </div>
              
              <div className="mb-4">
                <label
                  htmlFor="category"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Category
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <div className="mb-4">
                <label
                  htmlFor="status"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Status
                </label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="In Stock">In Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label
                  htmlFor="productType"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Product Type
                </label>
                <select
                  id="productType"
                  value={productType}
                  onChange={(e) => setProductType(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Digital">Digital</option>
                  <option value="Physical">Physical</option>
                </select>
              </div>
              
              {productType === 'Digital' && (
                <div className="mb-4">
                  <label
                    htmlFor="downloadLink"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Download Link
                  </label>
                  <input
                    type="text"
                    id="downloadLink"
                    placeholder="Enter download link"
                    value={downloadLink}
                    onChange={(e) => setDownloadLink(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
              
              <div className="mb-4">
                <label
                  htmlFor="description"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  placeholder="Enter description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                ></textarea>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 flex items-center justify-center"
            >
              <Save size={18} className="mr-2" />
              {isEdit ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductEditScreen;