import { useStore } from '../store/useStore';
import { useState } from 'react';

const API_BASE = 'http://localhost:3001';

export function usePersistence() {
    const { sequencerGrid, bpm } = useStore();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const saveProject = async (name: string) => {
        setIsLoading(true);
        setError(null);
        try {
            // In a real app we'd get the token from auth store
            const token = localStorage.getItem('beatpad_token');

            const response = await fetch(`${API_BASE}/projects`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name,
                    bpm,
                    data: { sequencerGrid },
                    isPublic: false
                })
            });

            if (!response.ok) throw new Error('Failed to save project');

            return await response.json();
        } catch (err: any) {
            setError(err.message);
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const loadProjects = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('beatpad_token');
            const response = await fetch(`${API_BASE}/projects`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to load projects');
            return await response.json();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return { saveProject, loadProjects, isLoading, error };
}
