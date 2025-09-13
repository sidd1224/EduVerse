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
            setError(null); // Reset error state on new fetch
            try {
                // Fetch data from our Firebase Function API endpoint
                const response = await fetch(`/vlab/api/experiments?class=${currentClass}`);
                const data = await response.json();

                if (!response.ok) {
                    // Use the error message from the backend if available
                    throw new Error(data.error || 'Network response was not ok');
                }
                
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
        // Update the URL to reflect the new class selection within the dashboard route
        navigate(`/dashboard/virtual-lab?class=${newClass}`);
    };

    if (loading) return <div className="text-center p-10 text-gray-700 font-semibold">Loading Virtual Lab...</div>;
    if (error) return <div className="text-red-500 text-center p-10">Error: {error}</div>;

    return (
        // Main container with styling that matches the light theme of the dashboard
        <div>
            <header className="mb-8">
                <h1 className="text-4xl font-bold text-gray-800">Virtual Lab</h1>
                <p className="text-gray-500">Currently viewing experiments for Class {labData?.currentClass}</p>
            </header>

            <div className="mb-8 p-4 bg-white rounded-lg shadow-md">
                <form className="flex items-center space-x-4">
                    <label htmlFor="class-select" className="font-semibold text-gray-700">Select Class:</label>
                    <select
                        name="class"
                        id="class-select"
                        className="p-2 border rounded-md bg-gray-100 border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                        <div key={subject} className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-2xl font-semibold mb-4 border-b border-gray-200 pb-2 text-gray-700">{subject}</h2>
                            <ul className="space-y-3">
                                {labData.experimentsBySubject[subject].map(exp => (
                                    <li key={exp.id} className="flex justify-between items-center p-3 rounded-md hover:bg-gray-100 transition-colors duration-200">
                                        <span className="text-lg text-gray-800">{exp.title}</span>
                                        <div className="space-x-2">
                                            {/* These links correctly open the server-rendered pages in a new tab */}
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

