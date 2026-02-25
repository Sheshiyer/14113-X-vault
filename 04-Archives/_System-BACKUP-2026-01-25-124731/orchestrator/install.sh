#!/bin/bash
# Vault Intake Orchestrator - Installation Script

echo "🚀 Installing Vault Intake Orchestrator..."
echo ""

# Check Python version
echo "Checking Python version..."
python3 --version

# Create virtual environment (optional but recommended)
echo ""
echo "Creating virtual environment..."
python3 -m venv venv 2>/dev/null || echo "Virtual environment already exists or not needed"

# Activate virtual environment
if [ -d "venv" ]; then
    echo "Activating virtual environment..."
    source venv/bin/activate
fi

# Install dependencies
echo ""
echo "Installing dependencies..."
pip install -r requirements.txt

echo ""
echo "✅ Installation complete!"
echo ""
echo "Next steps:"
echo "  1. Review config.yaml settings"
echo "  2. Run: python main.py status"
echo "  3. Run: python main.py inventory"
echo "  4. Run: python main.py process --batch-size 1 --dry-run"
echo ""
