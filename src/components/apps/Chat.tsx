import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Wllama } from '@wllama/wllama';

interface Message {
  role: 'assistant' | 'user';
  content: string;
  timestamp: Date;
}

export const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [wllama, setWllama] = useState<Wllama | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useStore();

  useEffect(() => {
    initWllama();
  }, []);

  const initWllama = async () => {
    const CONFIG_PATHS = {
      'single-thread/wllama.js': '/wllama/single-thread/wllama.js',
      'single-thread/wllama.wasm': '/wllama/single-thread/wllama.wasm',
      'multi-thread/wllama.js': '/wllama/multi-thread/wllama.js',
      'multi-thread/wllama.wasm': '/wllama/multi-thread/wllama.wasm',
      'multi-thread/wllama.worker.mjs': '/wllama/multi-thread/wllama.worker.mjs',
    };

    try {
      const wllamaInstance = new Wllama(CONFIG_PATHS);
      
      // Load the model with progress tracking
      await wllamaInstance.loadModelFromUrl(
        "https://huggingface.co/ggml-org/models/resolve/main/tinyllamas/stories260K.gguf",
        {
          progressCallback: ({ loaded, total }) => {
            const progress = Math.round((loaded / total) * 100);
            console.log(`Loading model: ${progress}%`);
          }
        }
      );

      setWllama(wllamaInstance);
      
      // Add initial message
      setMessages([{
        role: 'assistant',
        content: 'Hello! I am an AI assistant. How can I help you today?',
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error('Error initializing Wllama:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !wllama) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await wllama.createCompletion(input, {
        nPredict: 1000,
        sampling: {
          temp: 0.7,
          top_k: 40,
          top_p: 0.9,
        }
      });

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response,
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error('Error generating response:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again.',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-900">
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex items-start space-x-3 ${
              message.role === 'assistant' ? 'text-blue-400' : 'text-green-400'
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0">
              {message.role === 'assistant' ? (
                <Bot size={20} />
              ) : (
                <User size={20} />
              )}
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center space-x-2">
                <span className="font-medium">
                  {message.role === 'assistant' ? 'AI Assistant' : user?.email || 'You'}
                </span>
                <span className="text-xs text-gray-500">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
              <div className="text-white whitespace-pre-wrap">{message.content}</div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center space-x-2 text-blue-400">
            <Loader2 size={20} className="animate-spin" />
            <span>Thinking...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-800">
        <div className="flex space-x-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading || !wllama}
          />
          <button
            type="submit"
            disabled={isLoading || !wllama || !input.trim()}
            className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
}; 