const Button = ({ children }) => {
    return (
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
            {children}
        </button>
    );
};

export default Button;