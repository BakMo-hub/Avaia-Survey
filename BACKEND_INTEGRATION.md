/**
 * Backend Integration Guide for Avaia Survey
 * 
 * This file demonstrates how to integrate the survey with various backend services
 * and databases for storing survey responses.
 */

// ============================================
// SECTION 1: Firebase Integration
// ============================================

/**
 * Firebase Setup:
 * 1. Create Firebase project: firebase.google.com
 * 2. Create Firestore database
 * 3. Install Firebase SDK:
 *    npm install firebase
 * 4. Add to index.html:
 *    <script src="https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js"></script>
 *    <script src="https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js"></script>
 */

// Uncomment and configure for Firebase:
/*
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function submitToFirebase(surveyData) {
    try {
        const docRef = await addDoc(collection(db, "surveys"), {
            ...surveyData,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent
        });
        console.log("Document written with ID: ", docRef.id);
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error("Error adding document: ", error);
        throw error;
    }
}
*/

// ============================================
// SECTION 2: Supabase Integration
// ============================================

/**
 * Supabase Setup:
 * 1. Create account: supabase.com
 * 2. Create project
 * 3. Create table "surveys" with columns:
 *    - id (UUID, primary key)
 *    - created_at (timestamp)
 *    - travel_frequency (text)
 *    - group_size (text)
 *    - ... (add more columns for each question)
 * 4. Install client:
 *    npm install @supabase/supabase-js
 */

// Uncomment and configure for Supabase:
/*
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'YOUR_SUPABASE_URL'
const supabaseKey = 'YOUR_SUPABASE_KEY'
const supabase = createClient(supabaseUrl, supabaseKey)

async function submitToSupabase(surveyData) {
    const { data, error } = await supabase
        .from('surveys')
        .insert([
            {
                travel_frequency: surveyData.travelFrequency,
                group_size: surveyData.groupSize,
                multi_currency: surveyData.multiCurrency,
                currency_difficulty: surveyData.currencyDifficulty,
                biggest_challenge: surveyData.biggestChallenge,
                disputes: surveyData.disputes,
                current_method: surveyData.currentMethod?.join(', '),
                current_satisfaction: surveyData.currentSatisfaction,
                desired_features: surveyData.desiredFeatures?.join(', '),
                pricing_model: surveyData.pricingModel,
                additional_comments: surveyData.additionalComments,
                email: surveyData.email,
                submitted_at: new Date().toISOString()
            }
        ])
        .select()

    if (error) throw error
    return { success: true, data }
}
*/

// ============================================
// SECTION 3: REST API Integration
// ============================================

/**
 * Generic REST API Integration
 * Works with any backend that accepts JSON POST requests
 */

async function submitToRESTAPI(surveyData) {
    const endpoint = process.env.API_ENDPOINT || 'https://api.avaia.app/survey/submit';
    
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': process.env.API_KEY || '',
                'X-Survey-Version': '1.0'
            },
            body: JSON.stringify({
                data: surveyData,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                locale: navigator.language
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return { success: true, ...result };
    } catch (error) {
        console.error('API submission error:', error);
        throw error;
    }
}

// ============================================
// SECTION 4: MongoDB Atlas Integration
// ============================================

/**
 * MongoDB Setup (via Node.js backend):
 * Backend handler example:
 */

/*
// backend/routes/survey.js
const express = require('express');
const { MongoClient } = require('mongodb');
const router = express.Router();

const mongoUrl = process.env.MONGODB_URI;
const client = new MongoClient(mongoUrl);

router.post('/submit', async (req, res) => {
    try {
        const database = client.db('avaia_surveys');
        const surveys = database.collection('responses');
        
        const result = await surveys.insertOne({
            ...req.body,
            submittedAt: new Date(),
            ipAddress: req.ip,
            userAgent: req.headers['user-agent']
        });
        
        res.json({ success: true, id: result.insertedId });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
*/

// ============================================
// SECTION 5: Google Sheets Integration
// ============================================

/**
 * Google Sheets via Google Apps Script
 * 
 * 1. Create Google Sheet
 * 2. Add columns for each survey question
 * 3. Go to Extensions > Apps Script
 * 4. Paste this code:
 */

/*
function doPost(e) {
    const sheet = SpreadsheetApp.getActiveSheet();
    const data = JSON.parse(e.postData.contents);
    
    sheet.appendRow([
        new Date(),
        data.travelFrequency,
        data.groupSize,
        data.multiCurrency,
        data.currencyDifficulty,
        data.biggestChallenge,
        data.disputes,
        Array.isArray(data.currentMethod) ? data.currentMethod.join('; ') : data.currentMethod,
        data.currentSatisfaction,
        Array.isArray(data.desiredFeatures) ? data.desiredFeatures.join('; ') : data.desiredFeatures,
        data.pricingModel,
        data.additionalComments,
        data.email
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({
        success: true
    })).setMimeType(ContentService.MimeType.JSON);
}
*/

// Uncomment in script.js and use:
/*
async function submitToGoogleSheets(surveyData) {
    const scriptUrl = 'YOUR_GOOGLE_APPS_SCRIPT_URL';
    
    try {
        const response = await fetch(scriptUrl, {
            method: 'POST',
            body: JSON.stringify(surveyData)
        });
        return await response.json();
    } catch (error) {
        console.error('Google Sheets submission error:', error);
        throw error;
    }
}
*/

// ============================================
// SECTION 6: Email Notification Integration
// ============================================

/**
 * After survey submission, send confirmation email
 * Using Mailgun, SendGrid, or similar service
 */

async function sendConfirmationEmail(email, surveyData) {
    const mailgunUrl = process.env.MAILGUN_URL;
    const mailgunKey = process.env.MAILGUN_API_KEY;
    
    try {
        const response = await fetch(mailgunUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${btoa('api:' + mailgunKey)}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                from: 'survey@avaia.app',
                to: email,
                subject: 'Thank you for taking the Avaia Survey!',
                html: `
                    <h2>Thank you for your feedback!</h2>
                    <p>We've received your survey response and greatly appreciate your insights.</p>
                    <p>We'll use your feedback to shape Avaia into the best group expense-splitting app.</p>
                    <p>Keep an eye on your inbox for early access updates!</p>
                    <br>
                    <p>Best regards,<br>The Avaia Team</p>
                `
            })
        });
        
        return await response.json();
    } catch (error) {
        console.error('Email sending error:', error);
        // Don't throw - email is non-critical
    }
}

// ============================================
// SECTION 7: Slack Notification Integration
// ============================================

/**
 * Notify Slack channel when survey is submitted
 */

async function notifySlack(surveyData) {
    const webhookUrl = process.env.SLACK_WEBHOOK_URL;
    
    if (!webhookUrl) return; // Skip if not configured
    
    try {
        await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text: 'New Survey Response',
                blocks: [
                    {
                        type: 'section',
                        text: {
                            type: 'mrkdwn',
                            text: '*New Avaia Survey Submission* 🎉'
                        }
                    },
                    {
                        type: 'section',
                        fields: [
                            {
                                type: 'mrkdwn',
                                text: `*Travel Frequency:*\n${surveyData.travelFrequency}`
                            },
                            {
                                type: 'mrkdwn',
                                text: `*Group Size:*\n${surveyData.groupSize}`
                            },
                            {
                                type: 'mrkdwn',
                                text: `*Currency Difficulty:*\n${surveyData.currencyDifficulty}/5`
                            },
                            {
                                type: 'mrkdwn',
                                text: `*Pricing Model:*\n${surveyData.pricingModel}`
                            }
                        ]
                    },
                    {
                        type: 'section',
                        text: {
                            type: 'mrkdwn',
                            text: `*Email:* ${surveyData.email || 'Not provided'}`
                        }
                    }
                ]
            })
        });
    } catch (error) {
        console.error('Slack notification error:', error);
    }
}

// ============================================
// SECTION 8: Data Processing & Validation
// ============================================

/**
 * Validate survey data before submission
 */

function validateSurveyData(data) {
    const errors = [];
    
    // Validate email if provided
    if (data.email && !isValidEmail(data.email)) {
        errors.push('Invalid email format');
    }
    
    // Validate scale responses
    ['currencyDifficulty', 'currentSatisfaction'].forEach(field => {
        if (data[field] && (data[field] < 1 || data[field] > 5)) {
            errors.push(`${field} must be between 1 and 5`);
        }
    });
    
    return {
        isValid: errors.length === 0,
        errors
    };
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ============================================
// SECTION 9: Analytics Integration
// ============================================

/**
 * Track survey completion and progress
 */

function trackSurveyAnalytics(event, data = {}) {
    // Google Analytics
    if (window.gtag) {
        window.gtag('event', event, {
            survey_id: 'avaia_public_interest',
            ...data
        });
    }
    
    // Plausible Analytics
    if (window.plausible) {
        window.plausible(event, { props: data });
    }
    
    // Segment
    if (window.analytics) {
        window.analytics.track(event, data);
    }
}

// Usage:
// trackSurveyAnalytics('survey_started');
// trackSurveyAnalytics('survey_section_completed', { section: 2 });
// trackSurveyAnalytics('survey_submitted', { email_provided: true });

// ============================================
// SECTION 10: Complete Integration Example
// ============================================

/**
 * Full submission workflow with all integrations
 */

async function completeSubmission(surveyData, options = {}) {
    try {
        // 1. Validate data
        const validation = validateSurveyData(surveyData);
        if (!validation.isValid) {
            throw new Error(`Validation error: ${validation.errors.join(', ')}`);
        }
        
        // 2. Analytics tracking
        trackSurveyAnalytics('survey_submission_started');
        
        // 3. Submit to primary backend
        let result;
        if (options.useFirebase) {
            result = await submitToFirebase(surveyData);
        } else if (options.useSupabase) {
            result = await submitToSupabase(surveyData);
        } else {
            result = await submitToRESTAPI(surveyData);
        }
        
        // 4. Send notification emails
        if (surveyData.email) {
            await sendConfirmationEmail(surveyData.email, surveyData);
        }
        
        // 5. Notify Slack
        await notifySlack(surveyData);
        
        // 6. Track success
        trackSurveyAnalytics('survey_submitted', {
            response_id: result.id || 'unknown'
        });
        
        // 7. Clear local storage
        localStorage.removeItem('avaiasurvey_state');
        
        return { success: true, ...result };
    } catch (error) {
        console.error('Submission error:', error);
        trackSurveyAnalytics('survey_submission_failed', {
            error: error.message
        });
        throw error;
    }
}

// ============================================
// EXPORT FOR USE IN script.js
// ============================================

// Uncomment to use in script.js:
/*
// Replace the sendSurveyData function in script.js with:
function sendSurveyData(data) {
    completeSubmission(data, {
        useRESTAPI: true
        // OR useFirebase: true
        // OR useSupabase: true
    })
    .then(() => showSuccessMessage())
    .catch(error => {
        console.error('Error:', error);
        showErrorMessage();
    });
}
*/

export {
    submitToRESTAPI,
    submitToFirebase,
    submitToSupabase,
    sendConfirmationEmail,
    notifySlack,
    validateSurveyData,
    completeSub mission,
    trackSurveyAnalytics
};
