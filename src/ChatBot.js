import React, { useState, useRef, useEffect } from 'react';
import './ChatBot.css';

const ChatBot = ({ level, doctor = null }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: `Hello! I'm your Gaming Addiction Assistant. How can I help you learn more about ${level || 'gaming addiction'}?`, sender: 'bot' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Knowledge base for different addiction levels
  const knowledgeBase = {
    "Low Addiction": {
      info: "Low gaming addiction refers to a healthy relationship with gaming. At this level, gaming is a hobby that doesn't interfere with daily responsibilities, social interactions, or physical health.",
      symptoms: "No significant symptoms. You likely play games occasionally for enjoyment while maintaining a balanced lifestyle.",
      tips: "Continue maintaining balance. Set reasonable time limits, take breaks, and keep gaming as just one of many activities you enjoy.",
      risks: "Even at low levels, be mindful not to gradually increase gaming time, especially during stressful periods.",
      activities: "Exercise, reading, social gatherings, hobbies like cooking or gardening, and outdoor activities can help maintain your healthy balance."
    },
    "Moderate Addiction": {
      info: "Moderate gaming addiction suggests gaming is becoming a significant part of your life. While not severely impacting responsibilities, you may be spending more time gaming than intended.",
      symptoms: "Occasionally losing track of time while gaming, mild irritability when unable to play, thinking about games when doing other activities.",
      tips: "Set strict time limits using timers. Schedule gaming sessions after completing important tasks. Have at least 2-3 game-free days per week.",
      risks: "Without boundaries, moderate addiction can progress to more severe levels, potentially affecting work/school performance and relationships.",
      activities: "Try new hobbies that provide similar satisfaction as gaming, like sports, puzzle-solving, creative arts, or joining clubs related to your interests."
    },
    "High Addiction": {
      info: "High gaming addiction indicates gaming has become a dominant activity in your life, affecting your daily functioning, relationships, and possibly health.",
      symptoms: "Persistent thoughts about gaming, defensiveness about gaming habits, neglecting responsibilities, declining social invitations to play games, and disrupted sleep patterns.",
      tips: "Consider a gaming detox for 2-4 weeks. Delete games from easily accessible devices. Ask friends or family to help monitor your gaming time. Create a strict schedule.",
      risks: "High addiction levels can lead to academic or professional failure, relationship breakdown, physical health issues from sedentary behavior, and mental health challenges.",
      activities: "Physical exercise is crucial - try team sports, hiking, or cycling. Reconnect with friends in person. Consider mindfulness practices like meditation or yoga."
    },
    "Severe Addiction": {
      info: "Severe gaming addiction is a serious condition where gaming has taken control of your life, significantly harming your well-being, relationships, and daily functioning.",
      symptoms: "Extreme irritability or anxiety when unable to play, complete neglect of personal hygiene and basic needs, social isolation, failed attempts to cut back, gaming despite negative consequences.",
      tips: "Professional intervention is strongly recommended. This may include therapy, support groups, or in severe cases, rehabilitation programs.",
      risks: "Severe addiction can lead to complete social isolation, job loss, academic failure, depression, anxiety disorders, and physical health problems.",
      activities: "Focus on rebuilding basic routines first: regular sleep schedule, healthy meals, and physical activity. Small, achievable goals are important."
    },
    "Unknown": {
      info: "Gaming addiction refers to excessive and compulsive use of video games that leads to significant impairment in personal, family, social, educational, or occupational functioning.",
      symptoms: "Common symptoms include preoccupation with gaming, withdrawal symptoms when unable to play, inability to reduce playing time, loss of interest in other activities, and continued gaming despite negative consequences.",
      tips: "Track your gaming time, set reasonable limits, create a schedule that includes other activities, and consider using apps that limit screen time.",
      risks: "Excessive gaming can lead to social isolation, depression, anxiety, sleep disruption, and physical health issues including eye strain, carpal tunnel syndrome, and poor posture.",
      activities: "Consider alternative activities like sports, reading, learning a new skill, volunteering, or spending time in nature."
    },
    "generalDoctor": {
      info: "Seeking professional help for gaming addiction typically involves consulting with mental health professionals like psychologists, psychiatrists, or addiction counselors who specialize in behavioral addictions.",
      finding: "To find a specialist, check with your primary care physician for referrals, contact your insurance provider for in-network options, or search for addiction specialists through professional directories online.",
      approach: "Treatment typically involves cognitive-behavioral therapy (CBT), motivational interviewing, family therapy, and sometimes group therapy or support groups.",
      insurance: "Many insurance plans cover mental health services including addiction treatment. Contact your provider directly to verify coverage for behavioral addiction services.",
      telehealth: "Many mental health professionals offer virtual appointments, making it easier to access care regardless of your location."
    }
  };

  // Generate bot response based on user input
  const generateResponse = (userMessage) => {
    const lowerCaseMessage = userMessage.toLowerCase();
    
    // Check for doctor-related questions
    if (lowerCaseMessage.includes('doctor') || lowerCaseMessage.includes('specialist') || lowerCaseMessage.includes('therapist')) {
      if (doctor) {
        if (lowerCaseMessage.includes('experience') || lowerCaseMessage.includes('background')) {
          return `${doctor.name} has extensive experience treating gaming and technology addiction across various age groups.`;
        } else if (lowerCaseMessage.includes('approach') || lowerCaseMessage.includes('method') || lowerCaseMessage.includes('treatment')) {
          return `${doctor.name} typically uses a combination of cognitive-behavioral therapy, motivational interviewing, and family therapy when appropriate.`;
        } else if (lowerCaseMessage.includes('session') || lowerCaseMessage.includes('appointment') || lowerCaseMessage.includes('visit')) {
          return `Initial consultations with ${doctor.name} usually last 60-90 minutes, with follow-up sessions of 45-60 minutes. Treatment length varies based on addiction severity.`;
        } else if (lowerCaseMessage.includes('insurance') || lowerCaseMessage.includes('cover') || lowerCaseMessage.includes('payment')) {
          return `Many insurance plans cover addiction treatment with specialists like ${doctor.name}. Contact your provider to verify coverage for behavioral addiction services.`;
        } else if (lowerCaseMessage.includes('online') || lowerCaseMessage.includes('virtual') || lowerCaseMessage.includes('telehealth')) {
          return `Yes, ${doctor.name} offers virtual appointments for those who cannot attend in-person sessions.`;
        } else if (lowerCaseMessage.includes('contact')) {
          return `You can contact ${doctor.name} at ${doctor.phone} or via email at ${doctor.email}.`;
        } else {
          return `${doctor.name} specializes in gaming addiction treatment and can provide personalized care for your situation. Would you like specific information about their approach, session format, or insurance coverage?`;
        }
      } else {
        // General doctor information when no specific doctor is provided
        if (lowerCaseMessage.includes('find') || lowerCaseMessage.includes('where')) {
          return knowledgeBase.generalDoctor.finding;
        } else if (lowerCaseMessage.includes('approach') || lowerCaseMessage.includes('method') || lowerCaseMessage.includes('treatment')) {
          return knowledgeBase.generalDoctor.approach;
        } else if (lowerCaseMessage.includes('insurance') || lowerCaseMessage.includes('cover') || lowerCaseMessage.includes('payment')) {
          return knowledgeBase.generalDoctor.insurance;
        } else if (lowerCaseMessage.includes('online') || lowerCaseMessage.includes('virtual') || lowerCaseMessage.includes('telehealth')) {
          return knowledgeBase.generalDoctor.telehealth;
        } else {
          return knowledgeBase.generalDoctor.info;
        }
      }
    }
    
    // Use the appropriate knowledge base based on level
    const relevantKnowledge = knowledgeBase[level] || knowledgeBase.Unknown;
    
    // Check for addiction level information
    if (lowerCaseMessage.includes('what is') || lowerCaseMessage.includes('explain') || lowerCaseMessage.includes('tell me about')) {
      return relevantKnowledge.info;
    } else if (lowerCaseMessage.includes('symptom') || lowerCaseMessage.includes('sign')) {
      return relevantKnowledge.symptoms;
    } else if (lowerCaseMessage.includes('tip') || lowerCaseMessage.includes('help') || lowerCaseMessage.includes('advice') || lowerCaseMessage.includes('manage')) {
      return relevantKnowledge.tips;
    } else if (lowerCaseMessage.includes('risk') || lowerCaseMessage.includes('danger') || lowerCaseMessage.includes('problem')) {
      return relevantKnowledge.risks;
    } else if (lowerCaseMessage.includes('alternative') || lowerCaseMessage.includes('activity') || lowerCaseMessage.includes('instead') || lowerCaseMessage.includes('hobby') || lowerCaseMessage.includes('hobbies')) {
      return relevantKnowledge.activities;
    } else if (lowerCaseMessage.includes('hello') || lowerCaseMessage.includes('hi')||lowerCaseMessage.includes('hey')) {
      return `Hello! I'm here to help with information about ${level || 'gaming addiction'}. Feel free to ask about symptoms, management tips, risks, or alternative activities.`;
    } else {
      return `I'm not sure I understand. You can ask about ${level || 'gaming addiction'}, symptoms, management tips, risks, alternative activities, or information about finding professional help.`;
    }
  };

  // Handle sending messages
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;
    
    // Add user message
    const newMessages = [...messages, { text: inputValue, sender: 'user' }];
    setMessages(newMessages);
    setInputValue('');
    
    // Show typing indicator
    setIsTyping(true);
    
    // Add bot response after a short delay
    setTimeout(() => {
      setIsTyping(false);
      const botResponse = generateResponse(inputValue);
      setMessages(current => [...current, { text: botResponse, sender: 'bot' }]);
    }, 1200);
  };

  // Auto-scroll to bottom of chat when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Close chatbot when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const chatbotDialog = document.querySelector('.chatbot-dialog');
      const chatbotButton = document.querySelector('.chatbot-button');
      
      if (isOpen && 
          chatbotDialog && 
          chatbotButton && 
          !chatbotDialog.contains(event.target) && 
          !chatbotButton.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="chatbot-container">
      {/* Chatbot button */}
      <button 
        className={`chatbot-button ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        <i className={`bi ${isOpen ? 'bi-x-lg' : 'bi-chat-dots-fill'}`}></i>
      </button>

      {/* Chatbot dialog */}
      <div className={`chatbot-dialog ${isOpen ? 'open' : ''}`}>
        <div className="chatbot-header">
          <h3>Gaming Addiction Assistant</h3>
        </div>
        <div className="chatbot-messages">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.sender}`}>
              {message.text}
            </div>
          ))}
          {isTyping && (
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <form className="chatbot-input" onSubmit={handleSendMessage}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask about gaming addiction..."
            aria-label="Type your message"
          />
          <button type="submit" aria-label="Send message">
            <i className="bi bi-send-fill"></i>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatBot;