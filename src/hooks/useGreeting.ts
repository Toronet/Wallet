import React from 'react'

const useGreeting = ():string[] => {
    const [greeting, setGreeting] = React.useState<string>('');

    React.useEffect(() => {
        getHour();
    },[]);

    const getHour = () => {
        const date = new Date();
        const hour = date.getHours();

        if(hour < 12) {
            setGreeting('Good Morning');
            return;
        }
        else if (hour >= 12 && hour <= 15){
            setGreeting('Good Afternoon');
            return;
        }
        else if (hour >= 16 && hour <= 20){
            setGreeting('Good Evening');
            return;
        }
        else if (hour >= 21) {
            setGreeting('Good Night');
            return;
        }
    };

    return [greeting];
}

export default useGreeting;
