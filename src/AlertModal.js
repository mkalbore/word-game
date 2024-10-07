// AlertModal.js
import React from "react";

const AlertModal = ({ message, onClose }) => {
	return (
		<div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
			<div className='bg-white p-6 rounded-lg shadow-lg'>
				<p className='text-lg text-red-600'>{message}</p>
				<button
					onClick={onClose}
					className='mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600'>
					Close
				</button>
			</div>
		</div>
	);
};

export default AlertModal;
