// components/ManageDoctors.tsx
"use client"
import React, { useState, useEffect } from 'react';
import { databases, DATABASE_ID, DOCTOR_COLLECTION_ID } from '@/lib/appwrite.config';
import { Query, ID } from 'node-appwrite';
import { assignDoctorToOrganization } from '@/lib/actions/organizationDoctor.actions';

const ManageDoctors = ({ organizationId }: { organizationId: string }) => {
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctors, setSelectedDoctors] = useState<string[]>([]);
    const [newDoctor, setNewDoctor] = useState({
        name: '',
        specialization: '',
        // Adaugă alte câmpuri necesare
    });

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await databases.listDocuments(
                    DATABASE_ID!,
                    DOCTOR_COLLECTION_ID!
                );
                setDoctors(response.documents);
            } catch (error) {
                console.error('Error fetching doctors:', error);
            }
        };

        fetchDoctors();
    }, []);

    const handleDoctorSelection = (doctorId: string) => {
        if (selectedDoctors.includes(doctorId)) {
            setSelectedDoctors(selectedDoctors.filter((id) => id !== doctorId));
        } else {
            setSelectedDoctors([...selectedDoctors, doctorId]);
        }
    };

    const handleAssignDoctors = async () => {
        for (const doctorId of selectedDoctors) {
            await assignDoctorToOrganization(doctorId, organizationId);
        }
        setSelectedDoctors([]);
        // Reîmprospătează lista de doctori sau afișează un mesaj de succes
    };

    const handleNewDoctorChange = (e: any) => {
        setNewDoctor({ ...newDoctor, [e.target.name]: e.target.value });
    };

    const handleCreateDoctor = async () => {
        try {
            await databases.createDocument(
                DATABASE_ID!,
                DOCTOR_COLLECTION_ID!,
                ID.unique(),
                { ...newDoctor, organizationId: organizationId }
            );
            // Reîmprospătează lista de doctori
            const response = await databases.listDocuments(DATABASE_ID!, DOCTOR_COLLECTION_ID!);
            setDoctors(response.documents);
            setNewDoctor({ name: '', specialization: '' }); // Resetează formularul
        } catch (error) {
            console.error('Error creating doctor:', error);
        }
    };

    return (
        <div>
            <h2>Manage Doctors</h2>
            <div>
                <h3>Add Existing Doctors</h3>
                <ul>
                    {doctors.map((doctor) => (
                        <li key={doctor.$id}>
                            <input
                                type="checkbox"
                                checked={selectedDoctors.includes(doctor.$id)}
                                onChange={() => handleDoctorSelection(doctor.$id)}
                            />
                            {doctor.name} ({doctor.specialization})
                        </li>
                    ))}
                </ul>
                <button onClick={handleAssignDoctors}>Assign Selected Doctors</button>
            </div>
            <div>
                <h3>Add New Doctor</h3>
                <input type="text" name="name" placeholder="Name" value={newDoctor.name} onChange={handleNewDoctorChange} />
                <input type="text" name="specialization" placeholder="Specialization" value={newDoctor.specialization} onChange={handleNewDoctorChange} />
                {/* Adaugă alte câmpuri necesare */}
                <button onClick={handleCreateDoctor}>Create Doctor</button>
            </div>
        </div>
    );
};

export default ManageDoctors;