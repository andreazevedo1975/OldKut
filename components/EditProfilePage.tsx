import React, { useState, useRef } from 'react';
import type { User } from '../types';
import { THEMES } from '../App';
import { PREDEFINED_AVATARS, PREDEFINED_BANNERS } from '../constants';

interface EditProfilePageProps {
    currentUser: User;
    onUpdateProfile: (updatedData: Partial<User>) => void;
    onCancel: () => void;
    theme: { [key: string]: string };
}

const EditProfilePage: React.FC<EditProfilePageProps> = ({ currentUser, onUpdateProfile, onCancel, theme }) => {
    const [formData, setFormData] = useState({
        city: currentUser.city,
        country: currentUser.country,
        relationship: currentUser.relationship,
        occupation: currentUser.occupation,
        interests: currentUser.interests.join(', '),
        theme: currentUser.theme || 'classic',
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
        setFormData(prev => ({...prev, theme: themeKey}));
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
        };
        onUpdateProfile(updatedData);
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
        <div className={`${theme.panelBg} p-6 rounded-md border ${theme.panelBorder} shadow-sm`}>
            <h2 className={`text-xl font-light ${theme.subtleText} mb-4 border-b ${theme.panelBorder} pb-3`}>Editar meu perfil</h2>
            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto divide-y ${theme.panelBorder}">

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

                <SectionTitle title="Preferências" />
                <FormRow label="Tema do Perfil">
                    <div className="flex flex-wrap gap-3">
                        {Object.entries({classic: 'Azul Clássico', pink: 'Rosa Vibrante', green: 'Verde Sereno', dark: 'Modo Escuro'}).map(([key, name]) => (
                            <button
                                key={key}
                                type="button"
                                onClick={() => handleThemeChange(key)}
                                className={`flex items-center space-x-2 p-2 rounded-md border-2 transition-all ${formData.theme === key ? 'border-pink-500 bg-pink-50' : `border-transparent ${theme.subtleBg}`}`}
                            >
                                <div className="flex -space-x-1">
                                    <span className={`block w-5 h-5 rounded-full ${THEMES[key].bg} border-2 border-white`}></span>
                                    <span className={`block w-5 h-5 rounded-full ${THEMES[key].header} border-2 border-white`}></span>
                                </div>
                                <span className={`text-sm ${theme.text}`}>{name}</span>
                            </button>
                        ))}
                    </div>
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
        </div>
    );
};

export default EditProfilePage;