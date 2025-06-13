import React, { createContext, useContext, useState, useCallback } from 'react';
import { ChatMessage, ChatSession, ChatbotState, ChatbotStep } from '../types/chat';

interface ChatContextType {
  currentSession: ChatSession | null;
  chatbotState: ChatbotState;
  sendMessage: (content: string) => Promise<void>;
  startNewSession: (userId: string, userType: 'student' | 'company') => void;
  getNextStep: () => ChatbotStep | null;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const STUDENT_STEPS: ChatbotStep[] = [
  {
    id: 1,
    question: "想尋找的產業類型及職缺是?",
    type: "multiple-choice",
    options: ["科技", "金融", "行銷", "設計", "教育", "其他"],
    required: true,
    nextStep: 2
  },
  {
    id: 2,
    question: "有無社團經驗或其他豐富的在校經驗?",
    type: "text",
    required: false,
    nextStep: (context) => context.hasPortfolio ? 3 : 4
  },
  {
    id: 3,
    question: "請分享您的求職動機和期望發展",
    type: "text",
    required: true,
    nextStep: 5
  },
  {
    id: 4,
    question: "請分享您的求職動機和期望發展",
    type: "text",
    required: true,
    nextStep: 5
  },
  {
    id: 5,
    question: "開始搜尋適配職缺",
    type: "text",
    required: false,
    nextStep: -1
  }
];

const COMPANY_STEPS: ChatbotStep[] = [
  {
    id: 1,
    question: "請問目前公司的人才需求是?",
    type: "multiple-choice",
    options: ["行銷", "設計", "資管", "工程", "其他"],
    required: true,
    nextStep: 2
  },
  {
    id: 2,
    question: "請問工作內容有哪些?",
    type: "text",
    required: true,
    nextStep: 3
  },
  {
    id: 3,
    question: "其中需具備哪些軟實力?",
    type: "multiple-choice",
    options: ["創意", "抗壓性", "溝通能力", "領導力", "團隊合作"],
    required: true,
    nextStep: 4
  },
  {
    id: 4,
    question: "是否需要預先面試?若有需要請直接提供題目1~2題",
    type: "text",
    required: false,
    nextStep: 5
  },
  {
    id: 5,
    question: "重複確認一次您的需求...",
    type: "text",
    required: false,
    nextStep: -1
  }
];

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [chatbotState, setChatbotState] = useState<ChatbotState>({
    currentStep: 1,
    context: {}
  });

  const startNewSession = useCallback((userId: string, userType: 'student' | 'company') => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      userId,
      userType,
      messages: [],
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setCurrentSession(newSession);
    setChatbotState({
      currentStep: 1,
      context: {}
    });
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!currentSession) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      role: currentSession.userType,
      content,
      timestamp: new Date()
    };

    setCurrentSession(prev => {
      if (!prev) return null;
      return {
        ...prev,
        messages: [...prev.messages, newMessage],
        updatedAt: new Date()
      };
    });

    // Update chatbot state based on the message
    const steps = currentSession.userType === 'student' ? STUDENT_STEPS : COMPANY_STEPS;
    const currentStepObj = steps.find(step => step.id === chatbotState.currentStep);
    
    if (currentStepObj) {
      const nextStep = typeof currentStepObj.nextStep === 'function' 
        ? currentStepObj.nextStep(chatbotState.context)
        : currentStepObj.nextStep;

      setChatbotState(prev => ({
        ...prev,
        currentStep: nextStep,
        context: {
          ...prev.context,
          [currentStepObj.id]: content
        }
      }));
    }
  }, [currentSession, chatbotState]);

  const getNextStep = useCallback(() => {
    if (!currentSession) return null;
    const steps = currentSession.userType === 'student' ? STUDENT_STEPS : COMPANY_STEPS;
    return steps.find(step => step.id === chatbotState.currentStep) || null;
  }, [currentSession, chatbotState.currentStep]);

  return (
    <ChatContext.Provider value={{
      currentSession,
      chatbotState,
      sendMessage,
      startNewSession,
      getNextStep
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}; 