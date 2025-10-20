import React, { useState } from 'react';
import type { User } from '../types';

interface EditProfilePageProps {
    currentUser: User;
    onUpdateProfile: (updatedData: Partial<User>) => void;
    onCancel: () => void;
}

const EditProfilePage: React.FC<EditProfilePageProps> = ({ currentUser, onUpdateProfile, onCancel }) => {
    const [formData, setFormData] = useState({
        city: currentUser.city,
        country: currentUser.country,
        relationship: currentUser.relationship,
        occupation: currentUser.occupation,
        interests: currentUser.interests.join(', '), // Edit interests as a comma-separated string
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

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
            <label className="text-sm font-semibold text-gray-700 md:text-right md:pr-4">{label}:</label>
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
            className="w-full p-2 border border-gray-400 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-[#3366CC]"
        />
    );


    return (
        <div className="bg-white p-6 rounded-md border border-gray-300 shadow-sm">
            <h2 className="text-xl font-light text-gray-600 mb-6 border-b pb-3">Editar meu perfil</h2>
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
                        className="w-full p-2 border border-gray-400 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-[#3366CC]"
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
                        className="w-full h-24 p-2 border border-gray-400 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-[#3366CC]"
                        placeholder="Separe com vírgulas (ex: Viagens, Fotografia)"
                    />
                </FormRow>

                <div className="flex justify-end space-x-4 pt-4 border-t mt-6">
                    <button 
                        type="button" 
                        onClick={onCancel} 
                        className="bg-gray-200 text-gray-800 text-sm font-bold py-1.5 px-5 rounded-md hover:bg-gray-300"
                    >
                        Cancelar
                    </button>
                    <button 
                        type="submit" 
                        className="bg-[#ED008C] text-white text-sm font-bold py-1.5 px-5 rounded-md hover:bg-[#D4007C]"
                    >
                        Salvar Alterações
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditProfilePage;