import Image from 'next/image';

interface BackgroundImageProps {
    src: string;
    alt: string;
    isDesktop?: boolean;
}

const BackgroundImage: React.FC<BackgroundImageProps> = ({ src, alt, isDesktop = false }) => {
    return (
        <div className={`absolute inset-0 ${isDesktop ? 'hidden md:block' : 'md:hidden'} h-full`}>
            <Image
                src={src}
                alt={alt}
                layout="fill"
                className="object-cover h-full w-full"
                quality={50}
                priority={true}
            />
            <div className="absolute inset-0 bg-gradient-to-tl from-transparent to-black via-black/85"></div>
        </div>
    );
};

export default BackgroundImage;
