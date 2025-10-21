import React, { useState, useRef } from 'react';
import type { User } from '../types';
import { THEMES } from '../App';
import { PREDEFINED_AVATARS, PREDEFINED_BANNERS } from '../constants';

interface SettingsPageProps {
    currentUser: User;
    onUpdateProfile: (updatedData: Partial<User>, navigateOnSuccess?: boolean) => void;
    onCancel: () => void;
    theme: { [key: string]: string };
}

type ActiveSettingsTab = 'profile' | 'appearance' | 'account' | 'privacy';

const SettingsPage: React.FC<SettingsPageProps> = ({ currentUser, onUpdateProfile, onCancel, theme }) => {
    const [activeTab, setActiveTab] = useState<ActiveSettingsTab>('profile');
    const [formData, setFormData] = useState({
        city: currentUser.city,
        country: currentUser.country,
        relationship: currentUser.relationship,
        occupation: currentUser.occupation,
        interests: currentUser.interests.join(', '),
        profilePicUrl: currentUser.profilePicUrl,
        bannerUrl: currentUser.bannerUrl,
    });
    
    const avatarUploadRef = useRef<HTMLInputElement>(null);
    const bannerUploadRef = useRef<HTMLInputElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleThemeChange = (themeKey: string) => {
        // Apply theme change immediately without navigation
        onUpdateProfile({ theme: themeKey }, false);
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, imageType: 'avatar' | 'banner') => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            const newUrl = URL.createObjectURL(file);
            if (imageType === 'avatar') {
                setFormData(prev => ({ ...prev, profilePicUrl: newUrl }));
            } else {
                setFormData(prev => ({ ...prev, bannerUrl: newUrl }));
            }
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const updatedData = {
            ...formData,
            interests: formData.interests.split(',').map(item => item.trim()).filter(Boolean),
            avatarUrl: formData.profilePicUrl, // Ensure avatarUrl is also updated
            profilePicUrl: formData.profilePicUrl
        };
        onUpdateProfile(updatedData, true); // Navigate on success
    };

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
                return <EditProfileContent />;
            case 'appearance':
                return <AppearanceContent />;
            case 'account':
                return <PlaceholderContent title="Configurações da Conta" text="Em breve, você poderá alterar seu email e senha aqui." />;
            case 'privacy':
                return <PlaceholderContent title="Configurações de Privacidade" text="Em breve, você poderá gerenciar quem vê seu perfil e suas postagens aqui." />;
            default:
                return null;
        }
    };
    
    const PlaceholderContent: React.FC<{title: string, text: string}> = ({title, text}) => (
        <div>
            <h3 className={`text-lg font-semibold ${theme.text} mb-4 border-b ${theme.panelBorder} pb-2`}>{title}</h3>
            <p className={`${theme.subtleText}`}>{text}</p>
        </div>
    );

    const AppearanceContent: React.FC = () => (
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

    const EditProfileContent: React.FC = () => {
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
        
        const SectionTitle: React.FC<{title: string}> = ({ title }) => (
             <h3 className={`text-lg font-light ${theme.subtleText} mt-6 mb-2`}>{title}</h3>
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

        const TextInput: React.FC<{name: string, value: string}> = ({ name, value }) => (
             <input
                type="text"
                name={name}
                id={name}
                value={value}
                onChange={handleChange}
                className={`w-full p-2 border ${theme.panelBorder} rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 ${theme.inputBg} ${theme.text}`}
            />
        );
        
        return (
            <form onSubmit={handleSubmit}>
                <h3 className={`text-lg font-semibold ${theme.text} mb-4 border-b ${theme.panelBorder} pb-2`}>Editar Perfil</h3>
                <SectionTitle title="Aparência do Perfil" />
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
                
                <SectionTitle title="Informações Pessoais" />
                <FormRow label="Cidade">
                    <TextInput name="city" value={formData.city} />
                </FormRow>
                <FormRow label="País">
                    <TextInput name="country" value={formData.country} />
                </FormRow>
                <FormRow label="Relacionamento">
                    <select
                        name="relationship"
                        id="relationship"
                        value={formData.relationship}
                        onChange={handleChange}
                        className={`w-full p-2 border ${theme.panelBorder} rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 ${theme.inputBg} ${theme.text}`}
                    >
                        <option>Solteiro(a)</option>
                        <option>Namorando</option>
                        <option>Casado(a)</option>
                        <option>Complicado(a)</option>
                    </select>
                </FormRow>
                <FormRow label="Ocupação">
                     <TextInput name="occupation" value={formData.occupation} />
                </FormRow>
                <FormRow label="Interesses">
                    <textarea
                        name="interests"
                        id="interests"
                        value={formData.interests}
                        onChange={handleChange}
                        className={`w-full h-24 p-2 border ${theme.panelBorder} rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 ${theme.inputBg} ${theme.text}`}
                        placeholder="Separe com vírgulas (ex: Viagens, Fotografia)"
                    />
                </FormRow>
                <div className={`flex justify-end space-x-4 pt-6 mt-4`}>
                    <button 
                        type="button" 
                        onClick={onCancel} 
                        className="bg-gray-200 text-gray-800 text-sm font-bold py-1.5 px-5 rounded-md hover:bg-gray-300"
                    >
                        Cancelar
                    </button>
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

export default SettingsPage;
