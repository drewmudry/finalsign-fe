import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FileText } from 'lucide-react'
function Header() {
  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            FinalSign
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <Link href="#waitlist">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Join the Waitlist
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Header