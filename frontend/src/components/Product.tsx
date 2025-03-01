import React from 'react';
import { Link } from 'react-router-dom';

interface ProductProps {
  product: {
    _id: string;
    title: string;
    image: string;
    price: number;
    productType: string;
    seller: {
      name: string;
      storeName: string;
    };
  };
}

const Product: React.FC<ProductProps> = ({ product }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
      <Link to={`/product/${product._id}`}>
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-48 object-cover"
        />
      </Link>
      
      <div className="p-4">
        <Link to={`/product/${product._id}`}>
          <h2 className="text-lg font-semibold mb-2 hover:text-blue-600 line-clamp-2">
            {product.title}
          </h2>
        </Link>
        
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600 text-sm">
            {product.seller?.storeName || product.seller?.name || 'Unknown Seller'}
          </span>
          <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
            {product.productType}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold">${product.price.toFixed(2)}</span>
          <Link
            to={`/product/${product._id}`}
            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Product;