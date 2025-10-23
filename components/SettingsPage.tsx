

import React, { useState, useRef, useEffect } from 'react';
import type { User } from '../types';
import { THEMES } from '../App';
import { PREDEFINED_AVATARS, PREDEFINED_BANNERS } from '../constants';

interface SettingsPageProps {
    currentUser: User;
    onUpdateProfile: (updatedData: Partial<User>, navigateOnSuccess?: boolean) => void;
    onCancel: () => void;
    theme: { [key: string]: string };
    blockedUsers: User[];
    onUnblockUser: (userId: string) => void;
}

type ActiveSettingsTab = 'profile' | 'appearance' | 'account' | 'privacy';

const SettingsPage: React.FC<SettingsPageProps> = ({ currentUser, onUpdateProfile, onCancel, theme, blockedUsers, onUnblockUser }) => {
    const [activeTab, setActiveTab] = useState<ActiveSettingsTab>('profile');

    const TabButton: React.FC<{ tabKey: ActiveSettingsTab; label: string }> = ({ tabKey, label }) => (
        <button
            onClick={() => setActiveTab(tabKey)}
            className={`w-full text-left px-3 py-2 rounded-md text-sm font-semibold transition-colors ${
                activeTab === tabKey
                    ? `${theme.button} ${theme.buttonText}`
                    : `${theme.text} ${theme.subtleBgHover}`
            }`}
        >
            {label}
        </button>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'profile':
                return <ProfileSettings currentUser={currentUser} onUpdateProfile={onUpdateProfile} theme={theme} />;
            case 'appearance':
                return <AppearanceSettings currentUser={currentUser} onUpdateProfile={onUpdateProfile} theme={theme} />;
            case 'account':
                return <AccountSettings currentUser={currentUser} onUpdateProfile={onUpdateProfile} theme={theme} />;
            case 'privacy':
                return <PrivacySettings blockedUsers={blockedUsers} onUnblockUser={onUnblockUser} theme={theme} />;
            default:
                return null;
        }
    };

    return (
        <div className={`${theme.panelBg} p-6 rounded-md border ${theme.panelBorder} shadow-sm`}>
            <h2 className={`text-xl font-light ${theme.subtleText} mb-4 border-b ${theme.panelBorder} pb-3`}>Configurações</h2>
            <div className="flex flex-col md:flex-row md:space-x-8">
                <aside className="md:w-48 flex-shrink-0 mb-6 md:mb-0">
                    <nav className="flex flex-row md:flex-col md:space-y-1 overflow-x-auto md:overflow-x-visible -mx-2 px-2 md:-mx-0 md:px-0">
                        <TabButton tabKey="profile" label="Editar Perfil" />
                        <TabButton tabKey="appearance" label="Aparência" />
                        <TabButton tabKey="account" label="Conta" />
                        <TabButton tabKey="privacy" label="Privacidade" />
                    </nav>
                </aside>
                <div className="flex-1 min-w-0">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};


// --- Sub-components for each tab ---

const ProfileSettings: React.FC<Pick<SettingsPageProps, 'currentUser' | 'onUpdateProfile' | 'theme'>> = ({ currentUser, onUpdateProfile, theme }) => {
    const [formData, setFormData] = useState({
        city: currentUser.city,
        country: currentUser.country,
        relationship: currentUser.relationship,
        occupation: currentUser.occupation,
        interests: currentUser.interests.join(', '),
        profilePicUrl: currentUser.profilePicUrl,
        bannerUrl: currentUser.bannerUrl,
    });
    
    const createdObjectURLs = useRef<string[]>([]);
    const avatarUploadRef = useRef<HTMLInputElement>(null);
    const bannerUploadRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        return () => {
            createdObjectURLs.current.forEach(URL.revokeObjectURL);
        };
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, imageType: 'avatar' | 'banner') => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            const newUrl = URL.createObjectURL(file);
            createdObjectURLs.current.push(newUrl);

            if (imageType === 'avatar') {
                if (formData.profilePicUrl.startsWith('blob:')) {
                    URL.revokeObjectURL(formData.profilePicUrl);
                }
                setFormData(prev => ({ ...prev, profilePicUrl: newUrl }));
            } else {
                if (formData.bannerUrl.startsWith('blob:')) {
                    URL.revokeObjectURL(formData.bannerUrl);
                }
                setFormData(prev => ({ ...prev, bannerUrl: newUrl }));
            }
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const updatedData = {
            ...formData,
            interests: formData.interests.split(',').map(item => item.trim()).filter(Boolean),
            avatarUrl: formData.profilePicUrl,
            profilePicUrl: formData.profilePicUrl
        };
        onUpdateProfile(updatedData, true);
    };
    
     const FormRow: React.FC<{label: string, children: React.ReactNode}> = ({ label, children }) => (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 py-4 border-b border-dashed">
            <div className="md:text-right md:pr-4">
                <label className={`text-sm font-semibold ${theme.subtleText}`}>{label}:</label>
            </div>
            <div className="md:col-span-2">
                {children}
            </div>
        </div>
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
                    <img src={url} alt="Gallery image" className="w-full h-16 object-cover" />
                </button>
            ))}
        </div>
    );
    
    return (
        <form onSubmit={handleSubmit}>
            <h3 className={`text-lg font-semibold ${theme.text} mb-4 border-b ${theme.panelBorder} pb-2`}>Editar Perfil</h3>
            <FormRow label="Foto do Perfil">
                <div className="flex items-center space-x-4">
                    <img src={formData.profilePicUrl} alt="Current Avatar" className="w-20 h-20 rounded-md" />
                    <div>
                         <button type="button" onClick={() => avatarUploadRef.current?.click()} className={`${theme.subtleBg} ${theme.subtleBgHover} text-sm font-semibold py-1 px-3 rounded-md border ${theme.panelBorder}`}>
                            Enviar Foto
                        </button>
                        <input type="file" ref={avatarUploadRef} onChange={(e) => handleImageUpload(e, 'avatar')} accept="image/*" className="hidden" />
                        <p className={`text-xs ${theme.subtleText} mt-1`}>Ou escolha uma da galeria:</p>
                    </div>
                </div>
                 <ImageGrid images={PREDEFINED_AVATARS} onSelect={url => setFormData(prev => ({...prev, profilePicUrl: url}))} selectedImage={formData.profilePicUrl} />
            </FormRow>
             <FormRow label="Banner do Perfil">
                <div className="flex flex-col">
                    <img src={formData.bannerUrl} alt="Current Banner" className="w-full h-24 object-cover rounded-md mb-2" />
                    <button type="button" onClick={() => bannerUploadRef.current?.click()} className={`self-start ${theme.subtleBg} ${theme.subtleBgHover} text-sm font-semibold py-1 px-3 rounded-md border ${theme.panelBorder}`}>
                       Enviar Banner
                    </button>
                     <input type="file" ref={bannerUploadRef} onChange={(e) => handleImageUpload(e, 'banner')} accept="image/*" className="hidden" />
                    <p className={`text-xs ${theme.subtleText} mt-1`}>Ou escolha um da galeria:</p>
                </div>
                 <ImageGrid images={PREDEFINED_BANNERS} onSelect={url => setFormData(prev => ({...prev, bannerUrl: url}))} selectedImage={formData.bannerUrl} />
            </FormRow>
            {/* ... other fields ... */}
            <div className={`flex justify-end space-x-4 pt-6 mt-4`}>
                <button 
                    type="submit" 
                    className={`${theme.button} ${theme.buttonText} text-sm font-bold py-1.5 px-5 rounded-md hover:opacity-90`}
                >
                    Salvar Alterações
                </button>
            </div>
        </form>
    );
};

const AppearanceSettings: React.FC<Pick<SettingsPageProps, 'currentUser' | 'onUpdateProfile' | 'theme'>> = ({ currentUser, onUpdateProfile, theme }) => {
    const handleThemeChange = (themeKey: string) => {
        onUpdateProfile({ theme: themeKey }, false);
    };

    return (
        <div>
            <h3 className={`text-lg font-semibold ${theme.text} mb-4 border-b ${theme.panelBorder} pb-2`}>Aparência</h3>
            <p className={`${theme.subtleText} text-sm mb-4`}>Escolha um tema para personalizar a aparência do seu OldKut. A alteração é aplicada imediatamente.</p>
            <div className="flex flex-wrap gap-4">
                {Object.entries({classic: 'Azul Clássico', pink: 'Rosa Vibrante', green: 'Verde Sereno', dark: 'Modo Escuro'}).map(([key, name]) => (
                    <button
                        key={key}
                        type="button"
                        onClick={() => handleThemeChange(key)}
                        className={`flex flex-col items-center space-y-2 p-3 rounded-md border-2 transition-all w-32 ${currentUser.theme === key ? 'border-pink-500 bg-pink-50' : `border-transparent ${theme.subtleBg}`}`}
                    >
                        <div className="flex -space-x-2 border border-gray-300 rounded-full p-0.5">
                            <span className={`block w-8 h-8 rounded-full ${THEMES[key].bg} border-2 border-white`}></span>
                            <span className={`block w-8 h-8 rounded-full ${THEMES[key].header} border-2 border-white`}></span>
                        </div>
                        <span className={`text-sm font-semibold ${theme.text}`}>{name}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

const AccountSettings: React.FC<Pick<SettingsPageProps, 'currentUser' | 'onUpdateProfile' | 'theme'>> = ({ currentUser, onUpdateProfile, theme }) => {
    const handleEmailNotificationToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
        onUpdateProfile({ emailNotifications: e.target.checked }, false);
    };
    
    const [password, setPassword] = useState({ current: '', new: '', confirm: '' });
    const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });
    
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(p => ({...p, [e.target.name]: e.target.value}));
    };

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordMessage({ type: '', text: '' });
        if(password.new !== password.confirm) {
            setPasswordMessage({ type: 'error', text: 'As novas senhas não coincidem.'});
            return;
        }
        if(password.new.length < 6) {
            setPasswordMessage({ type: 'error', text: 'A nova senha deve ter pelo menos 6 caracteres.'});
            return;
        }
        // In a real app, you'd call an API here. We'll just show a success message.
        console.log("Password change submitted:", password);
        setPasswordMessage({ type: 'success', text: 'Sua senha foi alterada com sucesso!' });
        setPassword({ current: '', new: '', confirm: '' });
    };

    return (
        <div>
            <h3 className={`text-lg font-semibold ${theme.text} mb-4 border-b ${theme.panelBorder} pb-2`}>Configurações da Conta</h3>
            <div className="py-4 border-b border-dashed">
                <label htmlFor="emailNotifications" className="flex items-center cursor-pointer">
                    <div className="relative">
                        <input type="checkbox" id="emailNotifications" className="sr-only" checked={currentUser.emailNotifications} onChange={handleEmailNotificationToggle} />
                        <div className={`block w-10 h-6 rounded-full transition-colors ${currentUser.emailNotifications ? theme.button : 'bg-gray-300'}`}></div>
                        <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${currentUser.emailNotifications ? 'translate-x-4' : ''}`}></div>
                    </div>
                    <div className="ml-3">
                        <p className={`${theme.text} font-semibold`}>Notificações por Email</p>
                        <p className={`text-sm ${theme.subtleText}`}>Receba um email para novas atividades.</p>
                    </div>
                </label>
            </div>
            <div className="py-4 border-b border-dashed">
                 <p className={`${theme.text} font-semibold`}>Email da conta</p>
                 <p className={`text-sm ${theme.subtleText} mt-1`}>Seu email de login é <span className="font-mono">{currentUser.email}</span>.</p>
            </div>
             <div className="py-4">
                 <p className={`${theme.text} font-semibold mb-2`}>Alterar Senha</p>
                 <form onSubmit={handlePasswordSubmit} className="space-y-3 max-w-sm">
                      <input type="password" name="current" value={password.current} onChange={handlePasswordChange} placeholder="Senha Atual" required className={`w-full p-2 border ${theme.panelBorder} rounded-sm text-sm ${theme.inputBg} ${theme.text}`} />
                      <input type="password" name="new" value={password.new} onChange={handlePasswordChange} placeholder="Nova Senha" required className={`w-full p-2 border ${theme.panelBorder} rounded-sm text-sm ${theme.inputBg} ${theme.text}`} />
                      <input type="password" name="confirm" value={password.confirm} onChange={handlePasswordChange} placeholder="Confirmar Nova Senha" required className={`w-full p-2 border ${theme.panelBorder} rounded-sm text-sm ${theme.inputBg} ${theme.text}`} />
                      {passwordMessage.text && <p className={`text-sm ${passwordMessage.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>{passwordMessage.text}</p>}
                      <button type="submit" className={`${theme.button} ${theme.buttonText} text-sm font-bold py-1 px-4 rounded-md`}>Salvar Senha</button>
                 </form>
            </div>
        </div>
    );
};

const PrivacySettings: React.FC<Pick<SettingsPageProps, 'blockedUsers' | 'onUnblockUser' | 'theme'>> = ({ blockedUsers, onUnblockUser, theme }) => {
    return (
        <div>
            <h3 className={`text-lg font-semibold ${theme.text} mb-4 border-b ${theme.panelBorder} pb-2`}>Privacidade</h3>
            <div className="py-4">
                <p className={`${theme.text} font-semibold mb-2`}>Usuários Bloqueados</p>
                {blockedUsers.length > 0 ? (
                    <div className="space-y-2">
                        {blockedUsers.map(user => (
                            <div key={user.id} className={`flex items-center justify-between p-2 ${theme.subtleBg} rounded-md`}>
                                <div className="flex items-center space-x-3">
                                    <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full" />
                                    <p className={`text-sm font-semibold ${theme.text}`}>{user.name}</p>
                                </div>
                                <button onClick={() => onUnblockUser(user.id)} className="bg-gray-200 text-gray-700 text-xs font-bold py-1 px-3 rounded-md hover:bg-gray-300">Desbloquear</button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className={`${theme.subtleText} text-sm`}>Você não bloqueou nenhum usuário.</p>
                )}
            </div>
        </div>
    );
};


export default SettingsPage;