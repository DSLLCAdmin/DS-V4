import Link from 'next/link'
import { Button } from '../components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-200 via-slate-400 to-slate-600">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4 text-swatch205">Not Found</h2>
        <p className="mb-4 text-swatch205">Could not find requested resource</p>
        <Link href="/">
          <Button className="bg-gradient-to-r from-swatch103 to-swatch104 hover:from-swatch104 hover:to-swatch105 text-white font-bold py-2 px-4 rounded">
            Return Home
          </Button>
        </Link>
      </div>
    </div>
  )
}

