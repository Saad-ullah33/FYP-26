import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ChevronLeft, ChevronRight, User, Phone } from "lucide-react";

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mainIndex, setMainIndex] = useState(0);

  const user = JSON.parse(localStorage.getItem("user"));

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

  if (loading)
    return (
      <div className="p-10 text-center text-gray-500">
        Loading property...
      </div>
    );

  if (!property)
    return (
      <div className="p-10 text-center text-red-500">
        Property not found
      </div>
    );

  const images = property.images || [];
  const mainImage = images[mainIndex]?.cloudinary_src;

  const next = () =>
    setMainIndex((prev) =>
      prev < images.length - 1 ? prev + 1 : prev
    );

  const prev = () =>
    setMainIndex((prev) => (prev > 0 ? prev - 1 : prev));

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* HEADER */}
      <div className="max-w-6xl mx-auto px-4 pt-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {property.title}
        </h1>

        <p className="text-gray-500 mt-1">
          📍 {property.address} • {property.area},{" "}
          {property.city?.name}
        </p>
      </div>

      {/* IMAGE SECTION (SMALLER + CLEAN HERO) */}
      <div className="max-w-6xl mx-auto px-4 mt-6">

        <div className="relative rounded-2xl overflow-hidden shadow-lg">

          <img
            src={mainImage}
            className="w-full h-[360px] object-cover"
          />

          {images.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-3 top-1/2 bg-white p-2 rounded-full shadow"
              >
                <ChevronLeft size={18} />
              </button>

              <button
                onClick={next}
                className="absolute right-3 top-1/2 bg-white p-2 rounded-full shadow"
              >
                <ChevronRight size={18} />
              </button>
            </>
          )}
        </div>

        {/* THUMBNAILS */}
        <div className="flex gap-2 mt-3 overflow-x-auto">
          {images.map((img, i) => (
            <img
              key={i}
              src={img.cloudinary_src}
              onClick={() => setMainIndex(i)}
              className={`h-16 w-20 object-cover rounded-md cursor-pointer border ${
                i === mainIndex
                  ? "border-blue-600"
                  : "border-transparent"
              }`}
            />
          ))}
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="max-w-6xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">

          {/* OVERVIEW */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border">
            <h2 className="text-lg font-bold mb-4">
              Property Overview
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">

              <div className="bg-gray-50 p-3 rounded-lg">
                🛏 {property.bedrooms} Beds
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                🛁 {property.bathrooms} Baths
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                🏠 {property.propertyType}
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                📐 {property.area}
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                📌 {property.city?.name}
              </div>

            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border">
            <h2 className="text-lg font-bold mb-2">
              Description
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {property.description}
            </p>
          </div>

          {/* OWNER (PREMIUM TRUST CARD) */}
          {user && (
            <div className="bg-gradient-to-r from-blue-50 to-white border border-blue-100 rounded-2xl p-6 shadow-sm">

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center">
                  <User size={18} />
                </div>

                <div>
                  <h2 className="font-bold">
                    Verified Owner
                  </h2>
                  <p className="text-xs text-gray-500">
                    Trusted Seller on PropSightAI
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-gray-700 text-sm">

                <p>
                  <b>Name:</b>{" "}
                  {property.owner?.name || "Private Seller"}
                </p>

                <p className="flex items-center gap-2">
                  <Phone size={14} />
                  {property.owner?.phone || "Hidden"}
                </p>

              </div>

              <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700">
                Contact Owner
              </button>
            </div>
          )}
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="space-y-6">

          {/* PRICE CARD */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border sticky top-24">

            <p className="text-sm text-gray-500">Price</p>

            <p className="text-3xl font-bold text-blue-700">
              PKR {property.price}
            </p>

            <button className="w-full mt-4 bg-blue-600 text-white py-3 rounded-xl">
              Contact Seller
            </button>

            <button className="w-full mt-2 border py-3 rounded-xl hover:bg-gray-100">
              Schedule Visit
            </button>
          </div>
        </div>
      </div>

      {/* SIMILAR PROPERTIES */}
      <div className="max-w-6xl mx-auto px-4 mt-12 pb-10">

        <h2 className="text-xl font-bold mb-4">
          Similar Properties
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          {related.map((p) => (
            <div
              key={p.id}
              onClick={() => navigate(`/property/${p.id}`)}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md cursor-pointer"
            >

              <img
                src={p.images?.[0]?.cloudinary_src}
                className="h-40 w-full object-cover"
              />

              <div className="p-4">

                <p className="font-bold line-clamp-1">
                  {p.title}
                </p>

                <p className="text-sm text-gray-500">
                  {p.area}, {p.city?.name}
                </p>

                <p className="text-blue-600 font-bold mt-1">
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