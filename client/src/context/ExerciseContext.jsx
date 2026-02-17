import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const ExerciseContext = createContext();

export function ExerciseProvider({ children }) {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const fetchExercises = async (forceReset = false) => {
    if (loading) return; // Prevent duplicate requests
    if (!forceReset && !hasMore) return; // No more data to load

    const targetPage = forceReset ? 1 : page;
    setLoading(true);

    try {
      const res = await api.get(`/exercises?page=${targetPage}&limit=50`);
      
      const { exercises: newExercises, hasNextPage, totalCount } = res.data;
      
      if (totalCount !== undefined) setTotalCount(totalCount);

      if (forceReset) {
        setExercises(newExercises);
        setPage(2);
      } else {
        setExercises(prev => {
          const existingIds = new Set(prev.map(e => e.id));
          const uniqueNew = newExercises.filter(e => !existingIds.has(e.id));
          return [...prev, ...uniqueNew];
        });
        setPage(prev => prev + 1);
      }
      
      setHasMore(hasNextPage);
    } catch (err) {
      console.error("Failed to load exercises", err);
    } finally {
      setLoading(false);
    }
  };

  const refreshExercises = () => fetchExercises(true);

  return (
    <ExerciseContext.Provider
      value={{
        exercises,
        loading,
        hasMore,
        totalCount,
        fetchExercises, // this will be loadMore effectively
        refreshExercises, // this resets to page 1
      }}
    >
      {children}
    </ExerciseContext.Provider>
  );
}

export const useExerciseContext = () => useContext(ExerciseContext);
