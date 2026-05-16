import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const PropertyListing = () => {
  const { type } = useParams();
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProperties();
  }, [type]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError("");

      const formattedType = type?.toUpperCase();

      const res = await axios.get(
        `http://localhost:8080/api/properties/type/${formattedType}`
      );

      setProperties(res.data || []);
    } catch (err) {
      console.log(err);
      setError("Failed to load properties");
    } finally {
      setLoading(false);
    }
  };

  const openDetail = (id) => {
    navigate(`/property/${id}`);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* TITLE */}
      <h1 className="text-3xl font-bold mb-6">
        {type?.toUpperCase()} Properties
      </h1>

      {/* LOADING */}
      {loading && <p>Loading properties...</p>}

      {/* ERROR */}
      {error && <p className="text-red-500">{error}</p>}

      {/* EMPTY */}
      {!loading && properties.length === 0 && !error && (
        <p>No properties found</p>
      )}

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {properties.map((p) => (
          <div
            key={p.id}
            onClick={() => openDetail(p.id)}
            className="bg-white rounded-xl shadow cursor-pointer hover:shadow-lg transition"
          >

            {/* IMAGE */}
            <img
              src={p.images?.[0]?.cloudinary_src || "https://via.placeholder.com/400"}
              className="h-48 w-full object-cover rounded-t-xl"
            />

            {/* CONTENT */}
            <div className="p-4">

              <h2 className="font-bold text-lg">{p.title}</h2>

              <p className="text-gray-500">
                {p.city?.name || "No City"}
              </p>

              <p className="text-blue-600 font-bold mt-2">
                PKR {p.price}
              </p>

              <div className="mt-2 text-xs flex gap-2">
                <span className="bg-gray-100 px-2 py-1 rounded">
                  {p.propertyType}
                </span>

                {p.auctionEnabled && (
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
                    Auction
                  </span>
                )}

                {p.featured && (
                  <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                    Featured
                  </span>
                )}
              </div>

            </div>

          </div>
        ))}

      </div>
    </div>
  );
};

export default PropertyListing;