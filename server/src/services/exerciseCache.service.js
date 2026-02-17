import prisma from "../config/prisma.js";
import logger from "../config/logger.js";

class ExerciseCacheService {
  constructor() {
    this.globalExercises = [];
    this.isInitialized = false;
  }

  /**
   * Loads all global (non-custom) exercises into memory.
   * Optimized to fetch only necessary fields for the list view.
   */
  async initialize() {
    try {
      logger.info("Initializing Exercise Cache...");
      const exercises = await prisma.exercise.findMany({
        where: {
          isCustom: false,
          isDeprecated: false,
        },
        select: {
          id: true,
          name: true,
          primaryMuscle: true,
          equipment: true,
          imageUrl: true,
          isCustom: true,
          createdByUserId: true,
          // secondaryMuscles: false - strictly not needed for list view, 
          // saving memory. If needed later, add here.
        },
        orderBy: { name: "asc" },
      });

      this.globalExercises = exercises;
      this.isInitialized = true;
      logger.info(`Exercise Cache Initialized: ${this.globalExercises.length} global exercises loaded.`);
    } catch (err) {
      logger.error(`Failed to initialize Exercise Cache: ${err.message}`);
      // Retry logic could be added here, or we just leave it empty and failover to DB if we implemented a failover.
      // For now, if init fails, the array is empty.
    }
  }

  /**
   * Returns the cached global exercises.
   * @returns {Array} List of global exercises
   */
  getGlobalExercises() {
    if (!this.isInitialized) {
      logger.warn("Exercise Cache accessed before initialization. Triggering initialization...");
      this.initialize(); // Trigger background init
      return []; // Return empty or stale data while loading. 
                 // Or we could await, but this is synchronous.
                 // Ideally init is awaited in server.js
    }
    return this.globalExercises;
  }

  /**
   * Refreshes the cache from the database.
   */
  async refresh() {
    await this.initialize();
  }
}

// Export as a singleton
export const exerciseCache = new ExerciseCacheService();
