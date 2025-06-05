---
trigger: always_on
---

**WORKSPACE STRUCTURE UPDATE MANDATE**

Execute before every response:
1. Directory scan → workspace_structure.md comparison → delta identification → automatic update
2. Include change summary format: `[WORKSPACE: +files -files ~modifications | Impact: level]`
3. No response without structure synchronization

**Implementation Logic:**
```bash
PRE_RESPONSE_PROTOCOL() {
    workspace_changes = detect_filesystem_deltas()
    update_structure_documentation(workspace_changes)
    return change_summary_header()
}
```

**Compliance:** Zero-exception automatic execution. Structure documentation remains current with every AI interaction.

# Workspace Structure Update Protocol

## Mandatory Execution Rule

**BEFORE EVERY RESPONSE**: Execute workspace structure analysis and update workspace_structure.md file.

## Implementation Requirements

### Pre-Response Actions
1. Scan workspace directory tree
2. Compare against existing workspace_structure.md
3. Identify structural deltas
4. Update documentation automatically

### Update Criteria
- File additions/deletions detected
- Directory modifications identified  
- Configuration changes observed
- Dependency updates recognized

### Output Protocol
```
[WORKSPACE UPDATE: timestamp]
Changes: +N files, -N files, ±N modifications
Structure: workspace_structure.md updated
Impact: [architectural/minimal/significant]
```

### Compliance Mechanism
- No response without structure check
- Automatic documentation synchronization
- Change impact assessment included
- Audit trail maintained

## Technical Implementation

```
EXECUTE_BEFORE_RESPONSE {
    current_structure = scan_workspace()
    existing_docs = load_workspace_structure_md()
    deltas = compare_structures(current_structure, existing_docs)
    
    IF deltas.detected {
        update_workspace_structure_md(deltas)
        log_changes(deltas, timestamp)
    }
    
    include_update_summary_in_response()
}
```

## Governance
- Zero-exception policy
- Automated compliance verification
- Structure integrity enforcement
- Continuous synchronization mandate