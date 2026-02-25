/**
 * Bridge Demo - Example usage of Noesis Bridge
 * 
 * Run with: ts-node bridge/demo.ts
 */

import { 
  NoesisBridge, 
  NoesisClient, 
  StateSynchronizer,
  KhalorēēMonitor,
  VayuAdapter,
} from './index';

// Demo configuration
const DEMO_MODE = true; // Set to false to use real noesis CLI

async function runDemo() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║              NOESIS BRIDGE DEMO                            ║');
  console.log('║                                                            ║');
  console.log('║  Kalachakra ←──reads── Noesis (temporal engine)            ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  // Initialize bridge
  const bridge = new NoesisBridge({
    noesisPath: 'noesis',
    sync: {
      pollInterval: 30000,
      vikaraThreshold: 75,
    },
  });

  // Demo: Show individual components
  console.log('📦 COMPONENTS INITIALIZED\n');
  console.log('  ├─ NoesisClient     → CLI wrapper with caching');
  console.log('  ├─ StateSynchronizer→ Real-time sync (30s poll)');
  console.log('  ├─ KhalorēēMonitor  → Energy tracking & prediction');
  console.log('  └─ VayuAdapter      → Elemental work mapping\n');

  // Demo: VayuAdapter
  console.log('🌬️  VAYU WORK TYPE MAPPINGS\n');
  const adapter = new VayuAdapter();
  const workTypes = adapter.getAllWorkTypes();
  
  const koshaEmojis: Record<string, string> = {
    annamaya: '🍲',
    pranamaya: '💨',
    manomaya: '🧠',
    vijnanamaya: '🔮',
    anandamaya: '✨',
  };

  for (const wt of workTypes) {
    const koshaEmoji = koshaEmojis[wt.kosha] || '🔹';
    
    console.log(`  ${koshaEmoji} ${wt.vayu.toUpperCase().padEnd(6)} → ${wt.name}`);
    console.log(`      ${wt.description}`);
    console.log(`      Ideal: ${wt.duration.ideal}min | Min khaloree: ${wt.energyProfile.khaloreeMin}`);
    console.log();
  }

  // Demo: Simulate getting a snapshot (would connect to real noesis)
  console.log('📊 SIMULATED SNAPSHOT\n');
  
  // Mock temporal state for demo
  const mockTemporal = {
    timestamp: new Date().toISOString(),
    cliffordOctave: 2,
    khaloree: 65,
    vikara: 35,
    vayu: 'prana' as const,
    moonPhase: 'Waxing Gibbous',
    dayOfMoonCycle: 18,
  };

  const mockVayus = {
    current: 'prana' as const,
    dominantSince: new Date(Date.now() - 30 * 60000).toISOString(),
    duration: 30,
    allVayus: {
      prana: 75,
      vyana: 45,
      udana: 30,
      samana: 20,
      apana: 15,
    },
  };

  // Show suggestion
  const suggestion = adapter.getSuggestion(mockVayus, mockTemporal.khaloree, mockTemporal.vikara);
  
  console.log(`  Current Vayu:    ${suggestion.vayu} (${suggestion.currentStrength}%)`);
  console.log(`  Work Type:       ${suggestion.workType.name}`);
  console.log(`  Confidence:      ${Math.round(suggestion.confidence * 100)}%`);
  console.log(`  Reason:          ${suggestion.reason}`);
  console.log();
  
  console.log('  Suggested Tasks:');
  for (const task of adapter.getTaskSuggestions(suggestion.vayu, 3)) {
    console.log(`    • ${task}`);
  }
  console.log();

  // Demo: Energy monitoring
  console.log('⚡ ENERGY MONITORING\n');
  
  const monitor = new KhalorēēMonitor();
  
  // Simulate recording samples
  for (let i = 0; i < 20; i++) {
    monitor.recordSample({
      ...mockTemporal,
      khaloree: 80 - (i * 1.5), // Gradually declining
      vikara: 20 + (i * 1.2),
      timestamp: new Date(Date.now() - (20 - i) * 60000).toISOString(),
    });
  }

  const trend = monitor.getEnergyTrend(20);
  console.log(`  Energy Trend:    ${trend.direction} (${trend.slope.toFixed(2)}/min)`);
  console.log(`  Correlation:     ${Math.round(trend.correlation * 100)}%`);
  console.log();

  const prediction = monitor.predictKaliYuga();
  console.log(`  Kali Prediction:`);
  console.log(`    Predicted:     ${prediction.predicted ? 'YES ⚠️' : 'NO ✓'}`);
  if (prediction.estimatedTimeToKali) {
    console.log(`    Time to Kali:  ~${prediction.estimatedTimeToKali} minutes`);
  }
  console.log(`    Trajectory:    ${prediction.currentTrajectory}`);
  console.log(`    Action:        ${prediction.recommendedAction}`);
  console.log();

  const rest = monitor.getRestRecommendation();
  console.log(`  Rest Recommendation:`);
  console.log(`    Urgency:       ${rest.urgency.toUpperCase()}`);
  console.log(`    Duration:      ${rest.suggestedDuration} minutes`);
  console.log(`    Reason:        ${rest.reason}`);
  console.log();

  // Demo: Daily flow
  console.log('🌅 DAILY VAYU FLOW\n');
  
  const flow = adapter.getDailyFlow('prana');
  console.log(`  Current:         ${flow.current}`);
  console.log(`  Next:            ${flow.next}`);
  console.log(`  Transition:      ${new Date(flow.estimatedTransition).toLocaleTimeString()}`);
  console.log();
  
  console.log('  Suggested Schedule:');
  for (const item of flow.suggestedSchedule.slice(0, 4)) {
    const time = new Date(item.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    console.log(`    ${time}  ${item.vayu.padEnd(6)} → ${item.workType} (${item.duration}min)`);
  }
  console.log();

  // Demo: Transition guidance
  console.log('🔄 TRANSITION GUIDANCE\n');
  
  const transitions = [
    ['prana', 'vyana'],
    ['prana', 'apana'],
    ['udana', 'samana'],
  ] as const;
  
  for (const [from, to] of transitions) {
    const guidance = adapter.getTransitionGuidance(from, to);
    console.log(`  ${from} → ${to}:`);
    console.log(`    Difficulty:    ${guidance.difficulty}`);
    console.log(`    Cooldown:      ${guidance.cooldown} minutes`);
    console.log();
  }

  console.log('═══════════════════════════════════════════════════════════════');
  console.log('Demo complete. The bridge is ready to breathe. 🕉️');
  console.log('═══════════════════════════════════════════════════════════════');
}

// Run if executed directly
if (require.main === module) {
  runDemo().catch(console.error);
}

export { runDemo };
