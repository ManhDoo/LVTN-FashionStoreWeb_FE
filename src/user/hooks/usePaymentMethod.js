import { useState, useEffect } from "react";
import axios from "../utils/axios";

const usePaymentMethods = () => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const response = await axios.get("/api/payment");
        setPaymentMethods(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to fetch payment methods");
        setLoading(false);
      }
    };

    fetchPaymentMethods();
  }, []);

  return { paymentMethods, loading, error };
};

export default usePaymentMethods;