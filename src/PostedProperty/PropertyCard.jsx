import { useState, useEffect } from 'react';

const PropertyCard = ({ property, formatPrice }) => {
  const [imgError, setImgError] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = property.images || [];

  // Slider logic if first image fails
  useEffect(() => {
    if (imgError && images.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [imgError, images.length]);

  const getImageUrl = (img) => (typeof img === 'string' ? img : img.cloudinary_src);

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl border border-slate-100 overflow-hidden transition-all group cursor-pointer">
      <div className="relative h-48 overflow-hidden">
        {!imgError ? (
          <img
            src={images.length > 0 ? getImageUrl(images[0]) : 'https://via.placeholder.com/300'}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={() => setImgError(true)}
          />
        ) : (
          <img
            src={getImageUrl(images[currentIndex])}
            alt={`${property.title} - ${currentIndex + 1}`}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        )}
        <span className="absolute top-3 right-3 bg-white/90 text-xs font-bold px-2 py-1 rounded">
          {property.propertyType}
        </span>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold text-slate-800 truncate">{property.title}</h3>
        <p className="text-sm text-slate-500 mb-4">{property.colony}, {property.area}</p>
        <div className="flex gap-3 text-xs font-medium text-slate-600 mb-4">
          <span className="bg-slate-100 px-2 py-1 rounded">{property.beds} Beds</span>
          <span className="bg-slate-100 px-2 py-1 rounded">{property.size}</span>
        </div>
        <div className="pt-3 border-t flex justify-between items-center">
          <span className="text-lg font-extrabold text-blue-900">PKR {formatPrice(property.price)}</span>
          <span className="text-blue-600">View &rarr;</span>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
