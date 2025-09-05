'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-200 via-slate-400 to-slate-600">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4 text-swatch205">Something went wrong!</h2>
        <button
          onClick={() => reset()}
          className="bg-gradient-to-r from-swatch103 to-swatch104 hover:from-swatch104 hover:to-swatch105 text-white font-bold py-2 px-4 rounded"
        >
          Try again
        </button>
      </div>
    </div>
  )
}

