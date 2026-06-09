import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

const AuctionListingPage = () => {
  const navigate = useNavigate();

  const [auctions, setAuctions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [auctionType, setAuctionType] = useState("ACTIVE");
  const [loading, setLoading] = useState(false);

  const locations = [
    "Madina Town",
    "Lyallpur Town",
    "Jinnah Town",
    "D Ground",
    "Peoples Colony",
    "Gulberg",
    "Canal Road",
    "Satiana Road",
    "Susan Road",
    "Wapda City",
    "Eden Valley",
    "Samundari Road",
  ];

  // ================= FETCH AUCTIONS =================
  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `http://localhost:8080/api/auctions?view=PUBLIC${
            auctionType !== "ALL" ? `&status=${auctionType}` : ""
          }`
        );

        const result = await response.json();

        const data =
          result?.data ||
          result?.result ||
          result ||
          [];

        setAuctions(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching auctions:", error);
        setAuctions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAuctions();
  }, [auctionType]);

  // ================= FILTER (PRO STYLE - useMemo) =================
  const filteredAuctions = useMemo(() => {
    return auctions.filter((item) => {
      const matchLocation =
        selectedLocation === "" ||
        item.location?.toLowerCase().includes(selectedLocation.toLowerCase());

      return matchLocation;
    });
  }, [auctions, selectedLocation]);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold">
            Property Auctions
          </h1>
          <p className="mt-3 text-gray-200">
            Discover premium auctions in Faisalabad
          </p>
        </div>
      </div>

      {/* MAIN */}
      <div className="max-w-7xl mx-auto px-4 py-8">

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* FILTER */}
          <div className="bg-white p-5 rounded-2xl shadow-sm h-fit">

            <h2 className="text-xl font-bold mb-4">Filters</h2>

            {/* STATUS */}
            <label className="font-semibold text-sm">Status</label>
            <select
              value={auctionType}
              onChange={(e) => setAuctionType(e.target.value)}
              className="w-full border p-2 rounded mt-2 mb-4"
            >
              <option value="ALL">All</option>
              <option value="ACTIVE">Active</option>
              <option value="CLOSED">Closed</option>
              <option value="SOLD">Sold</option>
            </select>

            {/* LOCATION */}
            <label className="font-semibold text-sm">Location</label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full border p-2 rounded mt-2"
            >
              <option value="">All</option>
              {locations.map((loc, i) => (
                <option key={i} value={loc}>
                  {loc}
                </option>
              ))}
            </select>

            {/* RESET */}
            <button
              onClick={() => {
                setAuctionType("ACTIVE");
                setSelectedLocation("");
              }}
              className="mt-4 w-full bg-gray-100 hover:bg-gray-200 py-2 rounded text-sm"
            >
              Reset Filters
            </button>

          </div>

          {/* LISTINGS */}
          <div className="lg:col-span-3">

            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : filteredAuctions.length === 0 ? (
              <div className="text-center text-gray-500 py-20">
                No auctions found
              </div>
            ) : (

              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">

                {filteredAuctions.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition overflow-hidden"
                  >

                    <img
                      src={item.imageUrl}
                      className="w-full h-48 object-cover"
                      alt={item.title}
                    />

                    <div className="p-4">

                      <h2 className="font-semibold text-lg truncate">
                        {item.title}
                      </h2>

                      <p className="text-sm text-gray-500">
                        {item.location}
                      </p>

                      <div className="flex justify-between items-center mt-3">

                        <p className="text-blue-600 font-bold">
                          PKR {item.currentBid}
                        </p>

                        <span className="text-xs px-2 py-1 rounded bg-gray-100">
                          {item.status}
                        </span>

                      </div>

                      <button
                        onClick={() => navigate(`/auction/${item.id}`)}
                        className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl"
                      >
                        View Details
                      </button>

                    </div>

                  </div>
                ))}

              </div>

            )}

          </div>

        </div>
      </div>
    </div>
  );
};

export default AuctionListingPage;