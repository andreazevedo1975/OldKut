import React, { useState, useMemo } from 'react';
import { supabase } from '../supabaseClient';
import { PREDEFINED_AVATARS, PREDEFINED_BANNERS } from '../constants';

interface LoginPageProps {
    // No props needed now as it handles its own state and auth
}

const LoginPage: React.FC<LoginPageProps> = () => {
    const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // Login state
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    // Signup state
    const [signupStep, setSignupStep] = useState<'form' | 'customize'>('form');
    const [signupData, setSignupData] = useState<any>({});
    const [customizationData, setCustomizationData] = useState({
        profilePicUrl: PREDEFINED_AVATARS[0],
        bannerUrl: PREDEFINED_BANNERS[0],
        city: '',
        relationship: 'Solteiro(a)',
    });

    const [name, setName] = useState('');
    const [dob, setDob] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [ageError, setAgeError] = useState('');

    const isSignupDisabled = useMemo(() => {
        return !!(ageError || !name || !dob || !email || !password);
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

        if (age < 40) { // Age requirement for the target audience
            setAgeError('Você deve ter pelo menos 40 anos para se cadastrar.');
        } else {
            setAgeError('');
        }
    };
    
    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        const { error } = await supabase.auth.signInWithPassword({
            email: loginEmail,
            password: loginPassword,
        });
        if (error) setError(error.message);
        setLoading(false);
    };

    const handleSignupSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isSignupDisabled) return;
        setSignupData({
            name,
            dob,
            email,
            password,
        });
        setSignupStep('customize');
    };
    
    const handleFinalizeSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: signupData.email,
            password: signupData.password,
            options: {
                data: {
                    name: signupData.name,
                    dob: signupData.dob,
                    avatar_url: customizationData.profilePicUrl,
                    banner_url: customizationData.bannerUrl,
                    city: customizationData.city || 'Não informado',
                    relationship: customizationData.relationship,
                },
            },
        });

        if (authError) {
            setError(authError.message);
            setLoading(false);
            return;
        }

        if (authData.user) {
           // The user is signed up and the session is active.
           // A trigger in Supabase will create the profile from the metadata.
        }
        setLoading(false);
    };

    const TabButton: React.FC<{tabName: 'login' | 'signup', label: string}> = ({ tabName, label }) => (
        <button
            onClick={() => {
                setActiveTab(tabName);
                setError(null);
                setSignupStep('form');
            }}
            className={`w-1/2 py-2 text-center font-bold text-sm rounded-t-md ${activeTab === tabName ? 'bg-white text-[#ED008C]' : 'bg-gray-200 text-gray-600'}`}
        >
            {label}
        </button>
    );

    const ImageGrid: React.FC<{images: string[], onSelect: (url: string) => void, selectedImage: string}> = ({ images, onSelect, selectedImage }) => (
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mt-2">
            {images.map(url => (
                <button
                    key={url}
                    type="button"
                    onClick={() => onSelect(url)}
                    className={`rounded-md overflow-hidden border-2 transition-all ${selectedImage === url ? 'border-pink-500 scale-105' : 'border-transparent hover:border-pink-400'}`}
                >
                    <img src={url} alt="Gallery image" className="w-full h-12 object-cover" />
                </button>
            ))}
        </div>
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
                         {error && <p className="bg-red-100 text-red-700 p-3 rounded-md text-sm mb-4">{error}</p>}

                        {activeTab === 'login' && (
                            <form onSubmit={handleLoginSubmit} className="space-y-4">
                                <div>
                                    <label className="text-sm text-gray-600">Email</label>
                                    <input type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} required className="w-full p-2 border border-gray-300 rounded-md" />
                                </div>
                                <div>
                                    <label className="text-sm text-gray-600">Senha</label>
                                    <input type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} required className="w-full p-2 border border-gray-300 rounded-md" />
                                </div>
                                <button type="submit" disabled={loading} className="w-full bg-[#ED008C] text-white font-bold py-2 px-4 rounded-md hover:bg-[#D4007C] disabled:bg-gray-400">
                                    {loading ? 'Entrando...' : 'Entrar'}
                                </button>
                            </form>
                        )}
                        {activeTab === 'signup' && (
                            signupStep === 'form' ? (
                                <form onSubmit={handleSignupSubmit} className="space-y-4">
                                    <h2 className="text-xl text-gray-700 mb-2">Crie sua conta</h2>
                                    <div>
                                        <label className="text-sm text-gray-600">Nome Completo</label>
                                        <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full p-2 border border-gray-300 rounded-md" />
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-600">Data de Nascimento</label>
                                        <input type="date" value={dob} onChange={handleDobChange} required className="w-full p-2 border border-gray-300 rounded-md" />
                                        {ageError && <p className="text-red-500 text-xs mt-1">{ageError}</p>}
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-600">Email</label>
                                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full p-2 border border-gray-300 rounded-md" />
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-600">Senha</label>
                                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full p-2 border border-gray-300 rounded-md" />
                                    </div>
                                    <button type="submit" disabled={isSignupDisabled} className="w-full bg-[#ED008C] text-white font-bold py-2 px-4 rounded-md hover:bg-[#D4007C] disabled:bg-gray-400 disabled:cursor-not-allowed">
                                        Próximo Passo
                                    </button>
                                </form>
                            ) : (
                                <form onSubmit={handleFinalizeSignup}>
                                    <h2 className="text-xl text-gray-700 mb-4">Personalize seu perfil</h2>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-sm text-gray-600">Foto de Perfil</label>
                                            <ImageGrid images={PREDEFINED_AVATARS} onSelect={url => setCustomizationData(p => ({...p, profilePicUrl: url}))} selectedImage={customizationData.profilePicUrl} />
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-600">Banner do Perfil</label>
                                             <ImageGrid images={PREDEFINED_BANNERS} onSelect={url => setCustomizationData(p => ({...p, bannerUrl: url}))} selectedImage={customizationData.bannerUrl} />
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-600">Cidade (Opcional)</label>
                                            <input type="text" value={customizationData.city} onChange={e => setCustomizationData(p => ({...p, city: e.target.value}))} className="w-full p-2 border border-gray-300 rounded-md" />
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-600">Relacionamento</label>
                                            <select value={customizationData.relationship} onChange={e => setCustomizationData(p => ({...p, relationship: e.target.value}))} className="w-full p-2 border border-gray-300 rounded-md bg-white">
                                                <option>Solteiro(a)</option>
                                                <option>Namorando</option>
                                                <option>Casado(a)</option>
                                                <option>Complicado(a)</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between mt-6">
                                        <button type="button" onClick={() => setSignupStep('form')} className="text-sm text-gray-600 hover:underline">Voltar</button>
                                        <button type="submit" disabled={loading} className="bg-[#ED008C] text-white font-bold py-2 px-4 rounded-md hover:bg-[#D4007C] disabled:bg-gray-400">
                                            {loading ? 'Finalizando...' : 'Finalizar Cadastro'}
                                        </button>
                                    </div>
                                </form>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;