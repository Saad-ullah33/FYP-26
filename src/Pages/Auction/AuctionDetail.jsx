import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import axios from "axios";

const AuctionDetail = () => {
  const { id } = useParams();

  const [auction, setAuction] = useState(null);
  const [bidAmount, setBidAmount] = useState("");
  const [bids, setBids] = useState([]);

  // ================= LOAD AUCTION =================
  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/auctions/${id}`)
      .then((res) => setAuction(res.data))
      .catch((err) => console.log(err));
  }, [id]);

  // ================= LIVE WEBSOCKET =================
  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
      reconnectDelay: 3000,

      onConnect: () => {
        client.subscribe(`/topic/auction/${id}`, (msg) => {
          const newBid = JSON.parse(msg.body);

          setAuction((prev) => ({
            ...prev,
            currentHighestBid: newBid.amount,
          }));

          setBids((prev) => [newBid, ...prev]);
        });
      },
    });

    client.activate();
    return () => client.deactivate();
  }, [id]);

  // ================= PLACE BID =================
  const placeBid = async () => {
    if (!bidAmount) return;

    const bid = {
      auctionId: Number(id),
      userId: 1, // replace with logged-in user later
      amount: parseFloat(bidAmount),
    };

    try {
      await axios.post("http://localhost:8080/api/bid/placebid", bid);
      setBidAmount("");
    } catch (err) {
      console.log("Bid error:", err.response?.data || err.message);
    }
  };

  if (!auction) return <div>Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6">

      <img
        src={auction.imageUrl}
        className="w-full h-96 object-cover rounded-xl"
      />

      <h1 className="text-3xl font-bold mt-4">{auction.title}</h1>
      <p className="text-gray-500">{auction.location}</p>

      <h2 className="text-2xl text-blue-600 font-bold mt-3">
        Current Bid: PKR {auction.currentHighestBid}
      </h2>

      {/* BID INPUT */}
      <div className="flex gap-3 mt-5">
        <input
          value={bidAmount}
          onChange={(e) => setBidAmount(e.target.value)}
          className="border p-2 w-full rounded"
          placeholder="Enter bid"
        />

        <button
          onClick={placeBid}
          className="bg-blue-600 text-white px-6 rounded"
        >
          Place Bid
        </button>
      </div>

      {/* LIVE BIDS */}
      <div className="mt-6">
        <h3 className="font-bold mb-2">Live Bids</h3>

        {bids.length === 0 && (
          <p className="text-gray-400">No bids yet</p>
        )}

        {bids.map((b, i) => (
          <div key={i} className="border-b py-2 flex justify-between">
            <span>{b.bidderName || "User"}</span>
            <span className="text-blue-600 font-bold">
              PKR {b.amount}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AuctionDetail;