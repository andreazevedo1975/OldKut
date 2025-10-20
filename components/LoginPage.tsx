import React, { useState, useMemo } from 'react';
import type { User } from '../types';

interface LoginPageProps {
    onLogin: (userId: number) => void;
    onCreateAccount: (newUser: Omit<User, 'id' | 'friends' | 'friendRequests' | 'sentRequests' | 'communities' | 'profilePicUrl' | 'avatarUrl' | 'bannerUrl' | 'blockedUserIds'>) => void;
    existingUsers: User[];
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onCreateAccount, existingUsers }) => {
    const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
    
    // Login state
    const [loginAs, setLoginAs] = useState<string>(existingUsers[0]?.id.toString() || '');

    // Signup state
    const [name, setName] = useState('');
    const [dob, setDob] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [ageError, setAgeError] = useState('');

    const isSignupDisabled = useMemo(() => {
        if (ageError || !name || !dob || !email || !password) {
            return true;
        }
        return false;
    }, [ageError, name, dob, email, password]);
    
    const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDob = e.target.value;
        setDob(newDob);

        if (!newDob) {
            setAgeError('');
            return;
        }

        const birthDate = new Date(newDob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        if (age < 40) {
            setAgeError('Você deve ter pelo menos 40 anos para se cadastrar.');
        } else {
            setAgeError('');
        }
    };
    
    const handleLoginSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onLogin(parseInt(loginAs, 10));
    };

    const handleSignupSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isSignupDisabled) return;
        onCreateAccount({
            name,
            dob,
            email,
            password,
            city: 'Não informado',
            country: 'Não informado',
            relationship: 'Não informado',
            occupation: 'Não informado',
            interests: [],
            theme: 'classic',
        });
    };

    const TabButton: React.FC<{tabName: 'login' | 'signup', label: string}> = ({ tabName, label }) => (
        <button
            onClick={() => setActiveTab(tabName)}
            className={`w-1/2 py-2 text-center font-bold text-sm rounded-t-md ${activeTab === tabName ? 'bg-white text-[#ED008C]' : 'bg-gray-200 text-gray-600'}`}
        >
            {label}
        </button>
    );

    return (
        <div className="min-h-screen flex items-center justify-center bg-cover bg-center" style={{backgroundImage: 'linear-gradient(to top, #D4E4F7, #FFFFFF)'}}>
            <div className="w-full max-w-md mx-auto">
                 <h1 className="text-6xl font-bold text-[#ED008C] text-center mb-4" style={{fontFamily: "'Arial Black', Gadget, sans-serif"}}>OldKut</h1>
                 <p className="text-center text-gray-600 mb-6">A sua rede social de volta, para boas lembranças.</p>
                
                <div className="w-full max-w-sm mx-auto shadow-2xl rounded-lg">
                    <div className="flex">
                        <TabButton tabName='login' label='Entrar' />
                        <TabButton tabName='signup' label='Criar Conta' />
                    </div>

                    <div className="bg-white p-6 rounded-b-lg">
                        {activeTab === 'login' && (
                            <form onSubmit={handleLoginSubmit}>
                                <h2 className="text-xl text-gray-700 mb-4">Bem-vindo(a) de volta!</h2>
                                <p className="text-sm text-gray-500 mb-4">Para fins de demonstração, selecione um usuário para entrar.</p>
                                <label htmlFor="loginAs" className="block text-sm font-medium text-gray-700">Entrar como:</label>
                                <select 
                                    id="loginAs"
                                    value={loginAs}
                                    onChange={(e) => setLoginAs(e.target.value)}
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#ED008C] focus:border-[#ED008C] sm:text-sm rounded-md"
                                >
                                    {existingUsers.map(user => <option key={user.id} value={user.id}>{user.name}</option>)}
                                </select>
                                <button type="submit" className="w-full bg-[#ED008C] text-white font-bold py-2 px-4 rounded-md hover:bg-[#D4007C] mt-6">
                                    Entrar
                                </button>
                            </form>
                        )}
                        {activeTab === 'signup' && (
                            <form onSubmit={handleSignupSubmit} className="space-y-4">
                                <h2 className="text-xl text-gray-700 mb-2">Crie sua conta</h2>
                                <div>
                                    <label className="text-sm">Nome Completo</label>
                                    <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full p-2 border border-gray-300 rounded-md" />
                                </div>
                                <div>
                                    <label className="text-sm">Data de Nascimento</label>
                                    <input type="date" value={dob} onChange={handleDobChange} required className="w-full p-2 border border-gray-300 rounded-md" />
                                    {ageError && <p className="text-red-500 text-xs mt-1">{ageError}</p>}
                                </div>
                                 <div>
                                    <label className="text-sm">Email</label>
                                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full p-2 border border-gray-300 rounded-md" />
                                </div>
                                <div>
                                    <label className="text-sm">Senha</label>
                                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full p-2 border border-gray-300 rounded-md" />
                                 </div>
                                <button type="submit" disabled={isSignupDisabled} className="w-full bg-[#ED008C] text-white font-bold py-2 px-4 rounded-md hover:bg-[#D4007C] disabled:bg-gray-400 disabled:cursor-not-allowed">
                                    Cadastrar
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;