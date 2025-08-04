export function GenerateButton({ onClick, loading }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="mt-6 px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
    >
      {loading ? "Generating..." : "Generate Commits"}
    </button>
  );
}
