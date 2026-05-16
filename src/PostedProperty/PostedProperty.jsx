import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PropertyCard from "./PropertyCard";

const PostedProperty = () => {
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    area: "",
    type: "All",
  });

  const [allProperties, setAllProperties] = useState([]);
  const [results, setResults] = useState(null);
  const [initialResults, setInitialResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const FIXED_CITY = "Faisalabad";

  const allowedAreas = [
    "Lyallpur Town", "Madina Town", "Jinnah Town", "Iqbal Town",
    "Chak Jhumra Town", "Jaranwala Town", "Samundri Town", "Tandlianwala Town",
    "Faisalabad City", "Faisalabad Sadar", "Chak Jhumra", "Jaranwala",
    "Samundri", "Tandlianwala", "D Ground", "People Colony No 1",
    "People Colony No 2", "Canal Road", "Susan Road", "Wapda City",
    "FDA City", "Citi Housing", "Gulberg", "Samanabad", "Millat Town",
    "Satiana Road", "Jaranwala Road", "Samundari Road", "Jhang Road",
  ];

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          "http://localhost:8080/api/properties/getAllProperties"
        );

        const props = res.data || [];
        setAllProperties(props);

        const shuffled = [...props].sort(() => 0.5 - Math.random());
        setInitialResults(shuffled.slice(0, 6));
      } catch (err) {
        console.log("Error fetching properties:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // 🔥 NAVIGATION FUNCTION
  const openProperty = (id) => {
    navigate(`/property/${id}`);
  };

  const handleSearch = () => {
    const filtered = allProperties.filter(
      (p) =>
        p.city?.name === FIXED_CITY &&
        (filters.area === "" || p.area === filters.area) &&
        (filters.type === "All" || p.propertyType === filters.type)
    );

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

        {/* FILTERS */}
        <div className="lg:col-span-3">
          <div className="bg-white p-6 rounded-2xl shadow">

            <h2 className="text-xl font-bold mb-4">
              Properties in {FIXED_CITY}
            </h2>

            {/* AREA */}
            <label className="text-sm font-bold">Area</label>
            <select
              value={filters.area}
              onChange={(e) =>
                setFilters({ ...filters, area: e.target.value })
              }
              className="w-full border p-3 rounded mt-2 mb-4"
            >
              <option value="">All Areas</option>
              {allowedAreas.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>

            {/* TYPE */}
            <label className="text-sm font-bold">Type</label>
            <div className="flex flex-wrap gap-2 mt-2 mb-4">
              {["All", "HOUSE", "APARTMENT", "PLOT", "SHOP"].map(
                (type) => (
                  <button
                    key={type}
                    onClick={() =>
                      setFilters({ ...filters, type })
                    }
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      filters.type === type
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100"
                    }`}
                  >
                    {type}
                  </button>
                )
              )}
            </div>

            <button
              onClick={handleSearch}
              className="w-full bg-black text-white py-3 rounded-xl"
            >
              Search
            </button>

            <button
              onClick={handleReset}
              className="w-full text-blue-600 mt-2"
            >
              Reset
            </button>
          </div>
        </div>

        {/* RESULTS */}
        <div className="lg:col-span-9">

          {loading && (
            <p className="text-center text-lg">Loading...</p>
          )}

          {/* INITIAL */}
          {!loading && !results && (
            <>
              <h2 className="text-2xl font-bold mb-6">
                Featured Properties
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {initialResults.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => openProperty(p.id)}
                    className="cursor-pointer"
                  >
                    <PropertyCard
                      property={p}
                      formatPrice={formatPrice}
                    />
                  </div>
                ))}
              </div>
            </>
          )}

          {/* NO RESULTS */}
          {results && results.length === 0 && (
            <p className="text-center text-gray-500">
              No Properties Found
            </p>
          )}

          {/* RESULTS */}
          {results && results.length > 0 && (
            <>
              <h2 className="text-2xl font-bold mb-6">
                Search Results
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {results.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => openProperty(p.id)}
                    className="cursor-pointer"
                  >
                    <PropertyCard
                      property={p}
                      formatPrice={formatPrice}
                    />
                  </div>
                ))}
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default PostedProperty;