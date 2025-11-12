import React, { useState, useEffect, useRef } from 'react';
import { getChatbotResponse } from '../services/geminiService';
import { ChatMessage } from '../types';
import { CuteAIIcon, SendIcon, XCircleIcon } from './Icons';

interface ChatbotProps {
  onClose: () => void;
}

const TypingIndicator: React.FC = () => (
  <div className="flex items-center space-x-1 p-2">
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:0.2s]"></div>
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:0.4s]"></div>
  </div>
);


export const Chatbot: React.FC<ChatbotProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([
      {
        id: Date.now(),
        sender: 'ai',
        text: "Hi! I'm Luci, your AI assistant. I can help you understand how this app works or answer questions about product authenticity. How can I help you today?",
      },
    ]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = inputValue.trim();
    if (!trimmedInput) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      sender: 'user',
      text: trimmedInput,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const aiResponse = await getChatbotResponse(trimmedInput);
      const aiMessage: ChatMessage = {
        id: Date.now() + 1,
        sender: 'ai',
        text: aiResponse,
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chatbot error:', error);
      const errorMessage: ChatMessage = {
        id: Date.now() + 1,
        sender: 'ai',
        text: 'Sorry, I seem to be having some trouble connecting. Please try again in a moment.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-24 right-4 sm:bottom-28 sm:right-8 w-[calc(100%-2rem)] max-w-sm h-[70vh] max-h-[500px] flex flex-col bg-gray-900/70 backdrop-blur-lg border border-gray-700 rounded-2xl shadow-2xl animate-slide-up z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700 flex-shrink-0">
        <div className="flex items-center">
          <CuteAIIcon className="w-10 h-10 text-brand-accent" />
          <div className="ml-3">
            <h3 className="font-bold text-white">Luci</h3>
            <p className="text-xs text-green-400 flex items-center"><span className="w-2 h-2 bg-green-400 rounded-full mr-1.5"></span>Online</p>
          </div>
        </div>
        <button onClick={onClose} className="p-1 text-gray-400 hover:text-white transition-colors">
          <XCircleIcon className="w-6 h-6" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-grow p-4 overflow-y-auto">
        <div className="flex flex-col space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-end gap-2 ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'ai' && <CuteAIIcon className="w-6 h-6 text-brand-accent flex-shrink-0 mb-1" />}
              <div
                className={`max-w-[80%] p-3 rounded-2xl text-white ${
                  msg.sender === 'user'
                    ? 'bg-brand-primary rounded-br-lg'
                    : 'bg-gray-700 rounded-bl-lg'
                }`}
              >
                <p className="text-sm break-words">{msg.text}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-end gap-2 justify-start">
              <CuteAIIcon className="w-6 h-6 text-brand-accent flex-shrink-0 mb-1" />
              <div className="bg-gray-700 rounded-2xl rounded-bl-lg">
                <TypingIndicator />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-700 flex-shrink-0">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask Luci a question..."
            aria-label="Chat input"
            className="w-full bg-gray-800 border border-gray-600 rounded-full py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            aria-label="Send message"
            className="bg-brand-primary text-white p-2.5 rounded-full disabled:bg-indigo-800 disabled:cursor-not-allowed hover:bg-indigo-500 transition-all duration-300 transform hover:scale-110"
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};
