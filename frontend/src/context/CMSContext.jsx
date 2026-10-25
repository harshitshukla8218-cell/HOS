import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api.js';

const CMSContext = createContext();

export const CMSProvider = ({ children }) => {
  const [cmsData, setCmsData] = useState({
    announcement: "FREE SHIPPING ACROSS INDIA — NEW COLLECTION — SHOP NOW",
    hero: {
      heading: "THE NEW STANDARD OF MODERN LUXURY",
      subheading: "Designed for women who define their own style.",
      desktopImage: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2560&auto=format&fit=crop",
      mobileImage: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1440&auto=format&fit=crop"
    },
    editorialBanner: {
      heading: "THE ART OF DRESSING",
      subheading: "Contemporary silhouettes. Timeless confidence.",
      image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2560&auto=format&fit=crop"
    },
    featuredCollection: {
      heading: "THE SIGNATURE EDIT",
      subheading: "Where refined silhouettes meet modern femininity.",
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2560"
    },
    brandStory: {
      heading: "THE HOS",
      text: "House of Simons creates contemporary fashion for women who value individuality, craftsmanship and effortless elegance.",
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600"
    }
  });
  const [loading, setLoading] = useState(true);

  const fetchCMSData = async () => {
    try {
      const data = await api.get('/cms');
      if (data && data.hero) {
        setCmsData(data);
      }
    } catch (error) {
      console.error('Error fetching CMS data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCMSData();
  }, []);

  const updateCMSData = async (newCmsData) => {
    try {
      const data = await api.put('/cms', newCmsData);
      setCmsData(data);
      return data;
    } catch (error) {
      console.error('Error updating CMS data:', error);
      throw error;
    }
  };

  return (
    <CMSContext.Provider value={{ cmsData, loading, updateCMSData, refreshCMS: fetchCMSData }}>
      {children}
    </CMSContext.Provider>
  );
};

export const useCMS = () => useContext(CMSContext);
export default CMSContext;
