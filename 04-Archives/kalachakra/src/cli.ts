#!/usr/bin/env node
/**
 * Kalachakra CLI
 * Command line interface for the Fractal Time Calendar
 */

import { kalachakra, tarotOracle, heroJourneyMap, fractalTime } from './index.js';
import { writeFileSync } from 'fs';

const command = process.argv[2];

async function main() {
  await kalachakra.initialize();

  switch (command) {
    case 'now':
    case 'status':
      await cmdNow();
      break;
      
    case 'draw':
    case 'card':
      await cmdDraw();
      break;
      
    case 'phase':
    case 'hero':
      await cmdPhase();
      break;
      
    case 'yuga':
      await cmdYuga();
      break;
      
    case 'task':
      await cmdTask();
      break;
      
    case 'cycles':
      await cmdCycles();
      break;
      
    case 'init':
      await cmdInit();
      break;
      
    case 'help':
    default:
      cmdHelp();
  }
  
  await kalachakra.shutdown();
}

async function cmdNow() {
  const now = await kalachakra.getNow();
  
  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║              कालचक्र (Kalachakra) NOW                    ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');
  
  console.log(`🕐 ${new Date(now.timestamp).toLocaleString()}`);
  console.log(`\n🎴 Tarot of the Day: ${now.tarot.name} (${now.tarot.number})`);
  console.log(`   ${now.tarot.meaning.upright}`);
  console.log(`   Keywords: ${now.tarot.keywords.join(', ')}`);
  
  console.log(`\n🦸 Hero Phase ${now.heroPhase.number}: ${now.heroPhase.name}`);
  console.log(`   ${now.heroPhase.sanskritName}`);
  console.log(`   ${now.heroPhase.sankalpa}`);
  
  console.log(`\n🌅 Yuga: ${now.yuga.sanskritName}`);
  console.log(`   Characteristics: ${now.yuga.characteristics.slice(0, 3).join(', ')}`);
  
  if (now.noesis) {
    console.log(`\n📊 Noesis State:`);
    console.log(`   Khalorēē (energy): ${now.noesis.khaloree}%`);
    console.log(`   Vikara (drift): ${now.noesis.vikara}%`);
    console.log(`   Vayu: ${now.noesis.vayu}`);
    console.log(`   Clifford Octave: ${now.noesis.cliffordOctave}/7`);
  }
  
  console.log(`\n🎯 Sankalpa: ${now.sankalpa}`);
  console.log('');
}

async function cmdDraw() {
  const context = process.argv[3] || 'general';
  const draw = kalachakra.drawCard({ context });
  
  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║                   🎴 CARD DRAWN 🎴                        ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');
  
  const card = draw.draw.card;
  const orientation = draw.draw.orientation === 'upright' ? '↑' : '↓';
  
  console.log(`${orientation} ${card.name} (${card.number})`);
  if (card.sanskritName) {
    console.log(`   ${card.sanskritName}`);
  }
  console.log(`\n   ${draw.draw.meaningForContext}`);
  console.log(`\n   Guidance: ${draw.guidance}`);
  console.log(`   Kosha: ${draw.koshaEmphasis}`);
  console.log(`   Action: ${draw.suggestedAction}`);
  console.log('');
}

async function cmdPhase() {
  const phases = heroJourneyMap.getAllPhases();
  const current = kalachakra.getState().heroPhase;
  
  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║              🦸 THE HERO\'S JOURNEY 🦸                     ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');
  
  phases.forEach(phase => {
    const marker = phase.number === current.number ? '>>' : '  ';
    console.log(`${marker} ${phase.number}. ${phase.name}`);
    console.log(`      ${phase.sanskritName}`);
    console.log(`      Kosha: ${phase.kosha} | Tarot: ${phase.tarotCard}`);
    if (phase.number === current.number) {
      console.log(`      🎯 ${phase.sankalpa}`);
    }
    console.log('');
  });
}

async function cmdYuga() {
  const yugas = fractalTime.getAllYugas();
  const current = kalachakra.getState().yugaOfTheMoment;
  
  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║                 🌅 THE FOUR YUGAS 🌅                      ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');
  
  yugas.forEach(yuga => {
    const marker = yuga.name === current.name ? '>>' : '  ';
    const duration = yuga.duration.max > 0 
      ? `${yuga.duration.min}-${yuga.duration.max} min`
      : 'STOP IMMEDIATELY';
    
    console.log(`${marker} ${yuga.sanskritName}`);
    console.log(`    Duration: ${duration}`);
    console.log(`    Kosha: ${yuga.kosha}`);
    console.log(`    Key: ${yuga.characteristics[0]}`);
    
    if (yuga.name === current.name) {
      console.log(`    ⏱️  Session: ${Math.floor(fractalTime.getSessionDuration())} minutes`);
    }
    console.log('');
  });
  
  const recommendation = fractalTime.getRecommendedAction();
  console.log(`💡 Recommendation: ${recommendation}\n`);
}

async function cmdTask() {
  const subcommand = process.argv[3];
  
  switch (subcommand) {
    case 'create':
      const name = process.argv[4] || 'New Task';
      const desc = process.argv[5];
      const task = kalachakra.createTask(name, desc);
      console.log(`\n✅ Created task: ${task.name}`);
      console.log(`   ID: ${task.id}`);
      console.log(`   Phase: ${task.heroPhase}`);
      console.log(`   Kosha: ${task.kosha}\n`);
      break;
      
    case 'start':
      const taskId = process.argv[4];
      if (!taskId) {
        console.log('Usage: kalachakra task start <task-id>');
        return;
      }
      kalachakra.startTask(taskId);
      console.log(`\n▶️  Started task: ${taskId}\n`);
      break;
      
    case 'list':
      const recommended = kalachakra.getRecommendedTask();
      console.log('\n📋 Recommended Task:');
      if (recommended.task) {
        console.log(`   ${recommended.task.name}`);
        console.log(`   ${recommended.reasoning}\n`);
      } else {
        console.log('   No pending tasks\n');
      }
      break;
      
    default:
      console.log('Usage: kalachakra task [create|start|list]');
  }
  
  await kalachakra.persistState();
}

async function cmdCycles() {
  const overview = kalachakra.getFractalOverview();
  
  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║            🌀 FRACTAL TIME CYCLES 🌀                      ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');
  
  const { cycles } = overview;
  
  console.log('Moment (Yuga):');
  console.log(`  ${cycles.moment.yuga} (${Math.floor(cycles.moment.progress * 100)}%)`);
  
  console.log('\nSession:');
  console.log(`  Yuga: ${cycles.session.yuga}`);
  console.log(`  Hero Phase: ${cycles.session.heroPhase}`);
  console.log(`  Progress: ${Math.floor(cycles.session.progress * 100)}%`);
  
  console.log('\nDay:');
  console.log(`  Tarot: Day ${cycles.day.tarot}`);
  console.log(`  Hero Phase: ${cycles.day.heroPhase}`);
  console.log(`  Progress: ${Math.floor(cycles.day.progress * 100)}%`);
  
  console.log('\nWeek:');
  console.log(`  Hero Phase: ${cycles.week.heroPhase}`);
  console.log(`  Progress: ${Math.floor(cycles.week.progress * 100)}%`);
  
  console.log('\nMoon:');
  console.log(`  Phase: ${cycles.moon.phase}`);
  console.log(`  Progress: ${Math.floor(cycles.moon.progress * 100)}%`);
  
  if (overview.yugaTransition.shouldTransition) {
    console.log(`\n⚠️  Yuga Transition: ${overview.yugaTransition.from} → ${overview.yugaTransition.to}`);
    console.log(`   Urgency: ${overview.yugaTransition.urgency}`);
  }
  
  console.log(`\n💡 ${overview.recommendedAction}\n`);
}

async function cmdInit() {
  const state = kalachakra.getState();
  
  // Save to state.json
  const statePath = '/Users/sheshnarayaniyer/.openclaw/workspace/kalachakra/state/state.json';
  writeFileSync(statePath, JSON.stringify(state, null, 2));
  
  console.log('\n✨ Kalachakra initialized!');
  console.log(`   State saved to: ${statePath}`);
  console.log(`   Current phase: ${state.heroPhase.name}`);
  console.log(`   Yuga: ${state.yugaOfTheMoment.name}`);
  console.log(`   Sankalpa: ${state.sankalpa}\n`);
}

function cmdHelp() {
  console.log(`
╔══════════════════════════════════════════════════════════╗
║         कालचक्र (Kalachakra) - Fractal Time Calendar      ║
╚══════════════════════════════════════════════════════════╝

Usage: kalachakra <command> [options]

Commands:
  now, status     Show current temporal state
  draw, card      Draw a tarot card for guidance
  phase, hero     Show all hero journey phases
  yuga            Show yuga states and recommendations
  task            Manage tasks (create|start|list)
  cycles          Show fractal time cycles
  init            Initialize and save state
  help            Show this help message

Examples:
  kalachakra now
  kalachakra draw "debugging session"
  kalachakra task create "Build component"
  kalachakra cycles

ॐ कालाय नमः (Om Kalaya Namah)
`);
}

main().catch(console.error);
