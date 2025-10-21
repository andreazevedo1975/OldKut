
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import { XIcon, SparklesIcon } from './icons';
import type { User } from '../types';

interface ChatbotProps {
    currentUser: User;
    onClose: () => void;
    theme: { [key: string]: string };
}

interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}

const Chatbot: React.FC<ChatbotProps> = ({ currentUser, onClose, theme }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { role: 'model', text: `Olá, ${currentUser.name.split(' ')[0]}! Sou o assistente do OldKut. Como posso ajudar você hoje?` }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [chat, setChat] = useState<Chat | null>(null);
    const messageEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const initChat = () => {
            try {
                if (!process.env.API_KEY) {
                    console.error("API_KEY is not set.");
                     setMessages(prev => [...prev, { role: 'model', text: 'Desculpe, a configuração do assistente está incompleta. O administrador precisa configurar a chave de API.' }]);
                    return;
                }
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
                const chatSession = ai.chats.create({
                    model: 'gemini-2.5-flash',
                    config: {
                        systemInstruction: 'Você é um assistente amigável e prestativo para uma rede social nostálgica chamada OldKut, que é um clone do Orkut para pessoas com mais de 40 anos. Responda de forma concisa e útil. Use emojis quando apropriado. O nome do usuário é ' + currentUser.name,
                    }
                });
                setChat(chatSession);
            } catch (error) {
                console.error("Failed to initialize Gemini:", error);
                setMessages(prev => [...prev, { role: 'model', text: 'Desculpe, não consegui me conectar. Verifique sua chave de API e atualize a página.' }]);
            }
        };
        initChat();
    }, [currentUser.name]);

    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading || !chat) return;

        const userMessage: ChatMessage = { role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await chat.sendMessage({ message: input });
            const botMessage: ChatMessage = { role: 'model', text: response.text };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error('Error sending message to Gemini:', error);
            setMessages(prev => [...prev, { role: 'model', text: 'Oops! Algo deu errado. Tente novamente.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`fixed bottom-20 right-4 w-80 h-[28rem] flex flex-col ${theme.panelBg} border ${theme.panelBorder} rounded-lg shadow-2xl z-[100]`}>
            <header className={`${theme.header} ${theme.headerText} rounded-t-lg px-3 py-2 flex justify-between items-center`}>
                <div className="flex items-center space-x-2">
                    <SparklesIcon className="w-5 h-5" />
                    <span className="text-sm font-bold">OldKut Assistente</span>
                </div>
                <button onClick={onClose} className="hover:opacity-70">
                    <XIcon className="w-4 h-4" />
                </button>
            </header>
            
            <div className="flex-1 p-3 overflow-y-auto flex flex-col space-y-3">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-start gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role === 'model' && <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${theme.button}`}><SparklesIcon className={`w-5 h-5 ${theme.buttonText}`} /></div>}
                        <div className={`flex flex-col w-full max-w-[80%] leading-1.5 p-3 rounded-xl ${msg.role === 'user' ? 'rounded-br-none bg-blue-500 text-white' : `rounded-bl-none ${theme.subtleBg}`}`}>
                             <p className={`text-sm font-normal ${msg.role === 'model' ? theme.text : ''} whitespace-pre-wrap`}>{msg.text}</p>
                        </div>
                    </div>
                ))}
                {isLoading && (
                     <div className="flex items-start gap-2.5 justify-start">
                         <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${theme.button}`}><SparklesIcon className={`w-5 h-5 ${theme.buttonText}`} /></div>
                        <div className={`flex items-center space-x-2 p-3 rounded-xl rounded-bl-none ${theme.subtleBg}`}>
                            <div className={`h-2 w-2 ${theme.button} rounded-full animate-bounce [animation-delay:-0.3s]`}></div>
	                        <div className={`h-2 w-2 ${theme.button} rounded-full animate-bounce [animation-delay:-0.15s]`}></div>
	                        <div className={`h-2 w-2 ${theme.button} rounded-full animate-bounce`}></div>
                        </div>
                    </div>
                )}
                <div ref={messageEndRef} />
            </div>

            <div className={`p-2 border-t ${theme.panelBorder}`}>
                <form onSubmit={handleSendMessage}>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Pergunte algo..."
                        disabled={isLoading || !chat}
                        className={`w-full px-3 py-1.5 border ${theme.panelBorder} rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 ${theme.inputBg} ${theme.text} disabled:bg-gray-200`}
                    />
                </form>
            </div>
        </div>
    );
};

export default Chatbot;
