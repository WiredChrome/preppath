// Rahul Edited

"use client";

import React, { useEffect, useRef } from "react";
import Vapi from "@vapi-ai/web";

export const VapiChat = () => {

    const AssistID = process.env.NEXT_PUBLIC_VAPI_API_KEY

    const vapiRef = useRef<any>(null)

  useEffect(() => {
    if(AssistID)
    {const vapi = new Vapi(AssistID);

    vapiRef.current = vapi;

    // Optional: Handle events
    vapi.on("speech-start", () => {
      console.log("User started speaking");
    });

    vapi.on("speech-end", () => {
      console.log("User stopped speaking");
    });

    vapi.on("message", (msg) => {
      console.log("Assistant:", msg);
    });

    return () => {
      vapi.stop();
    };
    }
  }, []);

  const startCall = ()=> {
    vapiRef.current.start(process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID);
  }
  const stopCall = ()=> {
    vapiRef.current.stop();
  }

  return (
    <div>
        <button onClick={startCall}> Start Voice Chat</button>
        <button onClick={stopCall}> Stop Voice Chat</button>
    </div>
  )
};
