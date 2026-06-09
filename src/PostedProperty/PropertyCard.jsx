import { useState, useEffect } from "react";
import { Heart, ChevronLeft, ChevronRight } from "lucide-react";
import api from "../utils/api";

const PropertyCard = ({
  property = {},
  formatPrice,
  isSelected,
  onCompare,
  aiTag,
}) => {

  const [score, setScore] = useState(null);
  const [imgError, setImgError] = useState(false);
  const [index, setIndex] = useState(0);

  const images = property.images || property.photos || [];

  const normalizeToArray = (data) => {
    if (!data) return [];
    return Array.isArray(data) ? data : [data];
  };

  const imageArray = normalizeToArray(images);

  const getImageUrl = (img) => {
    if (!img) return "https://via.placeholder.com/400";

    if (typeof img === "string") return img;

    return (
      img.cloudinary_src ||
      img.url ||
      img.imageUrl ||
      img.secure_url ||
      "https://via.placeholder.com/400"
    );
  };

  const mainImage =
    imageArray.length > 0
      ? getImageUrl(imageArray[index])
      : "https://via.placeholder.com/400";

  const nextImg = () => {
    if (index < imageArray.length - 1) setIndex(index + 1);
  };

  const prevImg = () => {
    if (index > 0) setIndex(index - 1);
  };

  const locationText = [
    property.area,
    property.city?.name || property.city,
  ]
    .filter(Boolean)
    .join(", ");

  // ✅ AI SCORE API (FIXED)
  useEffect(() => {
    const fetchScore = async () => {
      try {
        const res = await api.get(`/properties/${property.id}/score`);
        setScore(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    if (property?.id) fetchScore();
  }, [property?.id]);

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition">

      {/* IMAGE SECTION */}
      <div className="relative h-56 overflow-hidden">

        <img
          src={imgError ? "https://via.placeholder.com/400" : mainImage}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />

        {/* overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        {/* AI SCORE BADGE (FIXED POSITION) */}
        {score && (
          <div className="absolute top-3 left-3 z-10">
            <span
              className={`px-3 py-1 text-xs font-bold rounded-full text-white ${
                score.score >= 85
                  ? "bg-green-600"
                  : score.score >= 70
                  ? "bg-blue-600"
                  : score.score >= 50
                  ? "bg-yellow-500"
                  : "bg-red-600"
              }`}
            >
              AI {score.score} • {score.label}
            </span>
          </div>
        )}

        {/* COMPARE BUTTON */}
        <button
          onClick={() => onCompare(property)}
          className={`absolute top-3 right-3 px-2 py-1 text-xs rounded-full ${
            isSelected
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700"
          }`}
        >
          Compare
        </button>

        {/* CAROUSEL BUTTONS */}
        {imageArray.length > 1 && (
          <>
            <button
              onClick={prevImg}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-1 rounded-full"
            >
              <ChevronLeft size={16} />
            </button>

            <button
              onClick={nextImg}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-1 rounded-full"
            >
              <ChevronRight size={16} />
            </button>
          </>
        )}

        {/* PRICE */}
        <div className="absolute bottom-3 left-3 text-white font-bold text-lg">
          PKR {formatPrice?.(property.price || 0)}
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-4">

        <h3 className="font-bold text-gray-800 line-clamp-1">
          {property.title || property.address}
        </h3>

        <p className="text-sm text-gray-500">
          📍 {locationText}
        </p>

        {/* AI REASON */}
        {score && (
          <p className="text-[11px] text-gray-400 mt-1">
            {score.reason}
          </p>
        )}

      </div>
    </div>
  );
};

export default PropertyCard;