import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const faqDatabasePath = path.join(__dirname, 'faq_database.json');
const faqDatabase = JSON.parse(fs.readFileSync(faqDatabasePath, 'utf8'));

// Predefined FAQ database lookup (Requirement 2 & 3)
function findFaqMatch(userMessage) {
  const msg = userMessage.toLowerCase().trim().replace(/[^\w\s]/g, "");
  if (!msg) return null;
  
  let bestMatch = null;
  let highestScore = 0;
  
  for (const entry of faqDatabase) {
    const cleanQ = entry.question.toLowerCase().replace(/[^\w\s]/g, "");
    
    // Direct string match or containment
    if (msg === cleanQ || msg.includes(cleanQ) || cleanQ.includes(msg)) {
      return { answer: entry.answer, question: entry.question };
    }
    
    // Keyword count density match
    let matchCount = 0;
    for (const kw of entry.keywords) {
      if (msg.includes(kw)) {
        matchCount++;
      }
    }
    
    if (matchCount > highestScore) {
      highestScore = matchCount;
      bestMatch = entry;
    }
  }
  
  return (bestMatch && highestScore > 0) ? { answer: bestMatch.answer, question: bestMatch.question } : null;
}

// Local mock database response handler
const mockChatResponse = (userMessage, assessmentContext) => {
  const msg = userMessage.toLowerCase();
  
  // AI Chatbot Greetings
  if (msg === 'hello' || msg === 'hi' || msg.includes('good morning') || msg.includes('assist me') || msg === 'help me' || msg.includes('what can you do')) {
    return `👋 **Hello!** Welcome to the Student Support Chatbot. How can I assist you with your online assessment today?`;
  }

  // Goodbye
  if (msg.includes('thank you') || msg === 'thanks' || msg === 'bye' || msg.includes('see you') || msg.includes('goodbye')) {
    return `✨ **You're welcome!** Best of luck with your assessment. Feel free to ask if you need any more help.`;
  }

  // Login Issues
  if (msg.includes("login") || msg.includes("sign in") || msg.includes("cannot log") || msg.includes("credentials") || msg.includes("locked") || msg.includes("incorrect") || msg.includes("password") || msg.includes("username") || msg.includes("mobile")) {
    return `Click 'Forgot Password' on the login page to reset your password. If your username/password is incorrect or failing, check for typos. If locked, your account auto-unlocks after 15 minutes. Note: Mobile logins are not supported; please use a desktop computer.`;
  }

  // Registration
  if (msg.includes("register") || msg.includes("create my account") || msg.includes("create account") || msg.includes("change my email") || msg.includes("update my profile")) {
    return `Click the "Register Here" link on the login page to create your student account. Fill in your email address and credentials, then submit.`;
  }

  // Exam Schedule
  if (msg.includes("schedule") || msg.includes("when is my exam") || msg.includes("exam start") || msg.includes("start early")) {
    return `You can view your exam schedule on your dashboard under the "Upcoming Exams" section.`;
  }

  // Exam Instructions
  if (msg.includes("instruction") || msg.includes("rule") || msg.includes("calculator") || msg.includes("switch tab") || msg.includes("minimize") || msg.includes("pause") || msg.includes("guidelines")) {
    return `For detailed exam rules, guidelines, browser requirements, and hardware setups, please navigate to our official [Explore FAQ Page](/faq). Key rules include: no external tabs, no copy-pasting, and active camera proctoring.`;
  }

  // Technical Issues
  if (msg.includes("frozen") || msg.includes("freez") || msg.includes("not loading") || msg.includes("slow") || msg.includes("blank screen") || msg.includes("timer stopped")) {
    return `Please check your internet connection, refresh the exam page, and resume. Your progress is cached locally so you will not lose answers. For browser freeze issues, you can also report a glitch to alert your proctor.`;
  }

  // Camera & Microphone
  if (msg.includes("camera") || msg.includes("webcam") || msg.includes("video") || msg.includes("blocked")) {
    return `Please allow camera permission in your browser settings and refresh the page. Ensure no other application is using your webcam.`;
  }

  if (msg.includes("mic") || msg.includes("microphone") || msg.includes("audio")) {
    return `Allow microphone permission in your browser settings and reconnect your microphone if necessary.`;
  }

  // Internet Issues
  if (msg.includes("network") || msg.includes("internet") || msg.includes("connection") || msg.includes("offline") || msg.includes("disconnected")) {
    return `Reconnect to the internet as soon as possible. Once connected, reopen the exam portal. Your saved answers will be restored automatically if supported.`;
  }

  // Browser Compatibility
  if (msg.includes("browser") || msg.includes("chrome") || msg.includes("firefox") || msg.includes("edge") || msg.includes("safari")) {
    return `We recommend using the latest version of Google Chrome or Microsoft Edge for the best experience.`;
  }

  // Assessment Questions
  if (msg.includes("review my answer") || msg.includes("change my answer") || msg.includes("questions are there") || msg.includes("negative marking") || msg.includes("skip question")) {
    return `Yes, you can modify your answers until you click the final Submit button. There is no negative marking.`;
  }

  // Submission & Retaking
  if (msg.includes("submit") || msg.includes("cannot finish") || msg.includes("finish test") || msg.includes("mistake") || msg.includes("retake")) {
    return `Click the "Submit Exam" button and confirm your submission. If you wish to retake a completed exam, navigate to your Portal Room (Dashboard) and click the blue "Retake Test" button next to the completed card.`;
  }

  // Results
  if (msg.includes("result") || msg.includes("score") || msg.includes("mark") || msg.includes("certificate") || msg.includes("announce")) {
    return `Results will be available on your dashboard after the evaluation process is completed.`;
  }

  // Support
  if (msg.includes("support") || msg.includes("contact") || msg.includes("complaint") || msg.includes("report a bug") || msg.includes("bug")) {
    return `Use the Contact Support page or email support@example.com for technical assistance.`;
  }

  // Refuse off-topic questions
  return `I am sorry, but I can only assist with portal logins, credentials, browser compatibility, camera setup, and exam submissions. For other questions, please contact support@example.com.`;
};

export async function generateChatReply(userMessage, chatHistory, assessmentContext) {
  // 1. Check FAQ Database First
  const faqMatch = findFaqMatch(userMessage);
  if (faqMatch) {
    console.log(`✅ [FAQ MATCH] Predefined answer returned: "${faqMatch.question}"`);
    return faqMatch.answer;
  }

  // 2. Fallback to Local Mock Database (Zero Gemini API requests)
  console.log(`💡 [FAQ MISSED] Resolving from local offline database: "${userMessage}"`);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockChatResponse(userMessage, assessmentContext));
    }, 600);
  });
}
