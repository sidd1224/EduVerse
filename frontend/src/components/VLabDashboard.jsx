import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const VLabDashboard = () => {
    const [labData, setLabData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const location = useLocation();
    const navigate = useNavigate();

    const queryParams = new URLSearchParams(location.search);
    const currentClass = queryParams.get('class') || '8';

    useEffect(() => {
        const fetchExperiments = async () => {
            setLoading(true);
            try {
                // Fetch data from our new Firebase Function API endpoint
                const response = await fetch(`/vlab/api/experiments?class=${currentClass}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setLabData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchExperiments();
    }, [currentClass]);

    const handleClassChange = (e) => {
        const newClass = e.target.value;
        navigate(`/virtual-lab?class=${newClass}`);
    };

    if (loading) return <div className="text-white text-center p-10">Loading Virtual Lab...</div>;
    if (error) return <div className="text-red-500 text-center p-10">Error: {error}</div>;

    return (
        <div className="container mx-auto p-8 text-white">
            <header className="mb-8">
                <h1 className="text-4xl font-bold">Virtual Lab</h1>
                <p className="text-gray-400">Currently viewing experiments for Class {labData?.currentClass}</p>
            </header>

            <div className="mb-8 p-4 bg-gray-800 rounded-lg shadow">
                <form className="flex items-center space-x-4">
                    <label htmlFor="class-select" className="font-semibold">Select Class:</label>
                    <select
                        name="class"
                        id="class-select"
                        className="p-2 border rounded-md bg-gray-700 border-gray-600"
                        value={currentClass}
                        onChange={handleClassChange}
                    >
                        {labData?.availableClasses.map(cls => (
                            <option key={cls} value={cls}>{cls}</option>
                        ))}
                    </select>
                </form>
            </div>

            <div className="space-y-8">
                {labData && Object.keys(labData.experimentsBySubject).map(subject => (
                    labData.experimentsBySubject[subject].length > 0 && (
                        <div key={subject} className="bg-gray-800 bg-opacity-60 p-6 rounded-lg shadow-md">
                            <h2 className="text-2xl font-semibold mb-4 border-b border-gray-700 pb-2">{subject}</h2>
                            <ul className="space-y-3">
                                {labData.experimentsBySubject[subject].map(exp => (
                                    <li key={exp.id} className="flex justify-between items-center p-3 rounded-md hover:bg-gray-700">
                                        <span className="text-lg">{exp.title}</span>
                                        <div className="space-x-2">
                                            <a href={`/vlab/run/${exp.id}`} target="_blank" rel="noopener noreferrer" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition">Run</a>
                                            <a href={`/vlab/theory/${exp.id}`} target="_blank" rel="noopener noreferrer" className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition">Theory</a>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )
                ))}
            </div>
        </div>
    );
};

export default VLabDashboard;
