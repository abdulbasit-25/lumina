import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { movieAPI, MovieResponse } from '@/services/movieAPI';
import { useToast } from '@/hooks/use-toast';

interface ProductionsContextType {
  productions: MovieResponse[];
  loading: boolean;
  addProduction: (production: Record<string, unknown>) => Promise<void>;
  updateProduction: (id: string, updates: Record<string, unknown>) => Promise<void>;
  deleteProduction: (id: string) => Promise<void>;
  searchProductions: (query: string) => MovieResponse[];
  refresh: () => Promise<void>;
}

const ProductionsContext = createContext<ProductionsContextType | undefined>(undefined);

export const useProductions = () => {
  const context = useContext(ProductionsContext);
  if (context === undefined) {
    throw new Error('useProductions must be used within a ProductionsProvider');
  }
  return context;
};

export const ProductionsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [productions, setProductions] = useState<MovieResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProductions = async () => {
    setLoading(true);
    try {
      const data = await movieAPI.getMovies();
      setProductions(data as MovieResponse[]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProductions(); }, []);

  const addProduction = async (production: any) => {
    try {
      const newProd = await movieAPI.createMovie(production);
      setProductions(prev => [...prev, newProd as Production]);
      toast({ title: "Success", description: "Production created successfully" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const updateProduction = async (id: string, updates: any) => {
    try {
      const updatedProd = await movieAPI.updateMovie(id, updates);
      setProductions(prev => prev.map(p => p._id === id ? updatedProd as Production : p));
      toast({ title: "Success", description: "Production updated successfully" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const deleteProduction = async (id: string) => {
    try {
      await movieAPI.deleteMovie(id);
      setProductions(prev => prev.filter(p => p._id !== id));
      toast({ title: "Success", description: "Production deleted" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const searchProductions = (query: string): Production[] => {
    if (!query.trim()) return productions;
    const lowerQuery = query.toLowerCase();
    return productions.filter(p =>
      p.title.toLowerCase().includes(lowerQuery) ||
      p.genre.toLowerCase().includes(lowerQuery)
    );
  };

  return (
    <ProductionsContext.Provider value={{
      productions, loading, addProduction, updateProduction, deleteProduction, searchProductions, refresh: fetchProductions
    }}>
      {children}
    </ProductionsContext.Provider>
  );
};
