import Link from 'next/link';
import Logo from './logo';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Company */}
                    <div>
                        <div className="flex items-center space-x-2 mb-4">
                            <Logo forceText={true} />
                        </div>
                        <p className="text-gray-400 text-sm">
                            The trust-first freelance marketplace connecting verified professionals with quality clients.
                        </p>
                    </div>

                    {/* For Clients */}
                    <div>
                        <h3 className="font-semibold mb-4">For Clients</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link href="/explore" className="hover:text-white">Find Freelancers</Link></li>
                            <li><Link href="/post-job" className="hover:text-white">Post a Job</Link></li>
                            <li><Link href="#" className="hover:text-white">How it Works</Link></li>
                            <li><Link href="#" className="hover:text-white">Success Stories</Link></li>
                        </ul>
                    </div>

                    {/* For Freelancers */}
                    <div>
                        <h3 className="font-semibold mb-4">For Freelancers</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link href="/offer-service" className="hover:text-white">Offer Services</Link></li>
                            <li><Link href="/explore" className="hover:text-white">Find Work</Link></li>
                            <li><Link href="#" className="hover:text-white">Freelancer Tips</Link></li>
                            <li><Link href="#" className="hover:text-white">Community</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="font-semibold mb-4">Support</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link href="#" className="hover:text-white">Help Center</Link></li>
                            <li><Link href="#" className="hover:text-white">Trust & Safety</Link></li>
                            <li><Link href="#" className="hover:text-white">Contact Us</Link></li>
                            <li><Link href="#" className="hover:text-white">Privacy Policy</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-400 text-sm">
                        © 2025 AfroTask. All rights reserved.
                    </p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <span className="text-gray-400 text-sm">Trusted by:</span>
                        <div className="flex space-x-4 text-gray-500 text-sm">
                            <span>Meta</span>
                            <span>Google</span>
                            <span>Netflix</span>
                            <span>PayPal</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
