import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useProductions } from './ProductionsContext';
import { movieAPI } from '@/services/movieAPI';

interface SearchResult {
  id: string;
  type: 'production' | 'cast' | 'crew' | 'schedule';
  title: string;
  subtitle: string;
  path: string;
}

interface SearchContextType {
  query: string;
  setQuery: (query: string) => void;
  results: SearchResult[];
  isSearching: boolean;
  performSearch: (searchQuery: string) => Promise<void>;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

interface SearchProviderProps {
  children: ReactNode;
}

export const SearchProvider: React.FC<SearchProviderProps> = ({ children }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const { searchProductions } = useProductions();

  const performSearch = async (searchQuery: string) => {
    setIsSearching(true);
    setQuery(searchQuery);

    if (!searchQuery.trim()) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    const lowerQuery = searchQuery.toLowerCase();
    const searchResults: SearchResult[] = [];

    try {
      // Search productions
      const productions = searchProductions(searchQuery);
      productions.forEach(prod => {
        searchResults.push({
          id: `prod-${prod._id}`,
          type: 'production',
          title: prod.title,
          subtitle: `${prod.genre} • Dir. ${prod.suggestedDirector || 'TBD'} • ${prod.status}`,
          path: '/movies'
        });
      });

      // Search cast
      const castData = await movieAPI.getTalent("cast");
      castData.forEach(cast => {
        if (
          cast.name.toLowerCase().includes(lowerQuery) ||
          cast.genres?.some((g: string) => g.toLowerCase().includes(lowerQuery))
        ) {
          searchResults.push({
            id: `cast-${cast._id}`,
            type: 'cast',
            title: cast.name,
            subtitle: `${cast.genres?.join(", ") || 'No genres'} • Rating: ${cast.matchPercent || 92}`,
            path: '/cast'
          });
        }
      });

      // Search crew
      const crewData = await movieAPI.getTalent("crew");
      crewData.forEach(crew => {
        if (
          crew.name.toLowerCase().includes(lowerQuery) ||
          crew.role?.toLowerCase().includes(lowerQuery)
        ) {
          searchResults.push({
            id: `crew-${crew._id}`,
            type: 'crew',
            title: crew.name,
            subtitle: `${crew.role || 'No role'} • Rating: ${crew.rating || 0}`,
            path: '/crew'
          });
        }
      });

      // Search schedule
      const scheduleData = await movieAPI.getScheduleEvents();
      scheduleData.forEach(event => {
        if (
          event.title.toLowerCase().includes(lowerQuery) ||
          event.location.toLowerCase().includes(lowerQuery)
        ) {
          searchResults.push({
            id: `sched-${event.id}`,
            type: 'schedule',
            title: event.title,
            subtitle: `${event.start} - ${event.end} • ${event.location}`,
            path: '/schedule'
          });
        }
      });
    } catch (error) {
      console.error("Search error:", error);
    }

    setResults(searchResults.slice(0, 10)); // Limit to 10 results
    setIsSearching(false);
  };

  const value: SearchContextType = {
    query,
    setQuery,
    results,
    isSearching,
    performSearch,
  };

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
};