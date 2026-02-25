#!/usr/bin/env python3
import unittest
import os
import json
import time
import subprocess
import sys
import shutil
import tempfile
from datetime import datetime

# Path to the script we are testing
SCRIPT_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "pulse_monitor.py"))

class TestPulseMonitor(unittest.TestCase):
    def setUp(self):
        # Create a temporary directory for memory files
        self.test_dir = tempfile.mkdtemp()
        self.pid_file = os.path.join(self.test_dir, "indexer.pid")
        self.stats_file = os.path.join(self.test_dir, "index_stats.json")
        self.pulse_file = os.path.join(self.test_dir, "pulse.json")
        
        # Ensure we can import or run the script
        # We'll run it as a subprocess to test the CLI interface

    def tearDown(self):
        # Remove the temporary directory
        shutil.rmtree(self.test_dir)

    def run_pulse_monitor(self):
        # Run the script with the test directory as an argument
        # We'll need to make sure pulse_monitor.py accepts an argument for the memory dir
        cmd = [sys.executable, SCRIPT_PATH, "--memory-dir", self.test_dir]
        result = subprocess.run(cmd, capture_output=True, text=True)
        return result

    def test_missing_files(self):
        # Test when no files exist
        res = self.run_pulse_monitor()
        self.assertEqual(res.returncode, 0)
        
        self.assertTrue(os.path.exists(self.pulse_file))
        with open(self.pulse_file, 'r') as f:
            pulse = json.load(f)
            
        self.assertIn("timestamp", pulse)
        self.assertEqual(pulse["is_running"], False)
        self.assertEqual(pulse["pid"], None)
        self.assertEqual(pulse["progress_pct"], 0)
        self.assertEqual(pulse["files_processed"], 0)
        self.assertEqual(pulse["eta_minutes"], 0)

    def test_running_process(self):
        # Test when PID file exists and process is running
        # We'll use our own PID for testing
        my_pid = os.getpid()
        with open(self.pid_file, 'w') as f:
            f.write(str(my_pid))
            
        stats = {
            "progress_pct": 45.5,
            "file_count": 120,
            "eta_minutes": 15
        }
        with open(self.stats_file, 'w') as f:
            json.dump(stats, f)
            
        res = self.run_pulse_monitor()
        self.assertEqual(res.returncode, 0)
        
        with open(self.pulse_file, 'r') as f:
            pulse = json.load(f)
            
        self.assertEqual(pulse["is_running"], True)
        self.assertEqual(pulse["pid"], my_pid)
        self.assertEqual(pulse["progress_pct"], 45.5)
        self.assertEqual(pulse["files_processed"], 120)
        self.assertEqual(pulse["eta_minutes"], 15)

    def test_stale_pid(self):
        # Test when PID file exists but process is NOT running
        # Use a PID that is unlikely to be running (very large)
        stale_pid = 999999 
        with open(self.pid_file, 'w') as f:
            f.write(str(stale_pid))
            
        res = self.run_pulse_monitor()
        self.assertEqual(res.returncode, 0)
        
        with open(self.pulse_file, 'r') as f:
            pulse = json.load(f)
            
        self.assertEqual(pulse["is_running"], False)
        self.assertEqual(pulse["pid"], stale_pid)

if __name__ == "__main__":
    unittest.main()
