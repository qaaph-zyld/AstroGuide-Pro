/**
 * Firebase service for managing birth charts
 */

import { db } from './firebaseConfig';
import { collection, doc, addDoc, getDoc, getDocs, query, where, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { BirthChart, BirthData } from '../astrology/models/types';
import { calculateBirthChart } from '../astrology/calculations/chartCalculator';

// Collection name for birth charts
const CHARTS_COLLECTION = 'birthCharts';

/**
 * Save a new birth chart to Firestore
 * @param birthData - The birth data for the chart
 * @param userId - The user ID who owns the chart
 * @param name - Optional name for the chart
 * @returns Promise with the new chart ID
 */
export const saveBirthChart = async (
  birthData: BirthData,
  userId: string,
  name?: string
): Promise<string> => {
  try {
    // Calculate the birth chart
    const birthChart = calculateBirthChart(birthData);
    
    // Add user ID and name to the chart data
    const chartData = {
      ...birthChart,
      userId,
      name: name || `Chart - ${birthData.location}`,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    
    // Add to Firestore
    const docRef = await addDoc(collection(db, CHARTS_COLLECTION), chartData);
    return docRef.id;
  } catch (error) {
    console.error('Error saving birth chart:', error);
    throw new Error('Failed to save birth chart');
  }
};

/**
 * Get a birth chart by ID
 * @param chartId - The ID of the chart to retrieve
 * @param userId - The user ID for verification (optional)
 * @returns Promise with the birth chart or null if not found
 */
export const getBirthChart = async (
  chartId: string,
  userId?: string
): Promise<BirthChart | null> => {
  try {
    // Get the document
    const docRef = doc(db, CHARTS_COLLECTION, chartId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null;
    }
    
    const chartData = docSnap.data() as BirthChart & { userId: string };
    
    // If userId is provided, verify ownership
    if (userId && chartData.userId !== userId) {
      console.warn('User attempted to access chart they do not own');
      return null;
    }
    
    return {
      ...chartData,
      id: docSnap.id,
    };
  } catch (error) {
    console.error('Error getting birth chart:', error);
    throw new Error('Failed to retrieve birth chart');
  }
};

/**
 * Get all birth charts for a user
 * @param userId - The user ID
 * @returns Promise with an array of birth charts
 */
export const getUserBirthCharts = async (userId: string): Promise<BirthChart[]> => {
  try {
    // Query charts by userId
    const q = query(collection(db, CHARTS_COLLECTION), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    // Map documents to birth charts
    const charts: BirthChart[] = [];
    querySnapshot.forEach((doc) => {
      charts.push({
        ...doc.data() as BirthChart,
        id: doc.id,
      });
    });
    
    // Sort by creation date (newest first)
    return charts.sort((a, b) => {
      const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(0);
      const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(0);
      return dateB.getTime() - dateA.getTime();
    });
  } catch (error) {
    console.error('Error getting user birth charts:', error);
    throw new Error('Failed to retrieve birth charts');
  }
};

/**
 * Update an existing birth chart
 * @param chartId - The ID of the chart to update
 * @param updates - The fields to update
 * @param userId - The user ID for verification
 * @returns Promise that resolves when the update is complete
 */
export const updateBirthChart = async (
  chartId: string,
  updates: Partial<BirthChart>,
  userId: string
): Promise<void> => {
  try {
    // Get the chart first to verify ownership
    const chart = await getBirthChart(chartId, userId);
    if (!chart) {
      throw new Error('Chart not found or access denied');
    }
    
    // Update the document
    const docRef = doc(db, CHARTS_COLLECTION, chartId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating birth chart:', error);
    throw new Error('Failed to update birth chart');
  }
};

/**
 * Delete a birth chart
 * @param chartId - The ID of the chart to delete
 * @param userId - The user ID for verification
 * @returns Promise that resolves when the deletion is complete
 */
export const deleteBirthChart = async (
  chartId: string,
  userId: string
): Promise<void> => {
  try {
    // Get the chart first to verify ownership
    const chart = await getBirthChart(chartId, userId);
    if (!chart) {
      throw new Error('Chart not found or access denied');
    }
    
    // Delete the document
    const docRef = doc(db, CHARTS_COLLECTION, chartId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting birth chart:', error);
    throw new Error('Failed to delete birth chart');
  }
};

export default {
  saveBirthChart,
  getBirthChart,
  getUserBirthCharts,
  updateBirthChart,
  deleteBirthChart,
};
