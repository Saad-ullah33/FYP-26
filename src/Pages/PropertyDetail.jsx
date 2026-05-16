import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `http://localhost:8080/api/properties/id/${id}`
      );

      const data = res.data;
      setProperty(data);

      const relatedRes = await axios.get(
        `http://localhost:8080/api/properties/type/${data.propertyType}`
      );

      setRelated((relatedRes.data || []).filter((p) => p.id !== data.id));
    } catch (err) {
      console.log(err);
      setProperty(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">
        Loading property...
      </div>
    );
  }

  if (!property) {
    return (
      <div className="p-10 text-center text-red-500">
        Property not found
      </div>
    );
  }

  const mainImage = property.images?.[0]?.cloudinary_src;

  return (
    <div className="bg-gray-100 min-h-screen">

      {/* HERO SECTION */}
      <div className="bg-white shadow">
        <div className="max-w-6xl mx-auto p-5">

          <h1 className="text-2xl font-bold text-gray-800">
            {property.title}
          </h1>

          <p className="text-gray-500 mt-1">
            {property.address} • {property.city?.name} • {property.area}
          </p>

          <div className="mt-3 flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">Price</p>
              <p className="text-2xl font-bold text-blue-700">
                PKR {property.price}
              </p>
            </div>

            <div className="text-sm text-gray-600">
              <p>
                <b>Purpose:</b> {property.purpose}
              </p>
              <p>
                <b>Type:</b> {property.propertyType}
              </p>
            </div>

          </div>

        </div>
      </div>

      {/* BODY */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 p-5">

        {/* LEFT SIDE */}
        <div className="lg:col-span-2 space-y-6">

          {/* MAIN IMAGE */}
          <div className="bg-white rounded-xl overflow-hidden shadow">
            {mainImage ? (
              <img
                src={mainImage}
                className="w-full h-[400px] object-cover"
              />
            ) : (
              <div className="h-[400px] flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}
          </div>

          {/* GALLERY */}
          <div className="grid grid-cols-4 gap-2">
            {property.images?.slice(0, 4).map((img) => (
              <img
                key={img.id}
                src={img.cloudinary_src}
                className="h-24 w-full object-cover rounded"
              />
            ))}
          </div>

          {/* DETAILS CARD */}
          <div className="bg-white rounded-xl shadow p-5">

            <h2 className="text-lg font-bold mb-3">Details</h2>

            <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">

              <p><b>Bedrooms:</b> {property.bedrooms || "N/A"}</p>
              <p><b>Bathrooms:</b> {property.bathrooms || "N/A"}</p>
              <p><b>Area:</b> {property.area}</p>
              <p><b>Purpose:</b> {property.purpose}</p>
              <p><b>Type:</b> {property.propertyType}</p>
              <p>
                <b>Auction:</b>{" "}
                {property.auctionEnabled ? "Yes" : "No"}
              </p>

            </div>

          </div>

          {/* DESCRIPTION */}
          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="text-lg font-bold mb-2">Description</h2>
            <p className="text-gray-600">
              {property.description || "No description available"}
            </p>
          </div>

        </div>

        {/* RIGHT SIDE (SIDEBAR) */}
        <div className="space-y-4">

          {/* PRICE BOX */}
          <div className="bg-white rounded-xl shadow p-5">
            <p className="text-sm text-gray-500">Price</p>
            <p className="text-2xl font-bold text-blue-700">
              PKR {property.price}
            </p>
            <button className="w-full mt-3 bg-blue-600 text-white py-2 rounded-lg">
              Contact Seller
            </button>
          </div>

          {/* OWNER */}
          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="font-bold mb-2">Owner Info</h2>
            <p><b>Name:</b> {property.owner?.name || "Private Seller"}</p>
            <p><b>Phone:</b> {property.owner?.phone || "Hidden"}</p>
          </div>

          {/* LOCATION */}
          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="font-bold mb-2">Location</h2>
            <p className="text-gray-600">
              {property.address}
            </p>
            <p className="text-gray-500 text-sm">
              {property.city?.name}, {property.area}
            </p>
          </div>

        </div>

      </div>

      {/* RELATED */}
      <div className="max-w-6xl mx-auto p-5">
        <h2 className="text-xl font-bold mb-4">Similar Properties</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {related.map((p) => (
            <div
              key={p.id}
              onClick={() => navigate(`/property/${p.id}`)}
              className="bg-white rounded-xl shadow cursor-pointer overflow-hidden"
            >
              <img
                src={p.images?.[0]?.cloudinary_src}
                className="h-40 w-full object-cover"
              />
              <div className="p-3">
                <p className="font-bold">{p.title}</p>
                <p className="text-sm text-gray-500">
                  {p.city?.name}
                </p>
                <p className="text-blue-600 font-bold">
                  PKR {p.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default PropertyDetail;