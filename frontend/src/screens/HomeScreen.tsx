import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { AppDispatch, RootState } from '../store';
import { fetchProducts } from '../slices/productSlice';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { Filter } from 'lucide-react';

const HomeScreen: React.FC = () => {
  const { keyword, pageNumber = '1', category } = useParams();
  const [selectedCategory, setSelectedCategory] = useState(category || '');
  const [showFilters, setShowFilters] = useState(false);
  
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading, error, page, pages } = useSelector(
    (state: RootState) => state.product
  );
  
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
  
  useEffect(() => {
    dispatch(
      fetchProducts({
        keyword: keyword || '',
        pageNumber: Number(pageNumber),
        category: selectedCategory,
      })
    );
  }, [dispatch, keyword, pageNumber, selectedCategory]);
  
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };
  
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Latest Products</h1>
        <button
          onClick={toggleFilters}
          className="flex items-center bg-gray-200 px-3 py-2 rounded hover:bg-gray-300 md:hidden"
        >
          <Filter size={18} className="mr-1" />
          Filters
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Filters - Desktop */}
        <div className="hidden md:block">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Categories</h2>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleCategoryChange('')}
                  className={`w-full text-left px-2 py-1 rounded ${
                    selectedCategory === '' ? 'bg-blue-100 text-blue-700' : ''
                  }`}
                >
                  All Categories
                </button>
              </li>
              {categories.map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => handleCategoryChange(cat)}
                    className={`w-full text-left px-2 py-1 rounded ${
                      selectedCategory === cat ? 'bg-blue-100 text-blue-700' : ''
                    }`}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Filters - Mobile */}
        {showFilters && (
          <div className="md:hidden col-span-1 mb-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Categories</h2>
                <button onClick={toggleFilters} className="text-gray-500">
                  <X size={18} />
                </button>
              </div>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => {
                      handleCategoryChange('');
                      setShowFilters(false);
                    }}
                    className={`w-full text-left px-2 py-1 rounded ${
                      selectedCategory === '' ? 'bg-blue-100 text-blue-700' : ''
                    }`}
                  >
                    All Categories
                  </button>
                </li>
                {categories.map((cat) => (
                  <li key={cat}>
                    <button
                      onClick={() => {
                        handleCategoryChange(cat);
                        setShowFilters(false);
                      }}
                      className={`w-full text-left px-2 py-1 rounded ${
                        selectedCategory === cat ? 'bg-blue-100 text-blue-700' : ''
                      }`}
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
        
        {/* Products Grid */}
        <div className="col-span-1 md:col-span-3">
          {loading ? (
            <Loader />
          ) : error ? (
            <Message variant="error">{error}</Message>
          ) : (
            <>
              {products.length === 0 ? (
                <Message>No products found</Message>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                      <Product key={product._id} product={product} />
                    ))}
                  </div>
                  
                  {/* Pagination */}
                  {pages > 1 && (
                    <div className="flex justify-center mt-8">
                      <ul className="flex space-x-2">
                        {[...Array(pages).keys()].map((x) => (
                          <li key={x + 1}>
                            <Link
                              to={
                                keyword
                                  ? `/search/${keyword}/page/${x + 1}`
                                  : `/page/${x + 1}`
                              }
                              className={`px-3 py-1 rounded ${
                                x + 1 === page
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-200'
                              }`}
                            >
                              {x + 1}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;