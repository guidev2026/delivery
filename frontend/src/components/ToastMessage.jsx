export default function ToastMessage({ message, type = 'success', onClose }) {
  if (!message) return null;

  const isSuccess = type === 'success';
  const isWarning = type === 'warning';

  let bgColor, borderColor, iconColor, icon, label;
  
  if (isSuccess) {
    bgColor = 'bg-success-bg';
    borderColor = 'border-success/40';
    iconColor = 'text-success';
    icon = (
      <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    );
    label = 'Sucesso';
  } else if (isWarning) {
    bgColor = 'bg-amber-accent-subtle';
    borderColor = 'border-amber-accent/40';
    iconColor = 'text-amber-accent';
    icon = (
      <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    );
    label = 'Atenção';
  } else {
    bgColor = 'bg-error-bg';
    borderColor = 'border-error/40';
    iconColor = 'text-error';
    icon = (
      <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
    );
    label = 'Erro';
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-toast-in">
      <div className={`flex items-start gap-3 px-4 py-3.5 rounded-xl border ${bgColor} ${borderColor} backdrop-blur-md shadow-2xl min-w-[280px] max-w-[420px]`}>
        <span className={`flex-shrink-0 ${iconColor}`}>{icon}</span>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-surface-300 mb-0.5">{label}</p>
          <p className={`text-sm font-medium ${type === 'success' ? 'text-success' : type === 'warning' ? 'text-amber-accent-light' : 'text-error'}`}>
            {message}
          </p>
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 text-surface-400 hover:text-surface-200 transition-colors p-0.5"
        >
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
}