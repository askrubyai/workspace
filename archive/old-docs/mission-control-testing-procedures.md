# Mission Control Testing Procedures
**Date**: February 2, 2026  
**Version**: 1.0  

## Testing Workflow

### Test 1: API Endpoints ✅
**Status**: PASSED  
**Objective**: Verify all API endpoints work correctly

1. **REST API Endpoints**
   - ✅ `GET /api/tasks` - Returns task list
   - ✅ `POST /api/tasks` - Creates new tasks  
   - ✅ `GET /api/tasks/:id` - Returns specific task
   - ✅ `PUT /api/tasks/:id` - Updates task
   - ✅ `GET /api/agents` - Returns agent list

2. **Convex-style Endpoints**
   - ✅ `POST /api/query` - Query endpoint working
   - ✅ `POST /api/mutation` - Mutation endpoint working

### Test 2: Agent Registration ✅  
**Status**: PASSED  
**Objective**: Verify agents are properly registered

1. **Agent Configuration**
   - ✅ Commander: Claude Opus 4 model
   - ✅ Researcher: Claude Sonnet 4 model  
   - ✅ Coder: Claude Opus 4 model
   - ✅ All agents have proper workspace directories

2. **Agent Data Registration**
   - ✅ agents.json populated with correct agent metadata
   - ✅ Agent IDs match task assignments
   - ✅ Heartbeat schedules defined

### Test 3: Heartbeat System ✅
**Status**: PASSED  
**Objective**: Verify agent heartbeats work correctly

1. **Cron Job Configuration**
   - ✅ Commander: :00, :15, :30, :45 (targets commander agent)
   - ✅ Researcher: :02, :17, :32, :47 (targets researcher agent)  
   - ✅ Coder: :04, :19, :34, :49 (targets coder agent)
   - ✅ All cron jobs use isolated sessions
   - ✅ Proper staggering to avoid API conflicts

### Test 4: Task Management System
**Objective**: Verify end-to-end task workflow

#### Test 4.1: Task Creation
```bash
# Create test task via API
curl -X POST http://localhost:3210/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Mission Control Integration",
    "description": "Verify task creation and assignment works",
    "priority": "high",
    "status": "new"
  }'
```

#### Test 4.2: Task Assignment (Commander Role)
**Expected**: Commander should detect unassigned task and assign to appropriate agent

#### Test 4.3: Task Execution (Agent Role)  
**Expected**: Assigned agent should pick up task and complete it

#### Test 4.4: Task Completion
**Expected**: Task status should update to 'done' and results saved

### Test 5: UI Integration
**Objective**: Verify Mission Control UI works with backend

1. **Frontend Loading**
   - ✅ UI loads at http://localhost:5173
   - ✅ Backend connection established
   - ✅ No demo mode (real backend integration)

2. **UI Components** (To be tested)
   - [ ] Kanban board displays tasks correctly
   - [ ] Agent sidebar shows agent status
   - [ ] Activity feed updates in real-time
   - [ ] Task drag-drop functionality works

### Test 6: Telegram Integration 
**Status**: PENDING  
**Objective**: Verify Telegram tasks flow to Mission Control

**Issue**: No routing rules configured to direct Telegram messages to Commander

**Required Fix**:
1. Set up routing rules for task-related keywords
2. Configure Commander to receive specific types of Telegram messages
3. Test message → task creation → assignment workflow

### Test 7: Model Switching
**Objective**: Verify dynamic model assignment works

1. **Static Assignment** ✅
   - Commander: Opus for complex delegation decisions
   - Coder: Opus for complex implementation tasks
   - Researcher: Sonnet for most research tasks

2. **Dynamic Assignment** (Future Enhancement)
   - Researcher should use Opus for complex analysis
   - Auto-escalation based on task complexity

## Critical Issues Fixed ✅

1. **Agent Routing**: Fixed heartbeat cron jobs to target proper agents
2. **API Endpoints**: Added missing REST endpoints to json-backend.cjs  
3. **Agent Registration**: Populated agents.json with proper metadata
4. **Model Assignment**: Updated Commander to use Claude Opus

## Current System Status

### ✅ Operational Components
- Backend API (JSON-based) on port 3210
- Frontend UI on port 5173  
- 3 specialized agents (Commander, Researcher, Coder)
- Heartbeat system with proper scheduling
- Task data persistence and management

### 🔄 Pending Issues
- Telegram routing integration
- UI component testing
- End-to-end task workflow validation
- Real-time update testing

## Next Steps

1. **Complete UI Testing**: Verify all frontend components work
2. **Set up Telegram Routing**: Configure message routing to Commander
3. **End-to-End Test**: Create task via Telegram → Mission Control → Assignment → Completion
4. **Performance Testing**: Test with multiple concurrent tasks
5. **Documentation**: Update system documentation with current workflow

## Success Criteria

✅ **Foundation**: Backend, agents, and heartbeats operational  
🔄 **Integration**: UI and Telegram integration pending  
⏳ **Workflow**: End-to-end task management pending validation  

**Overall Status**: 75% Complete - Core system operational, integration pending