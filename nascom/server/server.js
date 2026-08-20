import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { generateChatReply } from './config/gemini.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Enable secure HTTP headers
app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      "img-src": ["'self'", "https:", "data:", "https://lh3.googleusercontent.com"],
      "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      "connect-src": ["'self'", "https:", "http:", "http://localhost:5000", "http://localhost:5173", "https://generativelanguage.googleapis.com"]
    }
  }
}));

// Enable Gzip compression
app.use(compression());

// Configure CORS origins for development & production hosting
app.use(cors({
  origin: (origin, callback) => callback(null, true),
  credentials: true
}));

// Rate limiting to prevent DDoS or Gemini API misuse
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 150, 
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests from this IP. Please try again after 15 minutes." }
});

app.use('/api/', apiLimiter);

app.use(express.json());

// Simulated database of assessments and questions
const assessments = [
  {
    id: 'portal-quiz-202',
    title: 'SACAS Portal Rules & Specifications',
    description: 'A 10-question multiple-choice quiz designed to test your knowledge of browser compatibility, proctor parameters, security rates, and student support features.',
    durationMinutes: 10,
    questionsCount: 10,
    points: 100,
    rules: [
      'Each question is worth 10 points.',
      'No external browser tabs may be opened.',
      'AI Assistant is available for conceptual guidance.'
    ],
    questions: [
      {
        id: 'pq-q1',
        title: 'Browser Compatibility',
        text: 'Which of the following web browsers is NOT officially supported for active assessments on the SACAS EXAM PORTAL?',
        type: 'choice',
        options: [
          'Google Chrome (v90+)',
          'Microsoft Edge (v90+)',
          'Opera Mini (Mobile/Lightweight)',
          'Mozilla Firefox (v88+)'
        ],
        points: 10
      },
      {
        id: 'pq-q2',
        title: 'Webcam Permissions',
        text: "If a student's webcam feed fails to load, what is the first recommended step to resolve permissions?",
        type: 'choice',
        options: [
          'Restart the entire computer system.',
          'Click the Lock Icon (🔒) in the browser\'s address URL bar and change Camera to \'Allow\'.',
          'Contact technical support immediately to schedule a manual review.',
          'Disable all security shields and firewalls.'
        ],
        points: 10
      },
      {
        id: 'pq-q3',
        title: 'Tab Focus Violations',
        text: 'What happens on the proctor\'s console when a student navigates to an external browser tab during an active test?',
        type: 'choice',
        options: [
          'The exam is immediately terminated and marked as failed.',
          'A focus loss warning event is automatically logged to the Proctor Telemetry stream.',
          'The client computer triggers a loud siren.',
          'The student is logged out of their account.'
        ],
        points: 10
      },
      {
        id: 'pq-q4',
        title: 'AI Sandbox Guidelines',
        text: 'Under what boundary conditions does the Gemini AI Support Assistant operate in the chat interface?',
        type: 'choice',
        options: [
          'It writes functional code solutions for any question.',
          'It can supply direct answers to multiple-choice questions if the student is struggling.',
          'It only explains general concept definitions and troubleshooting tips, blocking direct solution code.',
          'It is allowed to search the internet for answers.'
        ],
        points: 10
      },
      {
        id: 'pq-q5',
        title: 'Submission Glitches',
        text: 'If a student experiences a submission error or the \'Finish Test\' button freezes, what should they do?',
        type: 'choice',
        options: [
          'Close the browser tab and log in tomorrow.',
          'Clear the browser cache to start the exam from the beginning.',
          'Click the "Report Glitch" button to notify the proctor, refresh the page, and try submitting again.',
          'Re-type all code from scratch in a different text file.'
        ],
        points: 10
      },
      {
        id: 'pq-q6',
        title: 'Auth Providers',
        text: 'Which authentication providers are supported out-of-the-box by the SACAS Auth Context?',
        type: 'choice',
        options: [
          'Github and LinkedIn SSO',
          'Email/Password + Google Account SSO',
          'Mobile OTP Verification only',
          'Microsoft Azure Active Directory'
        ],
        points: 10
      },
      {
        id: 'pq-q7',
        title: 'Dev Server Ports',
        text: 'In the development environment, on which port does the client (Vite) and backend (Express) run, respectively?',
        type: 'choice',
        options: [
          'Client: Port 5000 | Server: Port 5173',
          'Client: Port 3000 | Server: Port 5000',
          'Client: Port 5173 | Server: Port 5000',
          'Client: Port 8080 | Server: Port 3000'
        ],
        points: 10
      },
      {
        id: 'pq-q8',
        title: 'Security Rate Limiting',
        text: 'What is the rate limit constraint configured on the `/api/` endpoints to protect the system from DDoS or API key misuse?',
        type: 'choice',
        options: [
          '10 requests per hour',
          '150 requests per 15 minutes',
          '1000 requests per minute',
          'Unlimited requests'
        ],
        points: 10
      },
      {
        id: 'pq-q9',
        title: 'Performance Optimization',
        text: 'How is initial page load performance optimized inside the React client router?',
        type: 'choice',
        options: [
          'By compressing images into WebP formats.',
          'Using React Lazy and Suspense code-splitting, which loads page modules only when navigated.',
          'By running client rendering inside a web worker thread.',
          'Disabling routing transitions entirely.'
        ],
        points: 10
      },
      {
        id: 'pq-q10',
        title: 'Docker Start Command',
        text: 'In the provided production Docker container setup, what is the unified server command defined to start the portal?',
        type: 'choice',
        options: [
          'vite preview',
          'npm run dev',
          'node server.js (running inside the /app/server working directory)',
          'docker run'
        ],
        points: 10
      }
    ]
  }
];

// Active incident telemetry database in-memory
const incidentsLog = [];
const chatLogs = [];
const tickets = [];

// API Route: Get all assessments
app.get('/api/assessments', (req, res) => {
  res.json(assessments);
});

// API Route: Get chatbot histories (Admin)
app.get('/api/chats', (req, res) => {
  res.json(chatLogs);
});

// API Route: Chat proxying to Gemini
app.post('/api/chat', async (req, res) => {
  const { message, history, assessmentContext, studentEmail } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required." });
  }

  try {
    const reply = await generateChatReply(message, history || [], assessmentContext || {});
    
    // Save to chatLogs for Admin review
    chatLogs.push({
      id: 'chat-' + Math.random().toString(36).substr(2, 9),
      studentEmail: studentEmail || 'student@test.com',
      assessmentId: assessmentContext?.title || 'General Sandbox',
      message: message,
      reply: reply,
      timestamp: new Date().toISOString()
    });

    res.json({ reply });
  } catch (error) {
    console.error("Chat routing error:", error);
    res.status(500).json({ error: "Failed to generate AI response." });
  }
});

// API Route: Get all reported incidents (Admin)
app.get('/api/incidents', (req, res) => {
  res.json(incidentsLog);
});

// API Route: Update incident status (Admin resolved toggle)
app.patch('/api/incidents/:id', (req, res) => {
  const { id } = req.params;
  const { resolved } = req.body;

  const incident = incidentsLog.find(inc => inc.id === id);
  if (!incident) {
    return res.status(404).json({ error: "Incident not found" });
  }

  if (resolved !== undefined) {
    incident.resolved = resolved;
  }

  console.log(`\n✅ [INCIDENT STATUS UPDATED] ID: ${id} | Resolved: ${incident.resolved}\n`);
  res.json(incident);
});

// API Route: Report/Log telemetry incidents
app.post('/api/incidents', (req, res) => {
  const { assessmentId, category, description, timestamp } = req.body;

  if (!assessmentId || !category || !description) {
    return res.status(400).json({ error: "Missing incident report parameters." });
  }

  const newIncident = {
    id: 'inc-' + Math.random().toString(36).substr(2, 9),
    assessmentId,
    category,
    description,
    resolved: false,
    timestamp: timestamp || new Date().toISOString()
  };

  incidentsLog.push(newIncident);

  // Print incident telemetry to terminal with custom formatting to alert developers
  console.log("\n⚠️ [INCIDENT TELEMETRY REPORTED]");
  console.log(`- ID:          ${newIncident.id}`);
  console.log(`- Assessment:  ${newIncident.assessmentId}`);
  console.log(`- Category:    ${newIncident.category.toUpperCase()}`);
  console.log(`- Description: "${newIncident.description}"`);
  console.log(`- Resolved:    ${newIncident.resolved}`);
  console.log(`- Timestamp:   ${newIncident.timestamp}`);
  console.log("---------------------------------\n");

  res.status(201).json({ 
    status: 'success', 
    message: 'Incident logged successfully', 
    incidentId: newIncident.id 
  });
});

// API Route: Get all support tickets (Admin)
app.get('/api/tickets', (req, res) => {
  res.json(tickets);
});

// API Route: Create a new support ticket
app.post('/api/tickets', (req, res) => {
  const { studentEmail, subject, description } = req.body;
  if (!subject || !description) {
    return res.status(400).json({ error: "Subject and Description are required." });
  }

  const newTicket = {
    id: 'tkt-' + Math.random().toString(36).substr(2, 9),
    studentEmail: studentEmail || 'guest@test.com',
    subject,
    description,
    status: 'Open',
    timestamp: new Date().toISOString()
  };

  tickets.push(newTicket);
  console.log(`\n🎟️ [TICKET CREATED] ID: ${newTicket.id} | Email: ${newTicket.studentEmail} | Subject: "${newTicket.subject}"\n`);
  res.status(201).json(newTicket);
});

// API Route: Update a ticket's status (Admin resolve)
app.patch('/api/tickets/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const ticket = tickets.find(t => t.id === id);
  if (!ticket) {
    return res.status(404).json({ error: "Ticket not found." });
  }

  if (status) {
    ticket.status = status;
  }

  console.log(`\n✅ [TICKET UPDATED] ID: ${id} | Status: ${ticket.status}\n`);
  res.json(ticket);
});

// Serve static client build folder in production or if client dist exists
const clientDistPath = path.join(__dirname, '../client/dist');
if (process.env.NODE_ENV === 'production' || fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  
  // Catch-all route to serve index.html for React Router SPA routes
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
} else {
  // Root ping test endpoint for development
  app.get('/', (req, res) => {
    res.send('SACAS EXAM PORTAL Secure server is online.');
  });
}

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`=========================================`);
  console.log(`SACAS EXAM PORTAL Express server started on port ${PORT}`);
  console.log(`Serving API routes:`);
  console.log(`- GET  /api/assessments`);
  console.log(`- POST /api/chat`);
  console.log(`- POST /api/incidents`);
  console.log(`=========================================`);
});
