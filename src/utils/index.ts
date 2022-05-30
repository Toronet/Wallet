export function nCommaSeparator(num:number):string|null{
    if(!num) return null;
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}