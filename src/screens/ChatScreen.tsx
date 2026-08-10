import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquareCode,
  Send,
  Sparkles,
  Paperclip,
  Bot,
  User,
  Database,
  RefreshCw,
  Lightbulb,
  Copy,
  Check,
  BarChart2,
  FileSpreadsheet,
} from 'lucide-react';
import { ScreenType, Dataset, ChatMessage } from '../types';

interface ChatScreenProps {
  dataset: Dataset | null;
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  onNavigate: (screen: ScreenType) => void;
  isLoading: boolean;
}

export const ChatScreen: React.FC<ChatScreenProps> = ({
  dataset,
  messages,
  onSendMessage,
  onNavigate,
  isLoading,
}) => {
  const [inputText, setInputText] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const datasetName = dataset ? dataset.name : 'sales_data.csv';

  const suggestedPrompts = [
    'What are the top 3 revenue drivers in this dataset?',
    'Identify any outliers or anomalies in the price column.',
    'Summarize the dataset quality and missing value distribution.',
    'Which product category has the highest profit margin?',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col lg:flex-row gap-6">
      {/* Left Main Chat Column */}
      <div className="flex-1 bg-[#161820] border border-white/10 rounded-3xl flex flex-col overflow-hidden shadow-2xl">
        {/* Chat Header */}
        <div className="p-4 md:p-5 border-b border-white/10 bg-[#1B1E28] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm md:text-base font-bold text-white flex items-center gap-2">
                DataPilot AI Assistant
                <span className="text-[10px] font-mono font-normal px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                  Gemini 3.6 Flash
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-mono">Connected Dataset: {datasetName}</p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('analysis')}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-cyan-300 transition-colors"
          >
            View Dashboard Summary →
          </button>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          {messages.map((msg, idx) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id || idx}
                className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                    isUser
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div className={`max-w-[80%] rounded-2xl p-4 text-xs md:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-tr-none shadow-lg'
                    : 'bg-[#1D202B] border border-white/10 text-slate-100 rounded-tl-none shadow-xl'
                }`}>
                  <div className="flex items-center justify-between mb-1.5 opacity-60 text-[10px] font-mono">
                    <span>{isUser ? 'You' : 'DataPilot AI'}</span>
                    <span>{msg.timestamp || 'Just now'}</span>
                  </div>

                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  {!isUser && (
                    <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                      <span className="font-mono text-[10px] text-purple-400">Analysis verified by Gemini</span>
                      <button
                        onClick={() => handleCopy(msg.text, idx)}
                        className="flex items-center gap-1 hover:text-white transition-colors"
                      >
                        {copiedIndex === idx ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedIndex === idx ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center justify-center">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-[#1D202B] border border-white/10 rounded-2xl px-4 py-3 text-xs text-slate-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
                <span>DataPilot AI is analyzing dataset columns...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts Bar */}
        <div className="p-3 border-t border-white/10 bg-[#111318]/80 flex flex-wrap gap-2">
          {suggestedPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => onSendMessage(prompt)}
              className="text-[11px] bg-white/5 hover:bg-cyan-500/10 border border-white/10 hover:border-cyan-500/30 text-slate-300 hover:text-cyan-300 px-3 py-1.5 rounded-full transition-all text-left truncate max-w-xs"
            >
              💡 {prompt}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="p-3 md:p-4 bg-[#1B1E28] border-t border-white/10 flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask anything about your dataset (e.g. 'Show revenue by category', 'Find nulls')..."
              className="w-full bg-[#111318] border border-white/15 rounded-2xl py-3 pl-4 pr-10 text-xs md:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-cyan-300 transition-colors"
              title="Attach File Context"
            >
              <Paperclip className="w-4 h-4" />
            </button>
          </div>

          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-1.5 transition-all disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>

      {/* Right Dataset Context Drawer */}
      <div className="w-full lg:w-80 bg-[#161820] border border-white/10 rounded-3xl p-5 flex flex-col justify-between shadow-2xl shrink-0">
        <div>
          <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <Database className="w-4 h-4 text-cyan-400" /> Dataset Context
          </h3>

          <div className="p-3.5 rounded-2xl bg-[#111318] border border-white/10 space-y-2 mb-4 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Name:</span>
              <strong className="text-white truncate max-w-[130px]">{datasetName}</strong>
            </div>
            <div className="flex justify-between font-mono">
              <span className="text-slate-400">Total Rows:</span>
              <strong className="text-cyan-400">{dataset?.rows.toLocaleString() || '25,430'}</strong>
            </div>
            <div className="flex justify-between font-mono">
              <span className="text-slate-400">Total Columns:</span>
              <strong className="text-cyan-400">{dataset?.cols || 14}</strong>
            </div>
            <div className="flex justify-between font-mono">
              <span className="text-slate-400">Data Quality:</span>
              <strong className="text-emerald-400">{dataset?.quality || 95}% Clean</strong>
            </div>
          </div>

          <h4 className="text-xs font-bold text-slate-300 mb-2">Available Columns</h4>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {(dataset?.columns || [
              { name: 'Customer_ID', dataType: 'string' },
              { name: 'Category', dataType: 'string' },
              { name: 'Revenue', dataType: 'number' },
              { name: 'Quantity', dataType: 'number' },
              { name: 'Date', dataType: 'date' },
            ]).map((col) => (
              <div key={col.name} className="flex items-center justify-between p-2 rounded-xl bg-white/5 text-xs font-mono text-slate-300">
                <span className="truncate">{col.name}</span>
                <span className="text-[10px] text-cyan-400 uppercase font-bold">{col.dataType}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-white/10 space-y-2">
          <button
            onClick={() => onNavigate('reports')}
            className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 transition-colors flex items-center justify-center gap-2"
          >
            <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
            <span>Generate PDF Report</span>
          </button>
        </div>
      </div>
    </div>
  );
};
