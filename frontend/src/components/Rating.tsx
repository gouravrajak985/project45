import React from 'react';
import { Star } from 'lucide-react';

interface RatingProps {
  value: number;
  text?: string;
}

const Rating: React.FC<RatingProps> = ({ value, text }) => {
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star}>
          {value >= star ? (
            <Star className="text-yellow-500 fill-current" size={16} />
          ) : value >= star - 0.5 ? (
            <Star className="text-yellow-500 fill-current" size={16} />
          ) : (
            <Star className="text-yellow-500" size={16} />
          )}
        </span>
      ))}
      {text && <span className="ml-2 text-sm text-gray-600">{text}</span>}
    </div>
  );
};

export default Rating;