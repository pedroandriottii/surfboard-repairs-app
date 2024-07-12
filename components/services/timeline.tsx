import React from 'react';

interface TimelineProps {
    nowTime?: Date;
    readyTime?: Date;
    deliveredTime?: Date;
    maxTime?: Date;
}

const Timeline: React.FC<TimelineProps> = ({ nowTime, readyTime, deliveredTime, maxTime }) => {
    return (
        <div className="relative flex flex-col md:flex-row items-start p-4 md:items-center md:gap-24 md:text-center">
            <div className="flex items-center mb-4 md:mb-0 md:flex-col md:items-center md:relative">
                <div className="w-6 h-6 rounded-full bg-realce mr-4 md:mr-0 md:mb-2 relative z-10"></div>
                <div>
                    <h3 className="text-lg font-bold text-realce">Início do Serviço</h3>
                    <p className="text-sm text-white">{nowTime ? new Date(nowTime).toLocaleDateString() : 'N/A'}</p>
                </div>
                <div className={`absolute left-7 top-10 bottom-28 border-l-2 md:hidden ${readyTime ? 'border-realce' : 'border-white'}`}></div>
                <div className={`absolute hidden md:block md:top-3 md:left-20 md:w-52 border-t-4 ${readyTime ? 'border-realce' : 'border-white'}`}></div>
            </div>

            <div className="flex items-center mb-4 md:mb-0 md:flex-col md:items-center md:relative">
                <div className={`w-6 h-6 rounded-full mr-4 md:mr-0 md:mb-2 relative z-10 ${readyTime ? 'bg-realce' : 'bg-white'}`}></div>
                <div>
                    <h3 className={`text-lg font-bold ${readyTime ? 'text-realce' : 'text-white'}`}>Pronto</h3>
                    <p className="text-sm text-white">{readyTime ? new Date(readyTime).toLocaleDateString() : 'N/A'}</p>
                </div>
                <div className={`absolute left-7 top-24 bottom-12 border-l-2 md:hidden ${deliveredTime ? 'border-realce' : 'border-white'}`}></div>
                <div className={`absolute hidden md:block md:top-3 md:left-8 md:w-48 border-t-4 ${deliveredTime ? 'border-realce' : 'border-white'}`}></div>
            </div>

            <div className="flex items-center mb-4 md:mb-0 md:flex-col md:items-center md:relative">
                <div className={`w-6 h-6 rounded-full mr-4 md:mr-0 md:mb-2 relative z-10 ${deliveredTime ? 'bg-realce' : 'bg-white'}`}></div>
                <div>
                    <h3 className={`text-lg font-bold ${deliveredTime ? 'text-realce' : 'text-white'}`}>Entregue</h3>
                    <p className="text-sm text-white">{deliveredTime ? new Date(deliveredTime).toLocaleDateString() : 'N/A'}</p>
                </div>
                <div className={`absolute hidden md:block md:top-3 md:left-8 md:w-52 border-t-4 ${deliveredTime ? 'border-realce' : 'border-white'}`}></div>
            </div>

            <div className="flex items-center mb-4 md:mb-0 md:flex-col md:items-center md:relative">
                <div className={`w-6 h-6 rounded-full mr-4 md:mr-0 md:mb-2 relative z-10 ${deliveredTime ? 'bg-green-600' : 'bg-white'}`}></div>
                <div>
                    <h3 className={`text-lg font-bold text-realce ${deliveredTime ? 'text-green-400' : 'text-green-400'}`}>Prazo Máximo</h3>
                    <p className="text-sm text-white">{maxTime ? new Date(maxTime).toLocaleDateString() : 'N/A'}</p>
                </div>
            </div>
        </div>
    );
};

export default Timeline;
