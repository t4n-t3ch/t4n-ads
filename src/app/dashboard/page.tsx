import { getUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import AdCard from '@/components/AdCard'

// Mock data - in a real app this would come from an API
const mockAds = [
  { id: '1', title: 'Gaming Laptop', price: 1200, image: '/laptop.jpg' },
  { id: '2', title: 'iPhone 15 Pro', price: 999, image: '/iphone.jpg' },
  { id: '3', title: 'Mountain Bike', price: 450, image: '/bike.jpg' },
  { id: '4', title: 'Coffee Table', price: 150, image: '/table.jpg' },
]

export default async function DashboardPage() {
  const user = await getUser()
  
  if (!user) {
    redirect('/login')
  }

  const ads = mockAds

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-400">Welcome back, {user.email}!</p>
          </div>
          <Link
            href="/ads/create"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            + Create New Ad
          </Link>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Your Ads</h2>
          {ads.length === 0 ? (
            <div className="bg-gray-800 rounded-xl p-8 text-center">
              <p className="text-gray-400 mb-4">You haven't created any ads yet.</p>
              <Link
                href="/ads/create"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
              >
                Create Your First Ad
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {ads.map((ad) => (
                <AdCard
                  key={ad.id}
                  id={ad.id}
                  title={ad.title}
                  price={ad.price}
                  image={ad.image}
                />
              ))}
            </div>
          )}
        </div>

        <div className="bg-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Dashboard Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-gray-400">Total Ads</p>
              <p className="text-2xl font-bold">{ads.length}</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-gray-400">Active Ads</p>
              <p className="text-2xl font-bold">{ads.length}</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-gray-400">Total Value</p>
              <p className="text-2xl font-bold">${ads.reduce((sum, ad) => sum + ad.price, 0)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}