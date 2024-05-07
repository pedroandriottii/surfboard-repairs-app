import { Navbar } from "./_components/navbar";
import { FaWhatsapp } from 'react-icons/fa';

interface ProtectedLayoutProps {
    children: React.ReactNode;
}

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {

    const phoneNumber = '5581988145906'
    const whatsappLink = `https://api.whatsapp.com/send?phone=${phoneNumber}`

    return (
        <body className="bg-realce-background w-full h-full">
            <Navbar />
            {children}
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="fixed bottom-4 right-4 z-50 flex items-center justify-center w-16 h-16 bg-green-600 text-white rounded-full hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 shadow-lg">
                <FaWhatsapp size={30} />
            </a>
        </body>
    )
}

export default ProtectedLayout