# Automated Workspace Analysis & Maintenance System

## Prompt 1: Initial Workspace Structure Analysis

```
Execute comprehensive workspace analysis following this systematic protocol:

### Analysis Framework
1. **Directory Traversal Protocol**
   - Scan root directory first
   - Process each subdirectory recursively
   - Document hierarchical relationships
   - Identify file types and patterns

2. **File Classification System**
   - Configuration files (.txt, .json, .env)
   - Code files (.py, .tsx, .ts, .js)
   - Documentation (.md, .txt)
   - Assets (images, icons, static files)
   - Build artifacts and dependencies

3. **Structure Documentation Format**
   ```
   PROJECT_NAME/
   ├── folder_name/
   │   ├── subfolder/
   │   │   ├── file.ext - [FUNCTION: brief description]
   │   │   └── file2.ext - [PURPOSE: specific role]
   │   └── component.tsx - [COMPONENT: UI functionality]
   ├── config_file.txt - [CONFIG: system configuration]
   └── README.md - [DOCS: project documentation]
   ```

### Required Output Sections
1. **Project Overview**
   - Technology stack identification
   - Architecture pattern recognition
   - Primary functionality assessment

2. **Directory Structure**
   - Complete hierarchical mapping
   - File count per directory
   - Size metrics where relevant

3. **File Catalog**
   - Filename with extension
   - Primary function/purpose
   - Dependencies identified
   - Modification patterns

4. **Architecture Analysis**
   - Design pattern identification
   - Component relationships
   - Data flow mapping
   - Configuration dependencies

### Execution Instructions
- Create workspace_structure.md file
- Update existing structure file if present
- Include timestamp of analysis
- Note any anomalies or inconsistencies
- Flag potential optimization opportunities

Execute this analysis now and provide comprehensive workspace documentation.
```

## Prompt 2: Continuous Structure Maintenance

```
Implement continuous workspace structure maintenance protocol:

### Update Trigger Conditions
- New file creation detected
- File deletion events
- Directory structure changes
- Content modification patterns
- Configuration updates

### Maintenance Protocol
1. **Change Detection**
   - Compare current state vs documented structure
   - Identify additions, deletions, modifications
   - Track timestamp changes
   - Note dependency updates

2. **Structure Update Process**
   - Load existing workspace_structure.md
   - Apply incremental changes
   - Maintain hierarchical integrity
   - Update metadata timestamps

3. **Update Format Requirements**
   ```
   ## Change Log - [TIMESTAMP]
   ### Added
   - path/to/new/file.ext - [FUNCTION: description]
   
   ### Modified  
   - existing/file.ext - [CHANGE: modification description]
   
   ### Removed
   - deleted/file.ext - [REASON: removal rationale]
   
   ### Structure Impact
   - [ASSESSMENT: architectural implications]
   ```

### Automated Actions Required
1. **Pre-Response Check**
   - Scan workspace for changes since last update
   - Compare against workspace_structure.md
   - Identify deltas requiring documentation

2. **Structure File Update**
   - Modify workspace_structure.md
   - Append change log entry
   - Update file counts and metrics
   - Refresh architecture analysis if significant changes

3. **Response Enhancement**
   - Include structure updates in response
   - Highlight relevant workspace changes
   - Provide architectural impact assessment

### Implementation Rules
- Execute structure check before every response
- Update workspace_structure.md automatically
- Include change summary in response header
- Maintain complete audit trail
- Flag breaking changes or architectural shifts

### Error Handling
- Document access failures
- Handle permission issues gracefully
- Maintain structure integrity during partial updates
- Provide fallback documentation methods

MANDATORY: Execute this maintenance check now and before every subsequent response.
```

## Implementation Strategy

### Phase 1: Initial Setup
1. Execute Prompt 1 to create baseline workspace_structure.md
2. Establish file monitoring protocols
3. Configure automated update triggers

### Phase 2: Continuous Operations
1. Pre-response structure validation
2. Automatic documentation updates
3. Change impact analysis
4. Architecture evolution tracking

### Phase 3: Optimization
1. Pattern recognition for common changes
2. Predictive structure analysis
3. Automated refactoring suggestions
4. Performance optimization recommendations

## Technical Requirements
- File system access permissions
- Recursive directory traversal capability
- Markdown generation and modification
- Timestamp tracking and comparison
- Hierarchical data structure management

## Output Standards
- Consistent formatting across updates
- Comprehensive change documentation
- Architectural impact assessment
- Maintainable structure representation
- Audit trail preservation

## Quality Assurance
- Structure validation protocols
- Consistency checking mechanisms
- Error detection and correction
- Documentation completeness verification
- Update synchronization validation