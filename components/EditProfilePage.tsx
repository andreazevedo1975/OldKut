import React, { useState } from 'react';
import type { User } from '../types';
import { THEMES } from '../App';

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
        interests: currentUser.interests.join(', '), // Edit interests as a comma-separated string
        theme: currentUser.theme || 'classic',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleThemeChange = (themeKey: string) => {
        setFormData(prev => ({...prev, theme: themeKey}));
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const updatedData = {
            ...formData,
            interests: formData.interests.split(',').map(item => item.trim()).filter(Boolean),
        };
        onUpdateProfile(updatedData);
    };
    
    const FormRow: React.FC<{label: string, children: React.ReactNode}> = ({ label, children }) => (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
            <label className={`text-sm font-semibold ${theme.subtleText} md:text-right md:pr-4`}>{label}:</label>
            <div className="md:col-span-2">
                {children}
            </div>
        </div>
    );

    const TextInput: React.FC<{name: string, value: string}> = ({ name, value }) => (
         <input
            type="text"
            name={name}
            id={name}
            value={value}
            onChange={handleChange}
            className={`w-full p-2 border ${theme.panelBorder} rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-[#3366CC] ${theme.bg === 'bg-gray-800' ? 'bg-gray-600 text-white' : ''}`}
        />
    );


    return (
        <div className={`${theme.panelBg} p-6 rounded-md border ${theme.panelBorder} shadow-sm`}>
            <h2 className={`text-xl font-light ${theme.subtleText} mb-6 border-b ${theme.panelBorder} pb-3`}>Editar meu perfil</h2>
            <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto">
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
                        className={`w-full p-2 border ${theme.panelBorder} rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-[#3366CC] ${theme.bg === 'bg-gray-800' ? 'bg-gray-600 text-white' : ''}`}
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
                        className={`w-full h-24 p-2 border ${theme.panelBorder} rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-[#3366CC] ${theme.bg === 'bg-gray-800' ? 'bg-gray-600 text-white' : ''}`}
                        placeholder="Separe com vírgulas (ex: Viagens, Fotografia)"
                    />
                </FormRow>

                <FormRow label="Tema do Perfil">
                    <div className="flex flex-wrap gap-3">
                        {Object.entries({classic: 'Azul Clássico', pink: 'Rosa Vibrante', green: 'Verde Sereno', dark: 'Modo Escuro'}).map(([key, name]) => (
                            <button
                                key={key}
                                type="button"
                                onClick={() => handleThemeChange(key)}
                                className={`flex items-center space-x-2 p-2 rounded-md border-2 ${formData.theme === key ? 'border-blue-500' : `border-transparent ${theme.panelBorder}`}`}
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

                <div className={`flex justify-end space-x-4 pt-4 border-t ${theme.panelBorder} mt-6`}>
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