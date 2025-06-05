#!/usr/bin/env python3
"""
Production Validation Suite
Comprehensive system integrity and performance validation
"""

import time
import json
import hashlib
from pathlib import Path
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass, asdict

from workspace_scanner import WorkspaceScanner
from state_manager import StateManager
from changelog_engine import ChangelogEngine

@dataclass
class ValidationResult:
    component: str
    status: str  # PASS, FAIL, WARNING
    message: str
    execution_time: float
    details: Dict

@dataclass
class SystemHealth:
    overall_status: str
    validation_results: List[ValidationResult]
    performance_metrics: Dict
    recommendations: List[str]

class ValidationSuite:
    def __init__(self):
        self.scanner = WorkspaceScanner()
        self.state_manager = StateManager()
        self.changelog_engine = ChangelogEngine()
        
        # Performance thresholds
        self.performance_thresholds = {
            "scan_time_ms": 5000,        # 5 seconds max
            "state_gen_ms": 1000,        # 1 second max
            "cache_hit_rate": 0.80,      # 80% minimum
            "memory_mb": 50,             # 50MB maximum
            "response_time_ms": 50       # 50ms target
        }
    
    def validate_workspace_scanner(self) -> ValidationResult:
        """Validate workspace scanner functionality"""
        start_time = time.time()
        
        try:
            # Test basic scanning
            state = self.scanner.scan_workspace()
            
            # Validate state completeness
            if not state.files or not state.state_hash:
                return ValidationResult(
                    component="workspace_scanner",
                    status="FAIL",
                    message="Scanner produced incomplete state",
                    execution_time=time.time() - start_time,
                    details={"files": len(state.files), "hash": bool(state.state_hash)}
                )
            
            # Performance validation
            exec_time_ms = (time.time() - start_time) * 1000
            if exec_time_ms > self.performance_thresholds["scan_time_ms"]:
                status = "WARNING"
                message = f"Scanner performance below threshold: {exec_time_ms:.1f}ms"
            else:
                status = "PASS"
                message = f"Scanner operational: {len(state.files)} files, {exec_time_ms:.1f}ms"
            
            return ValidationResult(
                component="workspace_scanner",
                status=status,
                message=message,
                execution_time=time.time() - start_time,
                details={
                    "files_count": len(state.files),
                    "directories_count": len(state.directories),
                    "total_size": state.total_size,
                    "performance_ms": exec_time_ms
                }
            )
            
        except Exception as e:
            return ValidationResult(
                component="workspace_scanner",
                status="FAIL",
                message=f"Scanner exception: {str(e)}",
                execution_time=time.time() - start_time,
                details={"error": str(e)}
            )
    
    def validate_state_manager(self) -> ValidationResult:
        """Validate state manager functionality"""
        start_time = time.time()
        
        try:
            # Test state generation
            current_state = self.state_manager.get_current_state()
            
            # Test caching
            cached_state = self.state_manager.get_current_state()
            
            # Test change detection
            changes = self.state_manager.detect_changes()
            
            # Validate metrics
            metrics = self.state_manager.get_metrics()
            
            # Performance validation
            exec_time_ms = (time.time() - start_time) * 1000
            cache_hit_rate = float(metrics["cache_hit_rate"].rstrip('%')) / 100
            
            # Determine status
            issues = []
            if exec_time_ms > self.performance_thresholds["state_gen_ms"]:
                issues.append(f"Performance: {exec_time_ms:.1f}ms")
            
            if cache_hit_rate < self.performance_thresholds["cache_hit_rate"]:
                issues.append(f"Cache efficiency: {cache_hit_rate:.1%}")
            
            status = "WARNING" if issues else "PASS"
            message = f"State manager operational: {', '.join(issues)}" if issues else "State manager optimal"
            
            return ValidationResult(
                component="state_manager",
                status=status,
                message=message,
                execution_time=time.time() - start_time,
                details={
                    "state_hash": current_state.state_hash,
                    "cache_hit_rate": cache_hit_rate,
                    "changes_detected": len(changes),
                    "performance_ms": exec_time_ms
                }
            )
            
        except Exception as e:
            return ValidationResult(
                component="state_manager",
                status="FAIL",
                message=f"State manager exception: {str(e)}",
                execution_time=time.time() - start_time,
                details={"error": str(e)}
            )
    
    def validate_changelog_engine(self) -> ValidationResult:
        """Validate changelog engine functionality"""
        start_time = time.time()
        
        try:
            # Test integrity validation
            integrity_check = self.changelog_engine.validate_system_integrity()
            
            # Test entry generation
            test_entry = self.changelog_engine.generate_answer_entry(
                "Validation test entry",
                "Test previous state",
                "Test current state"
            )
            
            # Test formatting
            formatted_entry = self.changelog_engine.format_answer_entry(test_entry)
            
            # Test workspace report
            workspace_report = self.changelog_engine.generate_workspace_report()
            
            # Validate components
            exec_time_ms = (time.time() - start_time) * 1000
            
            issues = []
            if not integrity_check:
                issues.append("Integrity check failed")
            
            if not formatted_entry or len(formatted_entry) < 100:
                issues.append("Entry formatting failed")
            
            if not workspace_report or not workspace_report.get("workspace_overview"):
                issues.append("Report generation failed")
            
            status = "FAIL" if issues else "PASS"
            message = f"Changelog engine: {', '.join(issues)}" if issues else "Changelog engine operational"
            
            return ValidationResult(
                component="changelog_engine",
                status=status,
                message=message,
                execution_time=time.time() - start_time,
                details={
                    "integrity_check": integrity_check,
                    "entry_generated": bool(test_entry),
                    "report_generated": bool(workspace_report),
                    "performance_ms": exec_time_ms
                }
            )
            
        except Exception as e:
            return ValidationResult(
                component="changelog_engine",
                status="FAIL",
                message=f"Changelog engine exception: {str(e)}",
                execution_time=time.time() - start_time,
                details={"error": str(e)}
            )
    
    def validate_file_operations(self) -> ValidationResult:
        """Validate file system operations"""
        start_time = time.time()
        
        try:
            test_dir = Path(".test_validation")
            test_file = test_dir / "test_file.txt"
            
            # Create test directory
            test_dir.mkdir(exist_ok=True)
            
            # Test file creation
            test_file.write_text("Validation test content")
            
            # Test file reading
            content = test_file.read_text()
            
            # Test file modification detection
            initial_state = self.scanner.scan_workspace()
            test_file.write_text("Modified content")
            modified_state = self.scanner.scan_workspace()
            
            # Compare states
            changes = self.scanner.compare_states(initial_state, modified_state)
            
            # Cleanup
            test_file.unlink()
            test_dir.rmdir()
            
            # Validate results
            if content != "Validation test content":
                raise ValueError("File content validation failed")
            
            if not changes["modified"]:
                raise ValueError("Change detection failed")
            
            return ValidationResult(
                component="file_operations",
                status="PASS",
                message="File operations validated successfully",
                execution_time=time.time() - start_time,
                details={
                    "file_creation": True,
                    "file_reading": True,
                    "change_detection": len(changes["modified"]) > 0
                }
            )
            
        except Exception as e:
            # Cleanup on error
            try:
                if test_file.exists():
                    test_file.unlink()
                if test_dir.exists():
                    test_dir.rmdir()
            except:
                pass
            
            return ValidationResult(
                component="file_operations",
                status="FAIL",
                message=f"File operations failed: {str(e)}",
                execution_time=time.time() - start_time,
                details={"error": str(e)}
            )
    
    def validate_performance_metrics(self) -> ValidationResult:
        """Validate system performance metrics"""
        start_time = time.time()
        
        try:
            # Memory usage estimation
            import psutil
            process = psutil.Process()
            memory_mb = process.memory_info().rss / (1024 * 1024)
            
            # Response time test
            response_start = time.time()
            state = self.state_manager.get_current_state()
            response_time_ms = (time.time() - response_start) * 1000
            
            # Cache performance
            metrics = self.state_manager.get_metrics()
            cache_hit_rate = float(metrics["cache_hit_rate"].rstrip('%')) / 100
            
            # Evaluate performance
            issues = []
            if memory_mb > self.performance_thresholds["memory_mb"]:
                issues.append(f"Memory: {memory_mb:.1f}MB")
            
            if response_time_ms > self.performance_thresholds["response_time_ms"]:
                issues.append(f"Response: {response_time_ms:.1f}ms")
            
            if cache_hit_rate < self.performance_thresholds["cache_hit_rate"]:
                issues.append(f"Cache: {cache_hit_rate:.1%}")
            
            status = "WARNING" if issues else "PASS"
            message = f"Performance: {', '.join(issues)}" if issues else "Performance optimal"
            
            return ValidationResult(
                component="performance_metrics",
                status=status,
                message=message,
                execution_time=time.time() - start_time,
                details={
                    "memory_mb": memory_mb,
                    "response_time_ms": response_time_ms,
                    "cache_hit_rate": cache_hit_rate
                }
            )
            
        except ImportError:
            return ValidationResult(
                component="performance_metrics",
                status="WARNING",
                message="Performance monitoring unavailable (psutil not installed)",
                execution_time=time.time() - start_time,
                details={"psutil_available": False}
            )
        except Exception as e:
            return ValidationResult(
                component="performance_metrics",
                status="FAIL",
                message=f"Performance validation failed: {str(e)}",
                execution_time=time.time() - start_time,
                details={"error": str(e)}
            )
    
    def run_full_validation(self) -> SystemHealth:
        """Execute comprehensive system validation"""
        print("🔍 Executing comprehensive system validation...")
        
        validation_functions = [
            self.validate_workspace_scanner,
            self.validate_state_manager,
            self.validate_changelog_engine,
            self.validate_file_operations,
            self.validate_performance_metrics
        ]
        
        results = []
        for validation_func in validation_functions:
            result = validation_func()
            results.append(result)
            
            # Status indicator
            status_icon = {"PASS": "✓", "WARNING": "⚠", "FAIL": "✗"}[result.status]
            print(f"  {status_icon} {result.component}: {result.message}")
        
        # Determine overall status
        statuses = [r.status for r in results]
        if "FAIL" in statuses:
            overall_status = "SYSTEM_FAILURE"
        elif "WARNING" in statuses:
            overall_status = "SYSTEM_DEGRADED"
        else:
            overall_status = "SYSTEM_OPTIMAL"
        
        # Generate recommendations
        recommendations = self._generate_recommendations(results)
        
        # Performance summary
        total_time = sum(r.execution_time for r in results)
        performance_metrics = {
            "total_validation_time": total_time,
            "average_component_time": total_time / len(results),
            "components_validated": len(results),
            "pass_rate": len([r for r in results if r.status == "PASS"]) / len(results)
        }
        
        return SystemHealth(
            overall_status=overall_status,
            validation_results=results,
            performance_metrics=performance_metrics,
            recommendations=recommendations
        )
    
    def _generate_recommendations(self, results: List[ValidationResult]) -> List[str]:
        """Generate system optimization recommendations"""
        recommendations = []
        
        for result in results:
            if result.status == "FAIL":
                recommendations.append(f"CRITICAL: Fix {result.component} - {result.message}")
            elif result.status == "WARNING":
                recommendations.append(f"OPTIMIZE: Improve {result.component} performance")
        
        # General recommendations
        if not recommendations:
            recommendations.append("System operating at optimal performance")
        
        return recommendations
    
    def generate_validation_report(self, health: SystemHealth) -> str:
        """Generate comprehensive validation report"""
        lines = [
            "# SYSTEM VALIDATION REPORT",
            f"**Overall Status:** {health.overall_status}",
            f"**Validation Date:** {time.strftime('%Y-%m-%d %H:%M:%S')}",
            "",
            "## Component Validation Results",
            ""
        ]
        
        for result in health.validation_results:
            status_icon = {"PASS": "✓", "WARNING": "⚠", "FAIL": "✗"}[result.status]
            lines.extend([
                f"### {status_icon} {result.component.title().replace('_', ' ')}",
                f"**Status:** {result.status}",
                f"**Message:** {result.message}",
                f"**Execution Time:** {result.execution_time:.3f}s",
                f"**Details:** {json.dumps(result.details, indent=2)}",
                ""
            ])
        
        lines.extend([
            "## Performance Metrics",
            f"- **Total Validation Time:** {health.performance_metrics['total_validation_time']:.3f}s",
            f"- **Average Component Time:** {health.performance_metrics['average_component_time']:.3f}s",
            f"- **Pass Rate:** {health.performance_metrics['pass_rate']:.1%}",
            "",
            "## Recommendations"
        ])
        
        for rec in health.recommendations:
            lines.append(f"- {rec}")
        
        return "\n".join(lines)

if __name__ == "__main__":
    validator = ValidationSuite()
    health = validator.run_full_validation()
    
    print(f"\n🏥 System Health: {health.overall_status}")
    print(f"📊 Pass Rate: {health.performance_metrics['pass_rate']:.1%}")
    
    # Generate and save report
    report = validator.generate_validation_report(health)
    Path("validation_report.md").write_text(report)
    print("📋 Validation report saved to validation_report.md")