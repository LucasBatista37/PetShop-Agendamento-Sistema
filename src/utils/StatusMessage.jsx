export default function StatusMessage({
  loading = false,
  error = null,
  loadingMessage = "Carregando...",
  className = "",
}) {
  if (loading) {
    return (
      <p className={`text-gray-500 text-center ${className}`}>
        {loadingMessage}
      </p>
    );
  }

  if (error) {
    return (
      <p className={`text-red-600 text-center ${className}`}>
        {error}
      </p>
    );
  }

  return null; 
}
