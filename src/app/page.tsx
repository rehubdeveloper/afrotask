import { Search } from 'lucide-react';
import PopularServices from './components/PopularServices';
import Features from './components/features';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import VibeCodingHero from './components/vibeCodingHero';
import Portfolio from './components/portfolio';

export default function Home() {
  return (
    <>
      <div className="relative min-h-screen">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/bg.jpg')", filter: 'blur(4px)' }}></div>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 text-center text-white">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold">
            Our verified freelancers
          </h1>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-green-400 mt-2">
            will take it from here
          </h1>
          <p className="mt-6 text-base sm:text-lg max-w-2xl mx-auto">
            Connect with trusted professionals in a marketplace that prioritizes
            verification, quality, and security for every project.
          </p>

          <div className="mt-8 max-w-xl mx-auto flex items-center bg-white/20 rounded-full shadow-sm overflow-hidden">
            <div className="pl-4">
              <Search className="text-white/80" />
            </div>
            <input
              type="text"
              placeholder="Search for any service..."
              className="flex-grow p-3 bg-transparent focus:outline-none placeholder-white/80"
            />
            <button className="bg-green-500 flex justify-center text-white font-bold p-2 md:py-3 md:px-8 rounded-full hover:bg-green-600 transition-colors">
              <p className='hidden md:block'>Search</p>
              <Search className='md:hidden' />
            </button>
          </div>

          <div className="mt-8 flex items-center justify-center flex-wrap gap-2">
            <span className="font-semibold">Popular:</span>
            <button className="px-4 py-2 text-sm border border-white/50 rounded-full hover:bg-white/20 transition-colors">
              website development
            </button>
            <button className="px-4 py-2 text-sm border border-white/50 rounded-full hover:bg-white/20 transition-colors">
              logo design
            </button>
            <button className="px-4 py-2 text-sm border border-white/50 rounded-full hover:bg-white/20 transition-colors">
              video editing
            </button>
            <button className="px-4 py-2 text-sm border border-white/50 rounded-full hover:bg-white/20 transition-colors">
              content writing
            </button>
            <button className="px-4 py-2 text-sm border border-white/50 rounded-full hover:bg-white/20 transition-colors">
              SEO
            </button>
          </div>

          <div className="mt-16">
            <p className="text-white/80">Trusted by:</p>
            <div className="mt-4 flex justify-center items-center gap-8 sm:gap-12 flex-wrap">
              <span className="text-white/80 font-semibold text-lg">Meta</span>
              <span className="text-white/80 font-semibold text-lg">Google</span>
              <span className="text-white/80 font-semibold text-lg">Netflix</span>
              <span className="text-white/80 font-semibold text-lg">PayPal</span>
              <span className="text-white/80 font-semibold text-lg">Payoneer</span>
            </div>
          </div>
        </div>
      </div>
      <PopularServices />
      <div className="px-8">
        <VibeCodingHero />
      </div>
      <Portfolio />
      <Features />
      {/* CTA Section */}
      <section className="py-20 bg-green-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to get started?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Join thousands of verified professionals and trusted clients on AfroTask
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="cursor-pointer bg-white text-green-500 hover:bg-gray-100 px-8 py-3">
                Join as a Client
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="lg" variant="outline" className="cursor-pointer border-white text-black hover:bg-white hover:text-green-500 px-8 py-3">
                Become a Freelancer
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
