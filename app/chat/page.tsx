'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Send, 
  Bot, 
  User, 
  Loader2, 
  CheckCircle,
  ArrowLeft,
  MessageCircle,
  AlertTriangle
} from 'lucide-react';
import Link from 'next/link';

type Message = {
  id: string;
  type: 'user' | 'bot' | 'error';
  content: string;
  timestamp: Date;
};

type UserData = {
  name?: string;
  age?: number;
  weight?: number;
  height?: number;
  injuries?: string;
  fitness_level?: string;
  fitness_goal?: string;
  workout_days?: number;
  dietary_restrictions?: string;
  phone_number?: string;
};

type Question = {
  key: string;
  question: string;
  type: string;
  validation?: (value: string) => string | null;
  options?: string[];
  placeholder?: string;
};

const questions: Question[] = [
  { 
    key: 'name', 
    question: "Hi! I'm your personal  fitness coach. What's your first name?", 
    type: 'text',
    placeholder: "Enter your first name"
  },
  { 
    key: 'age', 
    question: "Nice to meet you! What's your age?", 
    type: 'number',
    placeholder: "e.g. 25",
    validation: (value: string) => {
      const num = parseInt(value);
      return num >= 13 && num <= 100 ? null : "Please enter a valid age between 13 and 100";
    }
  },
  { 
    key: 'weight', 
    question: "What's your current weight in kg?", 
    type: 'number',
    placeholder: "e.g. 70",
    validation: (value: string) => {
      const num = parseFloat(value);
      return num >= 30 && num <= 300 ? null : "Please enter a valid weight between 30-300 kg";
    }
  },
  { 
    key: 'height', 
    question: "What's your height in cm?", 
    type: 'number',
    placeholder: "e.g. 175",
    validation: (value: string) => {
      const num = parseInt(value);
      return num >= 120 && num <= 250 ? null : "Please enter a valid height between 120-250 cm";
    }
  },
  { 
    key: 'injuries', 
    question: "Do you have any injuries or medical conditions I should know about? (Type 'none' if you don't have any)", 
    type: 'text',
    placeholder: "e.g. none, diabetes, asthma"
  },
  { 
    key: 'fitness_level', 
    question: "What's your current fitness level?", 
    type: 'select',
    options: ['Beginner', 'Intermediate', 'Advanced']
  },
  { 
    key: 'fitness_goal', 
    question: "What's your primary fitness goal?", 
    type: 'select',
    options: ['Weight Loss', 'Muscle Gain', 'Maintenance', 'Strength']
  },
  { 
    key: 'workout_days', 
    question: "How many days per week can you commit to working out?", 
    type: 'select',
    options: ['1', '2', '3', '4', '5', '6', '7']
  },
  { 
    key: 'dietary_restrictions', 
    question: "Do you have any dietary restrictions or allergies? (Type 'none' if you don't have any)", 
    type: 'text',
    placeholder: "e.g. none, vegetarian, gluten-free"
  },
  { 
    key: 'phone_number', 
    question: "Perfect! What's your WhatsApp number? I'll send your personalized diet plan there! (Include country code, e.g., +91 9876543210)", 
    type: 'text',
    placeholder: "+91 9876543210",
    validation: (value: string) => {
      const phoneRegex = /^\+[1-9]\d{1,14}$/;
      return phoneRegex.test(value.replace(/\s/g, '')) ? null : "Please enter a valid WhatsApp number with country code";
    }
  }
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: "Hi! I'm your personal fitness coach. What's your first name?",
      timestamp: new Date()
    }
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userData, setUserData] = useState<UserData>({});
  const [isTyping, setIsTyping] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [currentQuestionIndex]);

  const addMessage = (type: 'user' | 'bot' | 'error', content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const simulateTyping = async (message: string, messageType: 'bot' | 'error' = 'bot') => {
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
    setIsTyping(false);
    addMessage(messageType, message);
  };

  const handleSendMessage = async () => {
    if (!currentInput.trim()) return;

    const currentQuestion = questions[currentQuestionIndex];
    setError(null);

    // Validate input
    if (currentQuestion.validation) {
      const validationError = currentQuestion.validation(currentInput);
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    // Add user message
    addMessage('user', currentInput);

    // Update user data
    const newUserData = { ...userData };
    if (currentQuestion.type === 'number') {
      newUserData[currentQuestion.key as keyof UserData] = parseFloat(currentInput) as any;
    } else {
      newUserData[currentQuestion.key as keyof UserData] = currentInput as any;
    }
    setUserData(newUserData);

    setCurrentInput('');

    // Check if we have more questions
    if (currentQuestionIndex < questions.length - 1) {
      const nextQuestion = questions[currentQuestionIndex + 1];
      await simulateTyping(nextQuestion.question);
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // All questions completed, generate diet plan
      await generateDietPlan(newUserData);
    }
  };

  const generateDietPlan = async (userData: UserData) => {
    setIsGenerating(true);
    await simulateTyping("Amazing! I have all the information I need. Let me create your personalized diet plan...");

    try {
      const response = await fetch('/api/generate-diet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to generate diet plan');
      }
      
      await simulateTyping("Perfect! Your personalized diet plan has been created and sent to your WhatsApp number. You should receive it within the next few minutes!");
      await simulateTyping("🎉 Your journey to better health starts now! Our team will also reach out to you soon with exclusive gym offers and additional support.");
      
      setIsCompleted(true);
    } catch (error) {
      console.error('Error generating diet plan:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      if (errorMessage.includes('OpenAI API key')) {
        await simulateTyping(
          "⚠️ Configuration Error: The OpenAI API key is not properly configured. Please contact the administrator to set up the API key in the .env.local file.\n\nTo fix this:\n1. Get an API key from https://platform.openai.com/api-keys\n2. Add it to the .env.local file\n3. Restart the server",
          'error'
        );
      } else {
        await simulateTyping("I apologize, but there was an error generating your diet plan. Please try again or contact our support team.", 'error');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectOption = async (option: string) => {
    setCurrentInput(option);
    await handleSendMessage();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const progress = Math.round(((currentQuestionIndex + 1) / questions.length) * 100);
  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex flex-col">
      {/* Header */}
      <header className="p-4 border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          
          <div className="flex items-center space-x-3">
            <MessageCircle className="h-6 w-6 text-blue-400" />
            <span className="text-white font-semibold">AI Fitness Coach</span>
          </div>

          <div className="w-16"></div>
        </div>
      </header>

      {/* Progress Bar */}
      {!isCompleted && (
        <div className="p-4 bg-slate-900/30">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-300">Progress</span>
              <span className="text-sm text-slate-300">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-3 max-w-2xl ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.type === 'user' 
                      ? 'bg-blue-600' 
                      : message.type === 'error'
                      ? 'bg-red-500'
                      : 'bg-gradient-to-r from-green-500 to-blue-500'
                  }`}>
                    {message.type === 'user' ? (
                      <User className="h-4 w-4 text-white" />
                    ) : message.type === 'error' ? (
                      <AlertTriangle className="h-4 w-4 text-white" />
                    ) : (
                      <Bot className="h-4 w-4 text-white" />
                    )}
                  </div>
                  
                  <Card className={`p-4 ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : message.type === 'error'
                      ? 'bg-red-500/20 text-red-100 border-red-500/30'
                      : 'bg-slate-800 text-slate-100 border-slate-700'
                  }`}>
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    <span className="text-xs opacity-70 mt-2 block">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </Card>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="flex items-start space-x-3 max-w-2xl">
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-r from-green-500 to-blue-500">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <Card className="p-4 bg-slate-800 text-slate-100 border-slate-700">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Working on it...</span>
                  </div>
                </Card>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      {!isCompleted && !isGenerating && (
        <div className="p-4 border-t border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto">
            {error && (
              <div className="mb-3 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            {currentQuestion?.type === 'select' ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {currentQuestion.options?.map((option) => (
                  <Button
                    key={option}
                    onClick={() => handleSelectOption(option)}
                    variant="outline"
                    className="border-slate-600 bg-slate-700 text-slate-100 hover:bg-slate-900 hover:text-white"
                  >
                    {option}
                  </Button>
                ))}
              </div>
            ) : (
              <div className="flex space-x-2">
                <Input
                  ref={inputRef}
                  type={currentQuestion?.type === 'number' ? 'number' : 'text'}
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 bg-slate-800 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500"
                  placeholder={currentQuestion?.placeholder}
                  disabled={isGenerating}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={isGenerating || !currentInput.trim()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Completion Status */}
      {isCompleted && (
        <div className="p-4 bg-green-500/20 border-t border-green-500/30">
          <div className="max-w-4xl mx-auto flex items-center justify-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-400" />
            <span className="text-green-300 font-medium">Diet plan sent to your WhatsApp!</span>
          </div>
        </div>
      )}
    </div>
  );
}