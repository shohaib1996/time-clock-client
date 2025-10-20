import { useState, useEffect } from 'react';

interface User {
  name: string;
  email: string;
  role: string;
  id: string
}

const useUser = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing user data from local storage:', error);
        setUser(null);
      }
    }
  }, []);

  return user;
};

export default useUser;
