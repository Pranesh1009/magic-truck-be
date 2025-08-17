#!/bin/bash

# MagicTruck Documentation Opener
# This script helps users open documentation files in their default browser

echo "🚚 MagicTruck Documentation Opener"
echo "=================================="
echo ""

# Function to open file in browser
open_in_browser() {
    local file_path="$1"
    local file_name="$2"
    
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        open "$file_path"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        if command -v xdg-open &> /dev/null; then
            xdg-open "$file_path"
        elif command -v gnome-open &> /dev/null; then
            gnome-open "$file_path"
        else
            echo "Please install xdg-utils to open files automatically"
            echo "Or manually open: $file_path"
        fi
    elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
        # Windows
        start "$file_path"
    else
        echo "Please manually open: $file_path"
    fi
}

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "Available documentation:"
echo "1.  Main README (overview)"
echo "2.  API Reference (complete endpoint documentation)"
echo "3.  Setup Guide (installation instructions)"
echo "4.  Cost Calculation (pricing structure)"
echo "5.  Error Handling (troubleshooting)"
echo "6.  Testing Guide (testing strategies)"
echo "7.  cURL Examples (command examples)"
echo "8.  Quick Start (5-minute guide)"
echo "9.  Documentation Index (this file)"
echo "10. Run Test Script"
echo ""

read -p "Enter the number of the document you want to open (1-10): " choice

case $choice in
    1)
        echo "Opening main README..."
        open_in_browser "$SCRIPT_DIR/README.md" "README.md"
        ;;
    2)
        echo "Opening API Reference..."
        open_in_browser "$SCRIPT_DIR/api-reference.md" "api-reference.md"
        ;;
    3)
        echo "Opening Setup Guide..."
        open_in_browser "$SCRIPT_DIR/setup-guide.md" "setup-guide.md"
        ;;
    4)
        echo "Opening Cost Calculation..."
        open_in_browser "$SCRIPT_DIR/cost-calculation.md" "cost-calculation.md"
        ;;
    5)
        echo "Opening Error Handling..."
        open_in_browser "$SCRIPT_DIR/error-handling.md" "error-handling.md"
        ;;
    6)
        echo "Opening Testing Guide..."
        open_in_browser "$SCRIPT_DIR/testing-guide.md" "testing-guide.md"
        ;;
    7)
        echo "Opening cURL Examples..."
        open_in_browser "$SCRIPT_DIR/curl-examples.md" "curl-examples.md"
        ;;
    8)
        echo "Opening Quick Start..."
        open_in_browser "$SCRIPT_DIR/quick-start.md" "quick-start.md"
        ;;
    9)
        echo "Opening Documentation Index..."
        open_in_browser "$SCRIPT_DIR/documentation-index.md" "documentation-index.md"
        ;;
    10)
        echo "Running test script..."
        cd "$SCRIPT_DIR"
        node test-shipment-api.js
        ;;
    *)
        echo "Invalid choice. Please run the script again and select 1-10."
        exit 1
        ;;
esac

echo ""
echo "✅ Done! The documentation should now be open in your browser."
echo ""
echo "💡 Tip: You can also run 'node test-shipment-api.js' to test the API directly."
