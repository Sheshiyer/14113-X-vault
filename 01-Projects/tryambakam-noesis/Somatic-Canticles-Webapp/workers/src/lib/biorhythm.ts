import type { BiorhythmData, BiorhythmSnapshot } from '../types';
import { executeFirst, executeRun, executeQuery } from './db';

// Biorhythm cycle lengths in days
const CYCLES = {
  physical: 23,
  emotional: 28,
  intellectual: 33
};

/**
 * Calculate biorhythm values based on birth date and target date
 */
export function calculateBiorhythm(
  birthDate: Date,
  targetDate: Date = new Date()
): BiorhythmData {
  // Calculate days lived
  const msPerDay = 1000 * 60 * 60 * 24;
  const daysLived = Math.floor((targetDate.getTime() - birthDate.getTime()) / msPerDay);

  // Calculate biorhythm values using sine wave formula
  const physical = Math.sin((2 * Math.PI * daysLived) / CYCLES.physical);
  const emotional = Math.sin((2 * Math.PI * daysLived) / CYCLES.emotional);
  const intellectual = Math.sin((2 * Math.PI * daysLived) / CYCLES.intellectual);

  return {
    physical: Math.round(physical * 100) / 100,
    emotional: Math.round(emotional * 100) / 100,
    intellectual: Math.round(intellectual * 100) / 100,
    days: {
      physical: daysLived % CYCLES.physical,
      emotional: daysLived % CYCLES.emotional,
      intellectual: daysLived % CYCLES.intellectual
    }
  };
}

/**
 * Get biorhythm status description
 */
export function getBiorhythmStatus(value: number): {
  phase: 'positive' | 'negative' | 'critical';
  description: string;
} {
  if (Math.abs(value) < 0.05) {
    return {
      phase: 'critical',
      description: 'Critical day - be cautious'
    };
  }
  
  return {
    phase: value > 0 ? 'positive' : 'negative',
    description: value > 0 ? 'High energy phase' : 'Recovery phase'
  };
}

/**
 * Calculate biorhythm for a date range
 */
export function calculateBiorhythmRange(
  birthDate: Date,
  startDate: Date,
  days: number
): Array<{
  date: string;
  physical: number;
  emotional: number;
  intellectual: number;
}> {
  const results = [];
  
  for (let i = 0; i < days; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() + i);
    
    const bio = calculateBiorhythm(birthDate, currentDate);
    
    results.push({
      date: currentDate.toISOString().split('T')[0],
      physical: bio.physical,
      emotional: bio.emotional,
      intellectual: bio.intellectual
    });
  }
  
  return results;
}

// Database operations

export async function saveBiorhythmSnapshot(
  db: D1Database,
  snapshot: {
    id: string;
    user_id: string;
    physical: number;
    emotional: number;
    intellectual: number;
    calculated_at: string;
  }
): Promise<void> {
  await executeRun(
    db,
    `INSERT INTO biorhythm_snapshots 
     (id, user_id, physical, emotional, intellectual, calculated_at, created_at)
     VALUES (?, ?, ?, ?, ?, ?, datetime('now'))`,
    [snapshot.id, snapshot.user_id, snapshot.physical, snapshot.emotional, 
     snapshot.intellectual, snapshot.calculated_at]
  );
}

export async function getLatestBiorhythmSnapshot(
  db: D1Database,
  userId: string
): Promise<BiorhythmSnapshot | null> {
  return await executeFirst<BiorhythmSnapshot>(
    db,
    `SELECT * FROM biorhythm_snapshots 
     WHERE user_id = ? 
     ORDER BY calculated_at DESC 
     LIMIT 1`,
    [userId]
  );
}

export async function getBiorhythmHistory(
  db: D1Database,
  userId: string,
  limit: number = 30
): Promise<BiorhythmSnapshot[]> {
  return await executeQuery<BiorhythmSnapshot>(
    db,
    `SELECT * FROM biorhythm_snapshots 
     WHERE user_id = ? 
     ORDER BY calculated_at DESC 
     LIMIT ?`,
    [userId, limit]
  );
}

export async function deleteOldSnapshots(
  db: D1Database,
  userId: string,
  keepDays: number = 90
): Promise<void> {
  await executeRun(
    db,
    `DELETE FROM biorhythm_snapshots 
     WHERE user_id = ? 
     AND calculated_at < datetime('now', '-${keepDays} days')`,
    [userId]
  );
}
