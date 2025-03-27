import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

// The isAuthenticated function checks if the user is logged in by calling the backend
const isAuthenticated = async () => {
  try {
    const response = await axios.get('http://localhost:8080//auth/checksession', {
      withCredentials: true, // Ensure cookies are included
    });

    // Return the response from backend, assuming it contains a message like "Authenticated"
    return response.data;
  } catch (error) {
    return { message: 'Not Authenticated' }; // Handle errors by assuming user is not authenticated
  }
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [auth, setAuth] = useState(false);   // State to track if the user is authenticated
  const [loading, setLoading] = useState(true); // State to track if the check is still loading

  useEffect(() => {
    const checkAuthStatus = async () => {
      const result = await isAuthenticated(); // Check if the user is authenticated
      console.log(result); // Debugging purpose to see the backend response
      
      // Check if backend returned "Authenticated" message
      if (result.message === 'Authenticated') {
        setAuth(true); // Mark the user as authenticated
      }
      setLoading(false); // Stop loading once the check is done
    };

    checkAuthStatus(); // Call the function when the component mounts
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Optionally show a loading spinner or message while checking
  }

  // If the user is authenticated, render the children component (protected content)
  // If not authenticated, redirect to login page
  return auth ? <>{children}</> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
