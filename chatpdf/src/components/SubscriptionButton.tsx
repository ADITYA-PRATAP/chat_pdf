
"use client"
import React,{useState} from 'react'
import {Button} from "../components/ui/button";
import axios from "axios";
type Props = {
    isPro: boolean,
    
}
const SubscriptionButton = (
    props: Props
) => {
     const [loading, setLoading] = useState(false);
  const handleSubscribe = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/stripe");
      window.location.href = response.data.url
      
    } catch (error) {
      
    } finally {
      setLoading(false);
      
    }
  };
  return (
    <div>
        <Button disabled={loading} onClick={handleSubscribe} variant={"secondary"}>
            {
                props.isPro ? "Manage Subscription" : "Get Pro"
            }
        </Button>
        </div>
  )
}

export default SubscriptionButton