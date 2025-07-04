import React, { useState } from "react";
import axios from "axios";

const Certificate = ({ userId, courseId, userName, courseName }) => {
    const [certificateUrl, setCertificateUrl] = useState(null);
    const [loading, setLoading] = useState(false);

    const generateCertificate = async () => {
        setLoading(true);
        try {
            const BASE_URL = import.meta.env.VITE_BASE_URL;
            const response = await axios.post(`${BASE_URL}/api/v1/certificate/generate`, {
                userId,
                courseId,
                userName,
                courseName,
            }, { withCredentials: true });

            setCertificateUrl(`${BASE_URL}${response.data.certificateUrl}`);
        } catch (error) {
            console.error("Error generating certificate:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="text-center p-4 border rounded shadow-lg">
            <h2 className="text-xl font-bold">Course Completion Certificate</h2>
            <button
                onClick={generateCertificate}
                disabled={loading}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            >
                {loading ? "Generating..." : "Get Certificate"}
            </button>

            {certificateUrl && (
                <div className="mt-4">
                    <p>Download your certificate:</p>
                    <a href={certificateUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                        Download Certificate
                    </a>
                </div>
            )}
        </div>
    );
};

export default Certificate;