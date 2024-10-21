import Image from 'next/image';

interface BackgroundImageProps {
    src: string;
    alt: string;
    isDesktop?: boolean;
}

const BackgroundImage: React.FC<BackgroundImageProps> = ({ src, alt, isDesktop = false }) => {
    return (
        <div className={`absolute inset-0 ${isDesktop ? 'hidden md:block' : 'md:hidden'} h-full w-full`}>
            <Image
                src={src}
                alt={alt}
                fill
                className="object-cover"
                quality={50}
                priority={true}
                sizes="(max-width: 768px) 100vw, (min-width: 769px) 100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-tl from-transparent to-black via-black/85"></div>
        </div>
    );
};

export default BackgroundImage;
