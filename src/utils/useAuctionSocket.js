import { useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { getAccessToken } from "../utils/auth";


export const useAuctionSocket = (onMessage, auctionId) => {

  const clientRef = useRef(null);


  useEffect(() => {

    const token = getAccessToken();


    if (!token || !auctionId) {
      return;
    }


    const client = new Client({

      webSocketFactory: () =>
        new SockJS(
          "http://localhost:8080/ws"
        ),


      connectHeaders: {

        Authorization:
          `Bearer ${token}`

      },


      reconnectDelay: 5000,


      onConnect: () => {

        console.log(
          "Auction WebSocket connected"
        );


        client.subscribe(
          `/topic/auction/${auctionId}`,

          (message) => {

            const data =
              JSON.parse(message.body);


            onMessage(data);

          }
        );

      },


      onStompError: (frame) => {

        console.error(
          "STOMP Error:",
          frame
        );

      },


      onWebSocketError: (error) => {

        console.error(
          "WebSocket Error:",
          error
        );

      }

    });


    client.activate();


    clientRef.current = client;



    return () => {

      if (clientRef.current) {

        clientRef.current.deactivate();

      }

    };


  }, [auctionId]);

};