#!/usr/bin/env python3
"""
Windsurf AI Integration Protocol
Mandatory changelog-first response automation
"""

import os
import sys
from pathlib import Path
from typing import Dict, Optional, Callable
from functools import wraps
from changelog_engine import ChangelogEngine
from state_manager import StateManager

class WindsurfIntegration:
    def __init__(self):
        self.changelog_engine = ChangelogEngine()
        self.state_manager = StateManager()
        self.session_active = False
        self.mandatory_protocol_enabled = True
        
    def initialize_session(self) -> bool:
        """Initialize Windsurf AI session with changelog system"""
        try:
            # Validate system integrity
            if not self.changelog_engine.validate_system_integrity():
                self._emergency_recovery()
                
            # Initialize workspace state
            current_state = self.state_manager.get_current_state()
            
            # Update session marker
            self.session_active = True
            
            print("✓ Windsurf AI Integration: OPERATIONAL")
            print(f"✓ Workspace State: {current_state.total_files} files tracked")
            print(f"✓ Changelog Engine: Answer #{self.changelog_engine.answer_counter:03d} ready")
            
            return True
            
        except Exception as e:
            print(f"✗ Integration failure: {e}")
            return False
    
    def mandatory_changelog_decorator(self, summary: str = "AI Response Processing"):
        """Decorator enforcing mandatory changelog-first protocol"""
        def decorator(func: Callable) -> Callable:
            @wraps(func)
            def wrapper(*args, **kwargs):
                if not self.mandatory_protocol_enabled:
                    return func(*args, **kwargs)
                
                # Pre-response: Capture state
                pre_state = self.state_manager.get_current_state()
                
                # Execute response
                result = func(*args, **kwargs)
                
                # Post-response: Update changelog
                try:
                    self.changelog_engine.update_changelog(
                        summary=summary,
                        previous_description="AI processing state",
                        current_description="Response execution completed"
                    )
                    
                    # Validate workspace sync
                    self._validate_workspace_sync()
                    
                except Exception as e:
                    print(f"⚠ Changelog update failed: {e}")
                    
                return result
            return wrapper
        return decorator
    
    def _validate_workspace_sync(self) -> bool:
        """Validate workspace synchronization"""
        try:
            current_state = self.state_manager.get_current_state()
            changes = self.state_manager.detect_changes()
            
            # Verify state consistency
            if not current_state.state_hash:
                return False
                
            # Check change detection
            if len(changes) > 100:  # Sanity check
                print("⚠ Excessive changes detected - validation required")
                return False
                
            return True
            
        except Exception:
            return False
    
    def _emergency_recovery(self):
        """Emergency system recovery protocol"""
        print("🔧 Emergency recovery initiated...")
        
        try:
            # Rebuild state cache
            self.state_manager.cleanup_cache()
            fresh_state = self.state_manager.get_current_state(force_refresh=True)
            
            # Validate changelog integrity
            if not self.changelog_engine.changelog_path.exists():
                self.changelog_engine.changelog_path.touch()
                
            print("✓ Emergency recovery completed")
            
        except Exception as e:
            print(f"✗ Recovery failed: {e}")
            sys.exit(1)
    
    def get_system_status(self) -> Dict:
        """Get comprehensive system status"""
        workspace_report = self.changelog_engine.generate_workspace_report()
        
        return {
            "session_active": self.session_active,
            "mandatory_protocol": self.mandatory_protocol_enabled,
            "system_integrity": self.changelog_engine.validate_system_integrity(),
            "workspace_health": workspace_report["system_health"],
            "performance_metrics": workspace_report["performance_metrics"],
            "current_answer": self.changelog_engine.answer_counter
        }
    
    def execute_windsurf_command(self, command: str, summary: str) -> str:
        """Execute command with mandatory changelog integration"""
        @self.mandatory_changelog_decorator(summary)
        def _execute():
            # Command execution simulation
            return f"Command '{command}' executed successfully"
        
        return _execute()

# Global integration instance
windsurf = WindsurfIntegration()

# Mandatory protocol enforcement
def changelog_required(summary: str = "System Operation"):
    """Global decorator for changelog enforcement"""
    return windsurf.mandatory_changelog_decorator(summary)

# System initialization
if __name__ == "__main__":
    # Initialize integration
    if windsurf.initialize_session():
        status = windsurf.get_system_status()
        print(f"\nSystem Status: {status}")
        
        # Test mandatory protocol
        @changelog_required("Integration test execution")
        def test_function():
            return "Test completed successfully"
        
        result = test_function()
        print(f"Protocol test: {result}")
    else:
        print("Integration initialization failed")
        sys.exit(1)