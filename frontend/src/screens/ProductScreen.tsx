import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../store';
import { fetchProductDetails, clearProductDetails } from '../slices/productSlice';
import { addToCart } from '../slices/cartSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { ArrowLeft, ShoppingCart, Download } from 'lucide-react';

const ProductScreen: React.FC = () => {
  const [qty, setQty] = useState(1);
  
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const { product, loading, error } = useSelector(
    (state: RootState) => state.product
  );
  
  const { user } = useSelector((state: RootState) => state.auth);
  
  useEffect(() => {
    if (id) {
      dispatch(fetchProductDetails(id));
    }
    
    return () => {
      dispatch(clearProductDetails());
    };
  }, [dispatch, id]);
  
  const addToCartHandler = () => {
    if (product) {
      dispatch(
        addToCart({
          product: product._id,
          title: product.title,
          image: product.image,
          price: product.price,
          productType: product.productType,
          downloadLink: product.downloadLink,
          qty,
          seller: product.seller._id,
        })
      );
      navigate('/cart');
    }
  };

  return (
    <div>
      <Link to="/" className="flex items-center text-blue-600 mb-4 hover:underline">
        <ArrowLeft size={16} className="mr-1" />
        Back to Products
      </Link>
      
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="error">{error}</Message>
      ) : !product ? (
        <Message>Product not found</Message>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <img
              src={product.image}
              alt={product.title}
              className="w-full rounded-lg shadow-md"
            />
            
            <div className="mt-6 bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">Seller Information</h3>
              <p className="font-medium">{product.seller.storeName || product.seller.name}</p>
              {product.seller.storeDescription && (
                <p className="text-gray-600 mt-2">{product.seller.storeDescription}</p>
              )}
            </div>
          </div>
          
          <div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h1 className="text-2xl font-bold mb-2">{product.title}</h1>
              
              <div className="flex items-center mb-4">
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  {product.category}
                </span>
                <span className="ml-2 bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  {product.productType}
                </span>
                <span className={`ml-2 text-xs font-medium px-2.5 py-0.5 rounded ${
                  product.status === 'In Stock'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {product.status}
                </span>
              </div>
              
              <div className="border-t border-b py-4 my-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Price:</span>
                  <span className="text-2xl font-bold">${product.price.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status:</span>
                  <span className={product.status === 'In Stock' ? 'text-green-600' : 'text-red-600'}>
                    {product.status}
                  </span>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-700">{product.description}</p>
              </div>
              
              {product.status === 'In Stock' && (
                <div className="space-y-4">
                  {product.productType === 'Physical' && (
                    <div className="flex items-center">
                      <span className="mr-3">Quantity:</span>
                      <select
                        value={qty}
                        onChange={(e) => setQty(Number(e.target.value))}
                        className="border rounded p-2"
                      >
                        {[...Array(10).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  
                  <button
                    onClick={addToCartHandler}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 flex items-center justify-center"
                    disabled={product.status === 'Out of Stock'}
                  >
                    <ShoppingCart size={18} className="mr-2" />
                    Add to Cart
                  </button>
                  
                  {product.productType === 'Digital' && user && (
                    <div className="mt-4 text-center text-sm text-gray-600">
                      <p>Digital product will be available for download after purchase</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductScreen;