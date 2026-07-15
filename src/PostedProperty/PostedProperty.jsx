import React, { useState, useEffect } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import PropertyCard from "./PropertyCard";
import SmartLocationSelect from "./SmartLocationSelect";
import { FAISALABAD_LOCATIONS } from "../constants/faisalabadLocations";

const PostedProperty = () => {
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    area: "",
    type: "All",
  });


const [compareList, setCompareList] = useState([]);
const [wishlist, setWishlist] = useState([]);

const handleCompare = (property) => {
  setCompareList((prev) => {
    const exists = prev.find((p) => p.id === property.id);
    if (exists) return prev.filter((p) => p.id !== property.id);
    if (prev.length < 3) return [...prev, property];
    return prev;
  });
};

const handleWishlist = (property) => {
  setWishlist((prev) => {
    const exists = prev.find((p) => p.id === property.id);
    if (exists) return prev.filter((p) => p.id !== property.id);
    return [...prev, property];
  });
};


  const [allProperties, setAllProperties] = useState([]);
  const [results, setResults] = useState(null);
  const [initialResults, setInitialResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const FIXED_CITY = "Faisalabad";

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);

        const res = await api.get("/properties/getAllProperties");

        const props = Array.isArray(res.data)
          ? res.data
          : res.data?.data || [];
        const normalized = props.map((p) => ({
          ...p,
          imageUrl:
            p.images?.[0]?.cloudinary_src ||
            p.image?.cloudinary_src ||
            p.photoUrl ||
            p.url ||
            null,
        }));

        setAllProperties(normalized);

        const shuffled = [...normalized].sort(() => 0.5 - Math.random());
        setInitialResults(shuffled.slice(0, 6));
      } catch (err) {
        console.log("ERROR:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const openProperty = (id) => {
    if (!id) return;
    navigate(`/property/${id}`);
  };

  const handleSearch = () => {
    const filtered = allProperties.filter((p) => {
      if (!p) return false;

      return (
        (p.city?.name || p.city) === FIXED_CITY &&
        (filters.area === "" || p.area === filters.area) &&
        (filters.type === "All" || p.propertyType === filters.type)
      );
    });

    setResults(filtered);
  };

  const handleReset = () => {
    setFilters({ area: "", type: "All" });
    setResults(null);
  };

  const formatPrice = (p) =>
    p >= 10000000
      ? `${(p / 10000000).toFixed(2)} Crore`
      : `${(p / 100000).toFixed(2)} Lakh`;

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* LEFT FILTER PANEL */}
        <div className="lg:col-span-3">

          <div className="bg-white rounded-2xl shadow-lg border p-6 sticky top-24">

            <h2 className="text-lg font-bold text-gray-800">
              Search Properties
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Faisalabad Verified Locations Only
            </p>

            <div className="mt-6 space-y-4">

              {/* CITY */}
              <div>
                <label className="text-sm font-medium text-gray-600">
                  City
                </label>

                <input
                  value="Faisalabad"
                  disabled
                  className="w-full mt-1 px-3 py-2 border rounded-lg bg-gray-100 text-gray-600"
                />
              </div>

              {/* LOCATION */}
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Location / Area
                </label>

                <SmartLocationSelect
                  value={filters.area}
                  options={FAISALABAD_LOCATIONS}
                  onChange={(val) =>
                    setFilters({ ...filters, area: val })
                  }
                />
              </div>

              {/* TYPE */}
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Property Type
                </label>

                <select
                  value={filters.type}
                  onChange={(e) =>
                    setFilters({ ...filters, type: e.target.value })
                  }
                  className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All">All Types</option>
                  <option value="HOUSE">House</option>
                  <option value="FLAT">Flat</option>
                  <option value="APARTMENT">Apartment</option>
                  <option value="COMMERCIAL">Commercial</option>
                  <option value="INDUSTRIAL">Industrial</option>
                  <option value="AGRICULTURE">Agriculture</option>
                </select>
              </div>

              {/* BUTTONS */}
              <div className="pt-2 space-y-2">

                <button
                  onClick={handleSearch}
                  className="w-full bg-gradient-to-r from-blue-700 to-blue-500 text-white py-2.5 rounded-lg font-semibold hover:shadow-lg transition"
                >
                  Search Properties
                </button>

                <button
                  onClick={handleReset}
                  className="w-full text-sm text-gray-600 hover:text-blue-600"
                >
                  Reset Filters
                </button>

              </div>

            </div>
          </div>
        </div>

        {/* RIGHT RESULTS PANEL */}
        <div className="lg:col-span-9">

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Featured Properties
            </h2>

            <p className="text-sm text-gray-500">
              Handpicked listings in Faisalabad
            </p>
          </div>

          {loading && (
            <div className="text-center py-10 text-gray-500">
              Loading properties...
            </div>
          )}

          {!loading && !results && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {initialResults.map((p, index) => (
                <div
                  key={p?.id || index}
                  onClick={() => openProperty(p?.id)}
                  className="cursor-pointer hover:scale-[1.02] transition"
                >
                  <PropertyCard property={p} formatPrice={formatPrice} />
                </div>
              ))}
            </div>
          )}

          {results && results.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              No Properties Found
            </div>
          )}

          {results && results.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((p, index) => (
                <div
                  key={p?.id || index}
                  onClick={() => openProperty(p?.id)}
                  className="cursor-pointer hover:scale-[1.02] transition"
                >
                  <PropertyCard property={p} formatPrice={formatPrice} />
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default PostedProperty;