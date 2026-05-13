export default function ToastMessage({ message, type = 'success', onClose }) {
  if (!message) return null;

  const isSuccess = type === 'success';
  const bgColor = isSuccess ? 'bg-success-bg border-success/30' : 'bg-error-bg border-error/30';
  const iconColor = isSuccess ? 'text-success' : 'text-error';
  const textColor = isSuccess ? 'text-success' : 'text-error';
  const icon = isSuccess ? '✓' : '✕';

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-toast-in">
      <div className={`flex items-center gap-3 px-5 py-3 rounded-lg border ${bgColor} backdrop-blur-sm shadow-lg`}>
        <span className={`text-lg font-bold ${iconColor}`}>{icon}</span>
        <span className={`text-sm font-medium ${textColor}`}>{message}</span>
        <button
          onClick={onClose}
          className={`ml-2 text-sm opacity-60 hover:opacity-100 transition-opacity ${textColor}`}
        >
          ✕
        </button>
      </div>
    </div>
  );
}