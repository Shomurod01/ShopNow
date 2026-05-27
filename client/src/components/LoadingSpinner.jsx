const LoadingSpinner = ({ size = 'md', fullPage = false }) => {
    const sizes = { sm: 'h-4 w-4', md: 'h-8 w-8', lg: 'h-12 w-12' };
  const spinner = (
    <div className={`animate-spin rounded-full border-4 border-blue-200 border-t-blue-600 ${sizes[size]}`} />
  );
     if (fullPage) {
     return <div className="min-h-screen flex items-center justify-center">{spinner}</div>;
  }
     return <div className="flex justify-center py-8">{spinner}</div>;
};

 export default LoadingSpinner;
