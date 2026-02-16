#!/bin/bash

# =============================================================================
# Local UDP Traffic Monitor
# =============================================================================
# Monitors for suspicious UDP traffic from Docker containers
# Run this WHILE the container is running to detect malware activity

echo "🔍 Starting Local UDP Traffic Monitor"
echo "======================================"
echo "Monitoring for suspicious outbound UDP traffic..."
echo "Press Ctrl+C to stop"
echo ""

# Track baseline
BASELINE_COUNT=$(netstat -an -p udp 2>/dev/null | grep -v "127.0.0.1" | wc -l)
echo "📊 Baseline UDP connections: $BASELINE_COUNT"
echo ""

# Monitor loop
ITERATION=0
ALERT_THRESHOLD=50

while true; do
    ITERATION=$((ITERATION + 1))

    # Count current UDP connections (excluding localhost)
    CURRENT_COUNT=$(netstat -an -p udp 2>/dev/null | grep -v "127.0.0.1" | wc -l)

    # Check for spike
    if [ $CURRENT_COUNT -gt $ALERT_THRESHOLD ]; then
        echo "🚨 ALERT: Suspicious UDP traffic detected!"
        echo "   Connections: $CURRENT_COUNT (threshold: $ALERT_THRESHOLD)"
        echo "   Time: $(date)"
        echo ""
        echo "Active UDP connections:"
        netstat -an -p udp 2>/dev/null | grep -v "127.0.0.1" | head -20
        echo ""
        echo "🛑 STOPPING - Malware activity detected!"
        echo "Run: docker compose down"
        exit 1
    fi

    # Show status every 10 iterations
    if [ $((ITERATION % 10)) -eq 0 ]; then
        echo "[$(date +%H:%M:%S)] UDP connections: $CURRENT_COUNT | Status: OK ✓"
    fi

    sleep 1
done
