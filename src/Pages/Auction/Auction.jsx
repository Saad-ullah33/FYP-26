import React, { useEffect, useState } from "react";

// ---------- Countdown ----------
const useCountdown = (endDate) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const diff = new Date(endDate) - new Date();

      if (diff <= 0) {
        setTimeLeft("Auction Ended");
        clearInterval(interval);
        return;
      }

      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);

      setTimeLeft(`${d}d ${h}h ${m}m`);
    }, 1000);

    return () => clearInterval(interval);
  }, [endDate]);

  return timeLeft;
};

// ---------- MOCK DATA ----------
const mockProperty = {
  id: 1,
  title: "Luxury House in Lahore",
  location: "DHA Phase 6, Lahore",
  images: [
    "https://via.placeholder.com/600x400?text=House+1",
    "https://via.placeholder.com/600x400?text=House+2",
    "https://via.placeholder.com/600x400?text=House+3",
  ],
  currentBid: 15000000,
  endDate: "2026-06-30",
  description:
    "Beautiful modern house with 5 bedrooms, parking, and garden.",
};

// ---------- MAIN ----------
const Auction = () => {
  const item = mockProperty;

  const countdown = useCountdown(item.endDate);

  const [selectedImage, setSelectedImage] = useState(
    item.images[0]
  );

  const [bidAmount, setBidAmount] = useState("");
  const [bids, setBids] = useState([
    { amount: 12000000 },
    { amount: 13500000 },
    { amount: 14500000 },
  ]);

  // ---------- Place Bid (Mock) ----------
  const handleBid = () => {
    const bid = parseFloat(bidAmount);

    if (!bid || bid <= item.currentBid) {
      alert("Bid must be higher than current bid");
      return;
    }

    // Add new bid locally
    setBids([{ amount: bid }, ...bids]);

    // Update current bid
    item.currentBid = bid;

    setBidAmount("");
    alert("Bid placed (mock) ✅");
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="grid lg:grid-cols-3 gap-6">

        {/* LEFT */}
        <div className="lg:col-span-2">

          {/* Gallery */}
          <div className="bg-white p-4 rounded-xl shadow">
            <img
              src={selectedImage}
              className="w-full h-80 object-cover rounded"
            />

            <div className="flex gap-2 mt-3">
              {item.images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  onClick={() => setSelectedImage(img)}
                  className="w-20 h-16 cursor-pointer rounded"
                />
              ))}
            </div>
          </div>

          {/* Info */}
          <h1 className="text-2xl font-bold mt-4">
            {item.title}
          </h1>
          <p className="text-gray-500">{item.location}</p>

          {/* Description */}
          <div className="mt-4 bg-white p-4 rounded-xl shadow">
            <h2 className="font-bold">Description</h2>
            <p>{item.description}</p>
          </div>

          {/* Bid History */}
          <div className="mt-4 bg-white p-4 rounded-xl shadow">
            <h2 className="font-bold mb-2">Bid History</h2>

            {bids.map((b, i) => (
              <div
                key={i}
                className="flex justify-between border-b py-1"
              >
                <span>Bid #{bids.length - i}</span>
                <span className="font-bold">
                  PKR {b.amount}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="bg-white p-4 rounded-xl shadow h-fit">
          <p>Current Bid</p>
          <h2 className="text-xl font-bold text-blue-600">
            PKR {item.currentBid}
          </h2>

          <p className="text-red-500 mt-2">
            {countdown}
          </p>

          <input
            type="number"
            placeholder="Enter your bid"
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
            className="w-full border p-2 mt-3 rounded"
          />

          <button
            onClick={handleBid}
            className="w-full mt-3 bg-blue-600 text-white py-2 rounded"
          >
            Place Bid
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auction;