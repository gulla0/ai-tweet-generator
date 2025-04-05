// src/context/AppContext.tsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Transcript, Tweet, XCredentialType } from '../types';
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
  xCredentials: XCredentialType | null;
  xCredentialsValid: boolean | null;
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
  xCredentials: null,
  xCredentialsValid: null,
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
  | { type: 'REMOVE_TWEET', payload: string }
  | { type: 'SET_X_CREDENTIALS', payload: XCredentialType | null }
  | { type: 'SET_X_CREDENTIALS_VALID', payload: boolean | null };

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
    case 'SET_X_CREDENTIALS':
      return { ...state, xCredentials: action.payload, xCredentialsValid: null };
    case 'SET_X_CREDENTIALS_VALID':
      return { ...state, xCredentialsValid: action.payload };
    default:
      return state;
  }
};

// Create context
interface AppContextType {
  state: AppState;
  enterApp: (xCredentials?: XCredentialType) => Promise<void>;
  exitApp: () => void;
  fetchTranscripts: () => Promise<void>;
  createTranscript: (transcript: { title: string; date: string; content: string }) => Promise<void>;
  selectTranscript: (transcript: Transcript) => Promise<void>;
  fetchTweets: (transcriptId: string) => Promise<void>;
  getSampleTranscript: () => Promise<string>;
  setView: (view: 'list' | 'form' | 'tweets') => void;
  sendTweet: (tweetId: string) => Promise<void>;
  editTweet: (tweetId: string, content: string) => Promise<void>;
  deleteTweet: (tweetId: string) => Promise<void>;
  validateXCredentials: (creds: XCredentialType) => Promise<boolean>;
  updateXCredentials: (creds: XCredentialType) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Check if user was previously in the app
  useEffect(() => {
    const hasUsedAppBefore = localStorage.getItem('hasUsedAppBefore');
    if (hasUsedAppBefore === 'true') {
      dispatch({ type: 'SET_AUTHENTICATED', payload: true });
      
      // Try to restore X credentials if they exist
      try {
        const savedXCreds = localStorage.getItem('xCredentials');
        if (savedXCreds) {
          const creds = JSON.parse(savedXCreds) as XCredentialType;
          dispatch({ type: 'SET_X_CREDENTIALS', payload: creds });
          validateXCredentials(creds).catch(console.error);
        }
      } catch (error) {
        console.error('Failed to restore X credentials:', error);
      }
    }
  }, []);

  // Enter the app
  const enterApp = async (xCredentials?: XCredentialType) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    
    try {
      // Mark that the user has used the app before
      localStorage.setItem('hasUsedAppBefore', 'true');
      
      // Set authenticated state
      dispatch({ type: 'SET_AUTHENTICATED', payload: true });
      
      // If X credentials were provided, save and validate them
      if (xCredentials && 
          xCredentials.apiKey && 
          xCredentials.apiSecret && 
          xCredentials.accessToken && 
          xCredentials.accessSecret) {
        // Save credentials
        dispatch({ type: 'SET_X_CREDENTIALS', payload: xCredentials });
        localStorage.setItem('xCredentials', JSON.stringify(xCredentials));
        
        // Validate them
        try {
          await validateXCredentials(xCredentials);
        } catch (error) {
          console.error('Failed to validate X credentials:', error);
          // Don't throw the error, just set the validation state to false
          dispatch({ type: 'SET_X_CREDENTIALS_VALID', payload: false });
        }
      }
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to enter app' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Exit app (formerly logout)
  const exitApp = () => {
    localStorage.removeItem('hasUsedAppBefore');
    localStorage.removeItem('xCredentials');
    dispatch({ type: 'SET_AUTHENTICATED', payload: false });
    dispatch({ type: 'SET_X_CREDENTIALS', payload: null });
    dispatch({ type: 'SET_X_CREDENTIALS_VALID', payload: null });
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
      // Check if we have valid X credentials before attempting to send
      if (!state.xCredentials || !state.xCredentialsValid) {
        const errorMessage = !state.xCredentials 
          ? 'X credentials are required to post tweets. Please add them in settings.'
          : 'Your X credentials are invalid. Please update them in settings.';
        
        dispatch({ type: 'SET_ERROR', payload: errorMessage });
        throw new Error(errorMessage);
      }
      
      // We have valid credentials, attempt to post to X
      const response = await api.sendTweetToX(tweetId, state.xCredentials);
      dispatch({ type: 'UPDATE_TWEET', payload: response.tweet });
    } catch (error: any) {
      // Provide specific error messaging based on the type of error
      let errorMessage = error.message || 'Failed to send tweet';
      
      // If it's a 401 error, it's likely an auth issue with X
      if (error.status === 401) {
        errorMessage = 'Your X credentials are no longer valid. Please update them in settings.';
        // Also mark credentials as invalid
        dispatch({ type: 'SET_X_CREDENTIALS_VALID', payload: false });
      }
      
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
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

  // Validate X credentials
  const validateXCredentials = async (creds: XCredentialType) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    
    try {
      const response = await api.validateXCreds(creds);
      dispatch({ type: 'SET_X_CREDENTIALS_VALID', payload: response.isValid });
      return response.isValid;
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to validate X credentials' });
      dispatch({ type: 'SET_X_CREDENTIALS_VALID', payload: false });
      return false;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Update X credentials
  const updateXCredentials = async (creds: XCredentialType) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    
    try {
      // Set credentials first so validation has the updated values
      dispatch({ type: 'SET_X_CREDENTIALS', payload: creds });
      
      // Then validate them
      const isValid = await validateXCredentials(creds);
      
      // If they're invalid, show a specific message but don't throw an error
      // This allows setting credentials even if they're invalid
      if (!isValid) {
        dispatch({ 
          type: 'SET_ERROR', 
          payload: 'X credentials were saved but are invalid. Tweets will be simulated.' 
        });
      }
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to update X credentials' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const value = {
    state,
    enterApp,
    exitApp,
    fetchTranscripts,
    createTranscript,
    selectTranscript,
    fetchTweets,
    getSampleTranscript,
    setView,
    sendTweet,
    editTweet,
    deleteTweet,
    validateXCredentials,
    updateXCredentials
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