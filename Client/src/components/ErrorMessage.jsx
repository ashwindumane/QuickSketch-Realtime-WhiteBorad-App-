import React from 'react';

const ErrorMessage = ({ error }) => {
    return (
        <div className="text-red-500 flex justify-center items-center mt-10 text-2xl">Error: {error}</div>
    );
};

export default ErrorMessage;