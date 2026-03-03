import React, { createContext, useContext, useState, useEffect } from 'react';
import { theatreAPI } from '../services/api';

const CityContext = createContext();

export const useCity = () => {
    return useContext(CityContext);
};

export const CityProvider = ({ children }) => {
    const [cities, setCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState(localStorage.getItem('selectedCity') || '');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCities();
    }, []);

    const loadCities = async () => {
        try {
            const theatresData = await theatreAPI.getTheatres();
            const uniqueCities = [...new Set(theatresData.map(t => t.city))].sort();
            setCities(uniqueCities);
        } catch (error) {
            console.error('Error loading cities:', error);
            setCities([]);
        } finally {
            setLoading(false);
        }
    };

    const changeCity = (city) => {
        setSelectedCity(city);
        if (city) {
            localStorage.setItem('selectedCity', city);
        } else {
            localStorage.removeItem('selectedCity');
        }
    };

    const value = {
        cities,
        selectedCity,
        changeCity,
        loading
    };

    return (
        <CityContext.Provider value={value}>
            {children}
        </CityContext.Provider>
    );
};
