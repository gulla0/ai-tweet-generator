// src/context/AppContext.tsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Transcript, Tweet } from '../types';
import * as api from '../services/api';

// State type
interface AppState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  transcripts: Transcript[];
  selectedTranscript: Transcript | null;
  tweets: Tweet[];
  view: 'list' | 'form' | 'tweets';
}

// Initial state
const initialState: AppState = {
  isAuthenticated: false,
  isLoading: false,
  error: null,
  transcripts: [],
  selectedTranscript: null,
  tweets: [],
  view: 'list',
};

// Action types
type AppAction =
  | { type: 'SET_LOADING', payload: boolean }
  | { type: 'SET_ERROR', payload: string | null }
  | { type: 'SET_AUTHENTICATED', payload: boolean }
  | { type: 'SET_TRANSCRIPTS', payload: Transcript[] }
  | { type: 'SET_SELECTED_TRANSCRIPT', payload: Transcript | null }
  | { type: 'SET_TWEETS', payload: Tweet[] }
  | { type: 'SET_VIEW', payload: 'list' | 'form' | 'tweets' }
  | { type: 'UPDATE_TWEET', payload: Tweet }
  | { type: 'REMOVE_TWEET', payload: string };

// Reducer function
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_AUTHENTICATED':
      return { ...state, isAuthenticated: action.payload };
    case 'SET_TRANSCRIPTS':
      return { ...state, transcripts: action.payload };
    case 'SET_SELECTED_TRANSCRIPT':
      return { ...state, selectedTranscript: action.payload };
    case 'SET_TWEETS':
      return { ...state, tweets: action.payload };
    case 'SET_VIEW':
      return { ...state, view: action.payload };
    case 'UPDATE_TWEET':
      return {
        ...state,
        tweets: state.tweets.map(tweet => 
          tweet.id === action.payload.id ? action.payload : tweet
        )
      };
    case 'REMOVE_TWEET':
      return {
        ...state,
        tweets: state.tweets.filter(tweet => tweet.id !== action.payload)
      };
    default:
      return state;
  }
};

// Create context
interface AppContextType {
  state: AppState;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  fetchTranscripts: () => Promise<void>;
  createTranscript: (transcript: { title: string; date: string; content: string }) => Promise<void>;
  selectTranscript: (transcript: Transcript) => Promise<void>;
  fetchTweets: (transcriptId: string) => Promise<void>;
  getSampleTranscript: () => Promise<string>;
  setView: (view: 'list' | 'form' | 'tweets') => void;
  sendTweet: (tweetId: string) => Promise<void>;
  editTweet: (tweetId: string, content: string) => Promise<void>;
  deleteTweet: (tweetId: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Check auth status on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch({ type: 'SET_AUTHENTICATED', payload: true });
    }
  }, []);

  // Login
  const login = async (email: string, password: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    
    try {
      const response = await api.login(email, password);
      
      if (response.success && response.token) {
        localStorage.setItem('token', response.token);
        dispatch({ type: 'SET_AUTHENTICATED', payload: true });
      } else {
        throw new Error(response.message || 'Authentication failed');
      }
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Login failed' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('token');
    dispatch({ type: 'SET_AUTHENTICATED', payload: false });
  };

  // Fetch transcripts
  const fetchTranscripts = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    
    try {
      const transcripts = await api.getTranscripts();
      dispatch({ type: 'SET_TRANSCRIPTS', payload: transcripts });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to fetch transcripts' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Create transcript
  const createTranscript = async (transcript: { title: string; date: string; content: string }) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    
    try {
      await api.createTranscript(transcript);
      dispatch({ type: 'SET_VIEW', payload: 'list' });
      await fetchTranscripts();
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to create transcript' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Select transcript and navigate to tweets view
  const selectTranscript = async (transcript: Transcript) => {
    dispatch({ type: 'SET_SELECTED_TRANSCRIPT', payload: transcript });
    dispatch({ type: 'SET_VIEW', payload: 'tweets' });
    await fetchTweets(transcript.id);
  };

  // Fetch tweets
  const fetchTweets = async (transcriptId: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    
    try {
      const tweets = await api.getTranscriptTweets(transcriptId);
      dispatch({ type: 'SET_TWEETS', payload: tweets });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to fetch tweets' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Get sample transcript
  const getSampleTranscript = async () => {
    try {
      const response = await api.getSampleTranscript();
      return response.content;
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to get sample transcript' });
      throw error;
    }
  };

  // Set view
  const setView = (view: 'list' | 'form' | 'tweets') => {
    dispatch({ type: 'SET_VIEW', payload: view });
  };

  // Send tweet
  const sendTweet = async (tweetId: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    
    try {
      const response = await api.sendTweet(tweetId);
      dispatch({ type: 'UPDATE_TWEET', payload: response.tweet });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to send tweet' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Edit tweet
  const editTweet = async (tweetId: string, content: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    
    try {
      const response = await api.editTweet(tweetId, { content });
      dispatch({ type: 'UPDATE_TWEET', payload: response.tweet });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to edit tweet' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Delete tweet
  const deleteTweet = async (tweetId: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    
    try {
      await api.deleteTweet(tweetId);
      dispatch({ type: 'REMOVE_TWEET', payload: tweetId });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to delete tweet' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const value = {
    state,
    login,
    logout,
    fetchTranscripts,
    createTranscript,
    selectTranscript,
    fetchTweets,
    getSampleTranscript,
    setView,
    sendTweet,
    editTweet,
    deleteTweet
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook to use the context
export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};