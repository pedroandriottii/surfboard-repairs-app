import React from 'react';
import Image from 'next/image';

const Footer: React.FC = () => {
    return (
        <div className="bg-realce-bg w-full flex flex-col items-center gap-4 p-4 relative z-10">
            <p className="text-realce font-bold">Visite nossa loja!</p>
            <a href="https://maps.app.goo.gl/ZCcjUhyGsoxS9TUA6" target='_blank' className="underline text-white text-center">
                Av. Pres. Castelo Branco, 8159, Jaboatão dos Guararapes
            </a>
            <div className="flex items-center gap-4">
                <a href="https://api.whatsapp.com/send?phone=5581988145906" target='_blank'>
                    <div className="relative w-[30px] h-[30px]">
                        <Image
                            src={'/whats_footer.svg'}
                            alt="Whatsapp Realce Nordeste"
                            fill
                            sizes="(max-width: 768px) 30px, 30px"
                            className="object-contain"
                        />
                    </div>
                </a>
                <a href="https://www.instagram.com/realce.nordeste/" target='_blank'>
                    <div className="relative w-[30px] h-[30px]">
                        <Image
                            src={'/insta_footer.svg'}
                            alt="Instagram Realce Nordeste"
                            fill
                            sizes="(max-width: 768px) 30px, 30px"
                            className="object-contain"
                        />
                    </div>
                </a>
            </div>
        </div>
    );
};

export default Footer;
