import {ReactNode} from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 prose-zinc z-50 bg-dark-blue-black-01 bg-opacity-50 flex justify-center items-center">
            <div className="bg-gray-100 rounded-lg p-6 w-11/12 md:w-2/3 lg:w-1/2">
                <button
                    onClick={onClose}
                    className="float-right text-gray-600 hover:text-gray-800 focus:outline-none"
                >
                    &times;
                </button>
                {children}
            </div>
        </div>
    );
}