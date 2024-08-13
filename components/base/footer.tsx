import React from 'react';
import Image from 'next/image';

const Footer: React.FC = () => {
    return (
        <div className="bg-black w-full flex flex-col items-center gap-4 p-4">
            <p className="text-realce font-bold">Visite nossa loja!</p>
            <a href="https://maps.app.goo.gl/ZCcjUhyGsoxS9TUA6" target='__blank' className="underline text-white text-center">
                Av. Pres. Castelo Branco, 8159, Jaboatão dos Guararapes
            </a>
            <div className="flex items-center gap-4">
                <a href="https://api.whatsapp.com/send?phone=5581988145906" target='__blank'>
                    <Image
                        src={'/whats_footer.svg'}
                        alt="Whatsapp Realce Nordeste"
                        width={30}
                        height={30}
                    />
                </a>
                <a href="https://www.instagram.com/realce.nordeste/" target='__blank'>
                    <Image
                        src={'/insta_footer.svg'}
                        alt="Instagram Realce Nordeste"
                        width={30}
                        height={30}
                    />
                </a>
            </div>
        </div>
    );
};

export default Footer;
