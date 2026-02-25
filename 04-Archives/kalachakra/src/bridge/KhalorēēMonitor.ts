/**
 * KhalorēēMonitor - Energy Tracking & Prediction System
 * 
 * Tracks metabolic reserve (khaloree) over time, predicts Kali Yuga
 * before it hits, suggests rest based on patterns, and correlates
 * with task completion rates.
 */

import { EventEmitter } from 'events';
import { NoesisClient } from './NoesisClient';
import { NoesisTemporalState, Yuga } from '../types';

export interface EnergySample {
  timestamp: string;
  khaloree: number;
  vikara: number;
  yuga: Yuga;
  cliffordOctave: number;
  vayu: string;
  taskId?: string;
  taskCompleted?: boolean;
}

export interface EnergyTrend {
  direction: 'rising' | 'falling' | 'stable';
  slope: number; // khaloree change per minute
  correlation: number; // R-squared of trend line
  timeSpan: number; // minutes
}

export interface KaliPrediction {
  predicted: boolean;
  confidence: number; // 0-1
  estimatedTimeToKali: number | null; // minutes, null if not predicted
  currentTrajectory: 'stable' | 'declining' | 'critical';
  recommendedAction: string;
}

export interface RestRecommendation {
  urgency: 'none' | 'soon' | 'now' | 'immediate';
  reason: string;
  suggestedDuration: number; // minutes
  suggestedActivities: string[];
  optimalReturnTime: string;
}

export interface TaskEnergyCorrelation {
  taskType: string;
  averageKhaloree: number;
  averageVikara: number;
  completionRate: number;
  averageDuration: number;
  recommendedYuga: Yuga;
}

export interface KhaloreeHistory {
  date: string;
  averageKhaloree: number;
  minKhaloree: number;
  maxKhaloree: number;
  timeInKrita: number; // minutes
  timeInTreta: number;
  timeInDvapara: number;
  timeInKali: number;
  tasksCompleted: number;
  restSessions: number;
}

export class KhalorēēMonitor extends EventEmitter {
  private client: NoesisClient;
  private samples: EnergySample[] = [];
  private maxSamples: number = 10080; // 7 days at 1 sample/minute
  private taskCorrelations: Map<string, TaskEnergyCorrelation> = new Map();
  private dailyHistory: Map<string, KhaloreeHistory> = new Map();
  private predictionWindow: number = 30; // minutes to look ahead
  private trendWindow: number = 10; // samples for trend calculation

  constructor(client: NoesisClient = new NoesisClient()) {
    super();
    this.client = client;
  }

  /**
   * Record a new energy sample
   */
  recordSample(temporal: NoesisTemporalState, taskContext?: {
    taskId?: string;
    completed?: boolean;
  }): void {
    const sample: EnergySample = {
      timestamp: temporal.timestamp,
      khaloree: temporal.khaloree,
      vikara: temporal.vikara,
      yuga: this.calculateYuga(temporal),
      cliffordOctave: temporal.cliffordOctave,
      vayu: temporal.vayu,
      taskId: taskContext?.taskId,
      taskCompleted: taskContext?.completed,
    };

    this.samples.push(sample);

    // Maintain max samples
    if (this.samples.length > this.maxSamples) {
      this.samples.shift();
    }

    // Update daily history
    this.updateDailyHistory(sample);

    // Emit sample event
    this.emit('sample', sample);

    // Check for critical patterns
    this.analyzePatterns(sample);
  }

  /**
   * Calculate current energy trend
   */
  getEnergyTrend(windowMinutes: number = this.trendWindow): EnergyTrend {
    const window = this.getRecentSamples(windowMinutes);
    
    if (window.length < 3) {
      return {
        direction: 'stable',
        slope: 0,
        correlation: 0,
        timeSpan: 0,
      };
    }

    // Simple linear regression
    const n = window.length;
    const x = window.map((_, i) => i);
    const y = window.map(s => s.khaloree);
    
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((acc, xi, i) => acc + xi * y[i], 0);
    const sumXX = x.reduce((acc, xi) => acc + xi * xi, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    
    // Calculate R-squared
    const yMean = sumY / n;
    const ssTotal = y.reduce((acc, yi) => acc + Math.pow(yi - yMean, 2), 0);
    const ssResidual = y.reduce((acc, yi, i) => {
      const predicted = yMean + slope * (i - sumX / n);
      return acc + Math.pow(yi - predicted, 2);
    }, 0);
    const rSquared = 1 - (ssResidual / ssTotal);

    // Determine direction
    const threshold = 0.5; // khaloree points per sample
    let direction: EnergyTrend['direction'] = 'stable';
    if (slope > threshold) direction = 'rising';
    else if (slope < -threshold) direction = 'falling';

    // Calculate time span
    const firstTime = new Date(window[0].timestamp).getTime();
    const lastTime = new Date(window[window.length - 1].timestamp).getTime();
    const timeSpan = (lastTime - firstTime) / 60000;

    return {
      direction,
      slope: slope * (60 / (timeSpan / n || 1)), // per minute
      correlation: Math.max(0, rSquared),
      timeSpan,
    };
  }

  /**
   * Predict if/when Kali Yuga will be reached
   */
  predictKaliYuga(): KaliPrediction {
    const current = this.getCurrentState();
    
    if (!current) {
      return {
        predicted: false,
        confidence: 0,
        estimatedTimeToKali: null,
        currentTrajectory: 'stable',
        recommendedAction: 'Unable to predict - no current state',
      };
    }

    // If already in Kali
    if (current.yuga === 'kali') {
      return {
        predicted: true,
        confidence: 1,
        estimatedTimeToKali: 0,
        currentTrajectory: 'critical',
        recommendedAction: 'Already in Kali Yuga. Rest immediately.',
      };
    }

    const trend = this.getEnergyTrend(this.predictionWindow);
    
    // If energy is stable or rising, no prediction needed
    if (trend.direction !== 'falling' || trend.slope >= 0) {
      return {
        predicted: false,
        confidence: 0.8,
        estimatedTimeToKali: null,
        currentTrajectory: 'stable',
        recommendedAction: 'Energy stable. Continue with current workload.',
      };
    }

    // Calculate time to Kali threshold (khaloree < 30)
    const kaliThreshold = 30;
    const currentKhaloree = current.khaloree;
    const declineRate = Math.abs(trend.slope); // per minute
    
    if (declineRate < 0.1) {
      return {
        predicted: false,
        confidence: 0.5,
        estimatedTimeToKali: null,
        currentTrajectory: 'stable',
        recommendedAction: 'Decline too gradual to predict Kali.',
      };
    }

    const minutesToKali = (currentKhaloree - kaliThreshold) / declineRate;
    
    // Determine confidence based on trend correlation and sample size
    const confidence = Math.min(0.95, trend.correlation * 0.8 + 0.2);

    let trajectory: KaliPrediction['currentTrajectory'] = 'declining';
    if (currentKhaloree < 40) trajectory = 'critical';

    let action: string;
    if (minutesToKali < 15) {
      action = 'URGENT: Kali approaching within 15 minutes. Begin winding down now.';
    } else if (minutesToKali < 30) {
      action = 'WARNING: Kali likely within 30 minutes. Finish current task and prepare to rest.';
    } else if (minutesToKali < 60) {
      action = 'CAUTION: Kali predicted within 1 hour. Plan your remaining work accordingly.';
    } else {
      action = 'Monitor energy levels. Kali may arrive in over an hour.';
    }

    return {
      predicted: minutesToKali > 0 && minutesToKali < 120,
      confidence,
      estimatedTimeToKali: minutesToKali > 0 ? Math.round(minutesToKali) : null,
      currentTrajectory: trajectory,
      recommendedAction: action,
    };
  }

  /**
   * Get rest recommendation based on current state and patterns
   */
  getRestRecommendation(): RestRecommendation {
    const current = this.getCurrentState();
    const trend = this.getEnergyTrend(20);
    const prediction = this.predictKaliYuga();
    
    if (!current) {
      return {
        urgency: 'none',
        reason: 'No energy data available',
        suggestedDuration: 0,
        suggestedActivities: [],
        optimalReturnTime: new Date().toISOString(),
      };
    }

    // Determine urgency
    let urgency: RestRecommendation['urgency'] = 'none';
    let reason = '';
    let duration = 5;
    const activities: string[] = [];

    if (prediction.predicted && prediction.estimatedTimeToKali && prediction.estimatedTimeToKali < 15) {
      urgency = 'immediate';
      reason = `Kali Yuga predicted in ${prediction.estimatedTimeToKali} minutes based on current trajectory`;
      duration = 30;
      activities.push('Lie down or recline', 'Close eyes', 'Deep breathing (4-7-8)', 'Silence all notifications');
    } else if (current.khaloree < 30 || current.vikara > 75) {
      urgency = 'now';
      reason = `Critical energy state: ${current.khaloree}% khaloree, ${current.vikara}% vikara`;
      duration = 20;
      activities.push('Step away from screen', 'Stretch or walk', 'Hydrate', 'Look at distant objects');
    } else if (trend.direction === 'falling' && trend.slope < -2) {
      urgency = 'soon';
      reason = `Rapid energy decline detected: ${trend.slope.toFixed(1)} points/minute`;
      duration = 10;
      activities.push('Micro-break', 'Stand and stretch', 'Drink water', 'Window gaze');
    } else if (current.khaloree < 50) {
      urgency = 'soon';
      reason = 'Energy below 50%, recommend break within 30 minutes';
      duration = 15;
      activities.push('Planned break', 'Light movement', 'Snack if hungry');
    }

    // Calculate optimal return time based on recovery patterns
    const optimalReturn = this.calculateOptimalReturnTime(duration, current.khaloree);

    return {
      urgency,
      reason,
      suggestedDuration: duration,
      suggestedActivities: activities,
      optimalReturnTime: optimalReturn,
    };
  }

  /**
   * Record task completion with energy correlation
   */
  recordTaskCompletion(
    taskId: string,
    taskType: string,
    duration: number,
    success: boolean
  ): void {
    const current = this.getCurrentState();
    if (!current) return;

    const existing = this.taskCorrelations.get(taskType) || {
      taskType,
      averageKhaloree: 0,
      averageVikara: 0,
      completionRate: 0,
      averageDuration: 0,
      recommendedYuga: 'treta',
    };

    // Update running averages
    const n = this.getCompletedTaskCount(taskType);
    const newN = n + 1;
    
    existing.averageKhaloree = (existing.averageKhaloree * n + current.khaloree) / newN;
    existing.averageVikara = (existing.averageVikara * n + current.vikara) / newN;
    existing.averageDuration = (existing.averageDuration * n + duration) / newN;
    existing.completionRate = ((existing.completionRate * n) + (success ? 1 : 0)) / newN;
    
    // Determine recommended Yuga based on success rate at different energy levels
    existing.recommendedYuga = this.determineOptimalYuga(existing);

    this.taskCorrelations.set(taskType, existing);
    
    this.emit('taskRecorded', { taskId, taskType, correlation: existing });
  }

  /**
   * Get correlation data for a task type
   */
  getTaskCorrelation(taskType: string): TaskEnergyCorrelation | null {
    return this.taskCorrelations.get(taskType) || null;
  }

  /**
   * Get all task correlations
   */
  getAllTaskCorrelations(): TaskEnergyCorrelation[] {
    return Array.from(this.taskCorrelations.values());
  }

  /**
   * Get optimal task types for current energy state
   */
  getOptimalTasksForCurrentState(): TaskEnergyCorrelation[] {
    const current = this.getCurrentState();
    if (!current) return [];

    const currentYuga = current.yuga;
    
    return this.getAllTaskCorrelations()
      .filter(tc => tc.recommendedYuga === currentYuga || this.isYugaCompatible(tc.recommendedYuga, currentYuga))
      .sort((a, b) => b.completionRate - a.completionRate);
  }

  /**
   * Get daily energy history
   */
  getDailyHistory(date?: string): KhaloreeHistory | null {
    const targetDate = date || new Date().toISOString().split('T')[0];
    return this.dailyHistory.get(targetDate) || null;
  }

  /**
   * Get weekly summary
   */
  getWeeklySummary(): {
    averageKhaloree: number;
    totalTasksCompleted: number;
    timeInEachYuga: Record<Yuga, number>;
    restEfficiency: number;
  } {
    const dates = Array.from(this.dailyHistory.keys()).slice(-7);
    const histories = dates.map(d => this.dailyHistory.get(d)).filter(Boolean) as KhaloreeHistory[];
    
    if (histories.length === 0) {
      return {
        averageKhaloree: 0,
        totalTasksCompleted: 0,
        timeInEachYuga: { krita: 0, treta: 0, dvapara: 0, kali: 0 },
        restEfficiency: 0,
      };
    }

    const totalKhaloree = histories.reduce((sum, h) => sum + h.averageKhaloree, 0);
    const totalTasks = histories.reduce((sum, h) => sum + h.tasksCompleted, 0);
    
    return {
      averageKhaloree: totalKhaloree / histories.length,
      totalTasksCompleted: totalTasks,
      timeInEachYuga: {
        krita: histories.reduce((sum, h) => sum + h.timeInKrita, 0),
        treta: histories.reduce((sum, h) => sum + h.timeInTreta, 0),
        dvapara: histories.reduce((sum, h) => sum + h.timeInDvapara, 0),
        kali: histories.reduce((sum, h) => sum + h.timeInKali, 0),
      },
      restEfficiency: this.calculateRestEfficiency(histories),
    };
  }

  /**
   * Export all data for analysis
   */
  exportData(): {
    samples: EnergySample[];
    correlations: TaskEnergyCorrelation[];
    history: KhaloreeHistory[];
  } {
    return {
      samples: [...this.samples],
      correlations: this.getAllTaskCorrelations(),
      history: Array.from(this.dailyHistory.values()),
    };
  }

  // Private helper methods
  
  private calculateYuga(temporal: NoesisTemporalState): Yuga {
    const { khaloree, vikara } = temporal;
    if (khaloree >= 70 && vikara <= 30) return 'krita';
    if (khaloree >= 50 && vikara <= 50) return 'treta';
    if (khaloree >= 30 && vikara <= 75) return 'dvapara';
    return 'kali';
  }

  private getRecentSamples(count: number): EnergySample[] {
    return this.samples.slice(-count);
  }

  private getCurrentState(): EnergySample | null {
    return this.samples[this.samples.length - 1] || null;
  }

  private getCompletedTaskCount(taskType: string): number {
    return this.samples.filter(s => s.taskId && this.taskCorrelations.get(taskType)).length;
  }

  private updateDailyHistory(sample: EnergySample): void {
    const date = sample.timestamp.split('T')[0];
    const existing = this.dailyHistory.get(date);

    if (!existing) {
      this.dailyHistory.set(date, {
        date,
        averageKhaloree: sample.khaloree,
        minKhaloree: sample.khaloree,
        maxKhaloree: sample.khaloree,
        timeInKrita: sample.yuga === 'krita' ? 1 : 0,
        timeInTreta: sample.yuga === 'treta' ? 1 : 0,
        timeInDvapara: sample.yuga === 'dvapara' ? 1 : 0,
        timeInKali: sample.yuga === 'kali' ? 1 : 0,
        tasksCompleted: sample.taskCompleted ? 1 : 0,
        restSessions: 0,
      });
    } else {
      const n = this.samples.filter(s => s.timestamp.startsWith(date)).length;
      existing.averageKhaloree = (existing.averageKhaloree * (n - 1) + sample.khaloree) / n;
      existing.minKhaloree = Math.min(existing.minKhaloree, sample.khaloree);
      existing.maxKhaloree = Math.max(existing.maxKhaloree, sample.khaloree);
      
      // Assume 1 minute per sample for time tracking
      existing.timeInKrita += sample.yuga === 'krita' ? 1 : 0;
      existing.timeInTreta += sample.yuga === 'treta' ? 1 : 0;
      existing.timeInDvapara += sample.yuga === 'dvapara' ? 1 : 0;
      existing.timeInKali += sample.yuga === 'kali' ? 1 : 0;
      
      if (sample.taskCompleted) existing.tasksCompleted++;
    }
  }

  private analyzePatterns(sample: EnergySample): void {
    // Detect sudden drops
    const prev = this.samples[this.samples.length - 2];
    if (prev && prev.khaloree - sample.khaloree > 20) {
      this.emit('suddenDrop', {
        from: prev.khaloree,
        to: sample.khaloree,
        timestamp: sample.timestamp,
      });
    }

    // Detect recovery patterns
    if (prev && sample.khaloree - prev.khaloree > 15) {
      this.emit('recoveryDetected', {
        from: prev.khaloree,
        to: sample.khaloree,
        timestamp: sample.timestamp,
      });
    }
  }

  private calculateOptimalReturnTime(restDuration: number, currentKhaloree: number): string {
    // Simple model: recovery rate of ~5 khaloree points per 10 minutes of rest
    const recoveryRate = 0.5; // points per minute
    const targetKhaloree = 60;
    const neededGain = Math.max(0, targetKhaloree - currentKhaloree);
    const actualRestNeeded = Math.max(restDuration, neededGain / recoveryRate);
    
    const returnTime = new Date(Date.now() + actualRestNeeded * 60000);
    return returnTime.toISOString();
  }

  private determineOptimalYuga(correlation: TaskEnergyCorrelation): Yuga {
    if (correlation.averageKhaloree >= 70 && correlation.completionRate > 0.8) return 'krita';
    if (correlation.averageKhaloree >= 50 && correlation.completionRate > 0.6) return 'treta';
    if (correlation.averageKhaloree >= 30 && correlation.completionRate > 0.4) return 'dvapara';
    return 'kali';
  }

  private isYugaCompatible(recommended: Yuga, current: Yuga): boolean {
    const yugaOrder = ['krita', 'treta', 'dvapara', 'kali'];
    const recIdx = yugaOrder.indexOf(recommended);
    const currIdx = yugaOrder.indexOf(current);
    // Can do lower yuga tasks in higher yuga, but not vice versa
    return currIdx <= recIdx;
  }

  private calculateRestEfficiency(histories: KhaloreeHistory[]): number {
    const totalTime = histories.reduce((sum, h) => 
      sum + h.timeInKrita + h.timeInTreta + h.timeInDvapara + h.timeInKali, 0);
    
    if (totalTime === 0) return 0;
    
    const productiveTime = histories.reduce((sum, h) => 
      sum + h.timeInKrita + h.timeInTreta, 0);
    
    return productiveTime / totalTime;
  }
}

// Singleton instance
let sharedMonitor: KhalorēēMonitor | null = null;

export function getKhalorēēMonitor(client?: NoesisClient): KhalorēēMonitor {
  if (!sharedMonitor) {
    sharedMonitor = new KhalorēēMonitor(client);
  }
  return sharedMonitor;
}

export function resetKhalorēēMonitor(): void {
  sharedMonitor = null;
}

export default KhalorēēMonitor;
