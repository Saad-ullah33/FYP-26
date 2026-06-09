import { useEffect } from "react";

export const useAuctionSocket = (onMessage) => {
  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080/ws/auction");

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onMessage(data);
    };

    return () => socket.close();
  }, []);
};