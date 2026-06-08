import { API_BASE } from '../config';
import { useAuthStore } from '../store/useAuthStore';

const authHeaders = () => {
  const token = useAuthStore.getState().token;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const API_BASE_URL = `${API_BASE}/template`;
const PLANS_API_BASE_URL = API_BASE;

export const getCities = async () => {
  try {
    const response = await fetch(`${PLANS_API_BASE_URL}/get-cities/`, {
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error(`API request failed: ${response.status}`);
    return response.json();
  } catch (error) {
    console.error('Error fetching cities:', error);
    throw error;
  }
};

export const generatePlan = async (planningState, cityId = null, areaId = null) => {
  try {
    const tags = {
      category_tags: planningState.selectedCategoryTags || [],
      vibe_tags: planningState.selectedVibeTags || [],
      special_tags: planningState.selectedSpecialTags || [],
      price_tags: planningState.selectedPriceTags ? [planningState.selectedPriceTags] : [],
    };

    const body = { tags };
    if (cityId) body.city_id = cityId;
    if (areaId) body.area_id = areaId;

    const response = await fetch(`${API_BASE_URL}/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error generating plan:', error);
    throw error;
  }
};

export const getPlans = async () => {
  try {
    const response = await fetch(`${PLANS_API_BASE_URL}/get-plans/`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting plans:', error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await fetch(`${PLANS_API_BASE_URL}/auth/me/`, {
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
    });
    if (!response.ok) throw new Error(`API request failed: ${response.status}`);
    return response.json();
  } catch (error) {
    console.error('Error fetching current user:', error);
    throw error;
  }
};

export const setUserCity = async (cityName) => {
  try {
    const response = await fetch(`${PLANS_API_BASE_URL}/auth/set-city/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify({ city: cityName }),
    });
    if (!response.ok) throw new Error(`API request failed: ${response.status}`);
    return response.json();
  } catch (error) {
    console.error('Error setting user city:', error);
    throw error;
  }
};

export const getVenuesByIds = async (ids) => {
  try {
    const response = await fetch(`${PLANS_API_BASE_URL}/get-venues/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ids }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting venues:', error);
    throw error;
  }
};
