/**
 * Simple Node.js/Express Backend for Avaia Survey
 * 
 * This is a minimal working example to handle survey submissions.
 * Install dependencies: npm install express cors body-parser dotenv
 * 
 * Run: node backend-example.js
 * Server will run on http://localhost:3001
 */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.'));

// In-memory storage (replace with database in production)
const surveyResponses = [];

// ============================================
// API ENDPOINTS
// ============================================

/**
 * GET /api/health - Health check
 */
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

/**
 * POST /api/survey/submit - Submit survey response
 */
app.post('/api/survey/submit', (req, res) => {
    try {
        const surveyData = req.body;
        
        // Validate required fields
        if (!surveyData) {
            return res.status(400).json({
                success: false,
                error: 'Survey data is required'
            });
        }
        
        // Add metadata
        const response = {
            id: generateId(),
            timestamp: new Date().toISOString(),
            ip: req.ip || req.connection.remoteAddress,
            userAgent: req.headers['user-agent'],
            ...surveyData
        };
        
        // Store response
        surveyResponses.push(response);
        
        // Log for debugging
        console.log('[SURVEY SUBMISSION]', {
            id: response.id,
            email: surveyData.email || 'anonymous',
            timestamp: response.timestamp
        });
        
        // Send confirmation
        res.json({
            success: true,
            message: 'Survey submitted successfully',
            id: response.id,
            receivedAt: response.timestamp
        });
        
        // Async: Send email confirmation (if configured)
        if (surveyData.email) {
            sendConfirmationEmail(surveyData.email).catch(err => 
                console.error('Email error:', err)
            );
        }
        
        // Async: Send Slack notification (if configured)
        notifySlack(surveyData).catch(err =>
            console.error('Slack error:', err)
        );
        
    } catch (error) {
        console.error('Survey submission error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * GET /api/survey/responses - Get all responses (admin only)
 * Requires API key in header: X-API-Key
 */
app.get('/api/survey/responses', (req, res) => {
    const apiKey = req.headers['x-api-key'] || req.query.api_key;
    
    if (apiKey !== process.env.ADMIN_API_KEY) {
        return res.status(403).json({
            success: false,
            error: 'Unauthorized'
        });
    }
    
    res.json({
        count: surveyResponses.length,
        responses: surveyResponses
    });
});

/**
 * GET /api/survey/stats - Get response statistics
 */
app.get('/api/survey/stats', (req, res) => {
    const stats = {
        totalResponses: surveyResponses.length,
        travelFrequency: countOccurrences('travelFrequency'),
        groupSize: countOccurrences('groupSize'),
        pricingPreferences: countOccurrences('pricingModel'),
        avgCurrencyDifficulty: calculateAverage('currencyDifficulty'),
        desiredFeatures: countArrayItems('desiredFeatures'),
        emailsCollected: surveyResponses.filter(r => r.email).length
    };
    
    res.json(stats);
});

/**
 * DELETE /api/survey/responses/:id - Delete a response (admin only)
 */
app.delete('/api/survey/responses/:id', (req, res) => {
    const apiKey = req.headers['x-api-key'];
    
    if (apiKey !== process.env.ADMIN_API_KEY) {
        return res.status(403).json({ success: false, error: 'Unauthorized' });
    }
    
    const index = surveyResponses.findIndex(r => r.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ success: false, error: 'Response not found' });
    }
    
    const deleted = surveyResponses.splice(index, 1);
    res.json({ success: true, deleted: deleted[0] });
});

/**
 * POST /api/survey/test - Send test survey (for testing)
 */
app.post('/api/survey/test', (req, res) => {
    const testData = {
        travelFrequency: 'Very frequently',
        groupSize: '4-6',
        multiCurrency: 'Yes, always',
        currencyDifficulty: '4',
        biggestChallenge: 'Converting currencies in real time',
        disputes: 'Yes, occasionally',
        currentMethod: ['Spreadsheets', 'Apps like Splitwise or Revolut'],
        currentSatisfaction: '3',
        desiredFeatures: ['Real-time currency conversion', 'Track who owes who across currencies'],
        pricingModel: 'Freemium',
        additionalComments: 'Please add offline support!',
        email: 'test@avaia.app',
        isTestData: true
    };
    
    const response = {
        id: generateId(),
        timestamp: new Date().toISOString(),
        ip: req.ip,
        userAgent: 'Test Client',
        ...testData
    };
    
    surveyResponses.push(response);
    
    res.json({
        success: true,
        message: 'Test survey submitted',
        id: response.id
    });
});

// ============================================
// HELPER FUNCTIONS
// ============================================

function generateId() {
    return `survey_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function countOccurrences(field) {
    const counts = {};
    surveyResponses.forEach(r => {
        const value = r[field];
        if (value) {
            counts[value] = (counts[value] || 0) + 1;
        }
    });
    return counts;
}

function countArrayItems(field) {
    const counts = {};
    surveyResponses.forEach(r => {
        const value = r[field];
        if (Array.isArray(value)) {
            value.forEach(item => {
                counts[item] = (counts[item] || 0) + 1;
            });
        }
    });
    return counts;
}

function calculateAverage(field) {
    const values = surveyResponses
        .map(r => parseInt(r[field]) || 0)
        .filter(v => v > 0);
    
    if (values.length === 0) return 0;
    return (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2);
}

async function sendConfirmationEmail(email) {
    // Implement email sending here
    // Example using nodemailer:
    /*
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({...});
    
    await transporter.sendMail({
        from: 'survey@avaia.app',
        to: email,
        subject: 'Thank you for taking the Avaia Survey!',
        html: '<h2>Thank you!</h2><p>Your response has been recorded...</p>'
    });
    */
    
    console.log(`[EMAIL] Confirmation sent to ${email}`);
}

async function notifySlack(surveyData) {
    // Implement Slack notification here
    // Example:
    /*
    const axios = require('axios');
    
    await axios.post(process.env.SLACK_WEBHOOK_URL, {
        text: 'New Survey Response',
        blocks: [...]
    });
    */
    
    console.log('[SLACK] Notification sent for new survey');
}

// ============================================
// ERROR HANDLING
// ============================================

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found',
        path: req.path
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        success: false,
        error: err.message || 'Internal server error'
    });
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════╗
║   Avaia Survey Backend Server Running  ║
╠════════════════════════════════════════╣
║  Server:  http://localhost:${PORT}        ║
║  Health:  http://localhost:${PORT}/api/health  ║
║  Env:     ${process.env.NODE_ENV || 'development'}           ║
╚════════════════════════════════════════╝

Available Endpoints:
  POST   /api/survey/submit      - Submit survey response
  GET    /api/survey/stats       - Get response statistics
  GET    /api/survey/responses   - Get all responses (admin)
  DELETE /api/survey/responses/:id - Delete response (admin)
  POST   /api/survey/test        - Send test survey
  GET    /api/health             - Health check

Environment Variables:
  PORT              - Server port (default: 3001)
  NODE_ENV          - Environment (development/production)
  ADMIN_API_KEY     - API key for admin endpoints
  SLACK_WEBHOOK_URL - For Slack notifications (optional)
  SMTP_*            - Email configuration (optional)
    `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully...');
    process.exit(0);
});
