/**
 * Daily Accountability System - Technical Infrastructure
 * Friday (Developer) - Integration with Pepper's email automation design
 * Built: 2026-02-03 03:34 IST
 * 
 * Purpose: Automate Pepper's accountability email sequences and track Reuben's progress
 */

const cron = require('node-cron');
const fs = require('fs').promises;
const path = require('path');

class LifeTransformationTracker {
    constructor() {
        this.dataPath = '/Users/ruby/.openclaw/workspace/artifacts/life-transformation/data';
        this.startDate = new Date('2026-02-03'); // Transformation start
        this.currentPhase = 'foundation'; // foundation -> momentum -> transformation
        
        this.init();
    }

    async init() {
        // Ensure data directory exists
        await fs.mkdir(this.dataPath, { recursive: true });
        
        // Initialize tracking files if they don't exist
        await this.initializeDataFiles();
        
        // Schedule automated emails
        this.scheduleEmails();
        
        console.log('✅ Life Transformation Tracker initialized');
        console.log(`📊 Day ${this.getCurrentDay()} of transformation journey`);
    }

    async initializeDataFiles() {
        const files = {
            'daily-responses.json': [],
            'progress-metrics.json': {
                smokingQuitDate: '2026-02-03',
                startWeight: 116,
                currentWeight: 116,
                workoutCount: 0,
                sleepQuality: [],
                professionalWins: [],
                currentStreak: 0
            },
            'email-templates.json': await this.loadEmailTemplates()
        };

        for (const [filename, content] of Object.entries(files)) {
            const filepath = path.join(this.dataPath, filename);
            try {
                await fs.access(filepath);
            } catch (error) {
                await fs.writeFile(filepath, JSON.stringify(content, null, 2));
                console.log(`📝 Created ${filename}`);
            }
        }
    }

    async loadEmailTemplates() {
        return {
            morningTemplate: {
                subject: "Today's Win: {dailyGoal}",
                body: `Good morning, Champion 💎

Yesterday's win: {yesterdayWin}
Today's focus: {dailyGoal}

Remember: We're building the foundation that will create the transformation you want in 90 days. Every day you show up is a victory.

Your only job today: {specificAction}

Reply DONE when completed.
- Ruby (Pepper)`
            },
            eveningTemplate: {
                subject: "Foundation Day {dayNumber}: Progress Report",
                body: `Day {dayNumber} Foundation Complete ✅

What you accomplished: {todayAccomplishments}

Tomorrow's building block: {tomorrowGoal}

90-day vision reminder: The confident, healthy, unstoppable version of yourself who handles 3 professional roles with ease while feeling amazing in his body.

30-day reality: You're laying the groundwork that makes that vision inevitable.

Sleep well - your body transforms when you rest.
- Ruby (Pepper)`
            }
        };
    }

    getCurrentDay() {
        const now = new Date();
        const diffTime = now - this.startDate;
        return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    }

    getCurrentPhase() {
        const day = this.getCurrentDay();
        if (day <= 14) return 'foundation';
        if (day <= 30) return 'momentum';
        return 'transformation';
    }

    getDailyGoalByPhase(day) {
        const phase = this.getCurrentPhase();
        const goals = {
            foundation: {
                1: "Take your first 20-minute walk (any pace)",
                2: "Go 24 hours without smoking",
                3: "Sleep by 11 PM and wake at 7 AM",
                4: "Walk + drink 3 liters of water", 
                5: "72 hours smoke-free celebration walk",
                6: "Meal prep one healthy lunch",
                7: "Week 1 complete - foundation progress photo",
                8: "Start simple bodyweight squats (10 reps)",
                9: "Professional role: optimize one daily task",
                10: "10-minute meditation + walk",
                11: "Cook one healthy dinner at home",
                12: "Add push-ups to routine (start with 5)",
                13: "Two weeks smoke-free milestone",
                14: "Foundation phase complete - measure progress"
            },
            momentum: {
                15: "First gym session or home strength training",
                16: "Meal prep for 3 days",
                17: "Professional win: excel in one role today",
                18: "Notice posture improvements",
                19: "Increase workout intensity slightly",
                20: "Sleep optimization: 8 hours tonight",
                21: "Three weeks milestone - progress photo",
                22: "Add protein to every meal",
                23: "Professional efficiency: optimize workflow",
                24: "Celebrate visible changes",
                25: "Posture is improving (chest looks different)",
                26: "Advanced workout: add weight or reps",
                27: "Meal prep mastery",
                28: "Professional role balance review",
                29: "Month foundation prep",
                30: "Foundation Phase Complete - Transformation Accelerates"
            }
        };
        
        return goals[phase][day] || "Maintain all established habits";
    }

    scheduleEmails() {
        // Morning motivation email: 7:00 AM IST daily
        cron.schedule('0 7 * * *', async () => {
            console.log('🌅 Sending morning motivation email...');
            await this.sendMorningEmail();
        }, {
            timezone: "Asia/Calcutta"
        });

        // Evening reflection email: 9:00 PM IST daily  
        cron.schedule('0 21 * * *', async () => {
            console.log('🌙 Sending evening reflection email...');
            await this.sendEveningEmail();
        }, {
            timezone: "Asia/Calcutta"
        });

        console.log('📅 Email schedule configured: 7:00 AM & 9:00 PM IST');
    }

    async sendMorningEmail() {
        const day = this.getCurrentDay();
        const dailyGoal = this.getDailyGoalByPhase(day);
        const yesterdayWin = await this.getYesterdayWin();
        
        // Use OpenClaw message tool to send email
        const emailContent = this.formatMorningEmail({
            dailyGoal,
            yesterdayWin,
            specificAction: dailyGoal
        });
        
        // Log to tracking system
        await this.logEmailSent('morning', emailContent);
        
        // Would integrate with OpenClaw message tool here
        console.log('📧 Morning email prepared:', emailContent.subject);
    }

    async sendEveningEmail() {
        const day = this.getCurrentDay();
        const todayAccomplishments = await this.getTodayAccomplishments();
        const tomorrowGoal = this.getDailyGoalByPhase(day + 1);
        
        const emailContent = this.formatEveningEmail({
            dayNumber: day,
            todayAccomplishments,
            tomorrowGoal
        });
        
        await this.logEmailSent('evening', emailContent);
        console.log('📧 Evening email prepared:', emailContent.subject);
    }

    formatMorningEmail(data) {
        const templates = require(path.join(this.dataPath, 'email-templates.json'));
        let content = templates.morningTemplate.body;
        
        content = content.replace('{yesterdayWin}', data.yesterdayWin);
        content = content.replace('{dailyGoal}', data.dailyGoal);
        content = content.replace('{specificAction}', data.specificAction);
        
        return {
            subject: templates.morningTemplate.subject.replace('{dailyGoal}', data.dailyGoal.split(':')[0]),
            body: content
        };
    }

    formatEveningEmail(data) {
        const templates = require(path.join(this.dataPath, 'email-templates.json'));
        let content = templates.eveningTemplate.body;
        
        content = content.replace(/{dayNumber}/g, data.dayNumber);
        content = content.replace('{todayAccomplishments}', data.todayAccomplishments);
        content = content.replace('{tomorrowGoal}', data.tomorrowGoal);
        
        return {
            subject: templates.eveningTemplate.subject.replace('{dayNumber}', data.dayNumber),
            body: content
        };
    }

    async recordResponse(response, type = 'done') {
        const responses = JSON.parse(await fs.readFile(path.join(this.dataPath, 'daily-responses.json')));
        
        const newResponse = {
            date: new Date().toISOString().split('T')[0],
            day: this.getCurrentDay(),
            type: type, // done, missed, frustrated, no_response
            response: response,
            timestamp: new Date().toISOString()
        };
        
        responses.push(newResponse);
        await fs.writeFile(path.join(this.dataPath, 'daily-responses.json'), JSON.stringify(responses, null, 2));
        
        // Trigger automated follow-up based on response type
        await this.triggerFollowUp(type, newResponse);
        
        console.log(`📝 Recorded response: ${type} on day ${this.getCurrentDay()}`);
    }

    async triggerFollowUp(responseType, responseData) {
        const followUps = {
            done: () => this.sendCelebrationMessage(),
            missed: () => this.sendGentleRedirection(),
            frustrated: () => this.sendExpectationReset(),
            no_response: () => this.sendCaringCheckIn()
        };

        if (followUps[responseType]) {
            console.log(`🤖 Triggering ${responseType} follow-up`);
            await followUps[responseType]();
        }
    }

    async getYesterdayWin() {
        const responses = JSON.parse(await fs.readFile(path.join(this.dataPath, 'daily-responses.json')));
        const yesterday = this.getCurrentDay() - 1;
        const yesterdayResponse = responses.find(r => r.day === yesterday && r.type === 'done');
        
        return yesterdayResponse 
            ? `Completed: ${this.getDailyGoalByPhase(yesterday)}`
            : "You showed up and tried - that's what matters";
    }

    async getTodayAccomplishments() {
        const responses = JSON.parse(await fs.readFile(path.join(this.dataPath, 'daily-responses.json')));
        const today = this.getCurrentDay();
        const todayResponses = responses.filter(r => r.day === today);
        
        return todayResponses.length > 0
            ? todayResponses.map(r => r.response).join(', ')
            : "Showed up for the journey";
    }

    async logEmailSent(type, content) {
        const logPath = path.join(this.dataPath, 'email-log.json');
        let logs = [];
        
        try {
            logs = JSON.parse(await fs.readFile(logPath));
        } catch (error) {
            // File doesn't exist yet
        }
        
        logs.push({
            type: type,
            day: this.getCurrentDay(),
            timestamp: new Date().toISOString(),
            subject: content.subject
        });
        
        await fs.writeFile(logPath, JSON.stringify(logs, null, 2));
    }

    async generateProgressDashboard() {
        const responses = JSON.parse(await fs.readFile(path.join(this.dataPath, 'daily-responses.json')));
        const metrics = JSON.parse(await fs.readFile(path.join(this.dataPath, 'progress-metrics.json')));
        
        const day = this.getCurrentDay();
        const completionRate = responses.filter(r => r.type === 'done').length / day * 100;
        const currentStreak = this.calculateCurrentStreak(responses);
        
        return {
            day: day,
            phase: this.getCurrentPhase(),
            completionRate: Math.round(completionRate),
            currentStreak: currentStreak,
            smokingFreedays: this.getSmokingFreeDays(metrics.smokingQuitDate),
            totalResponses: responses.length,
            recentProgress: responses.slice(-7) // Last 7 days
        };
    }

    calculateCurrentStreak(responses) {
        let streak = 0;
        const sortedResponses = responses
            .filter(r => r.type === 'done')
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            
        for (let i = 0; i < sortedResponses.length; i++) {
            const responseDay = sortedResponses[i].day;
            const expectedDay = this.getCurrentDay() - i;
            
            if (responseDay === expectedDay) {
                streak++;
            } else {
                break;
            }
        }
        
        return streak;
    }

    getSmokingFreeDays(quitDate) {
        const quit = new Date(quitDate);
        const now = new Date();
        return Math.floor((now - quit) / (1000 * 60 * 60 * 24));
    }

    // Integration methods for OpenClaw tools
    async sendCelebrationMessage() {
        return "🎉 Excellent work today! Your consistency is building the foundation for incredible transformation.";
    }

    async sendGentleRedirection() {
        return "No worries about missing today. Tomorrow is a fresh start. What's one small thing you can do right now?";
    }

    async sendExpectationReset() {
        return "I hear the frustration. Remember: We're building 90-day transformation on a 30-day foundation. Your body is changing - it takes time to become visible. Trust the process.";
    }

    async sendCaringCheckIn() {
        return "Haven't heard from you in a bit. Everything okay? Even just a quick 'hey' lets me know you're still on the journey.";
    }
}

module.exports = LifeTransformationTracker;

// Example usage:
// const tracker = new LifeTransformationTracker();
// await tracker.recordResponse("Completed 20-min walk and stayed smoke-free!", "done");
// const dashboard = await tracker.generateProgressDashboard();