export const listImages = (type: string) => {
    if (type === 'house') {
        return [
            {name: 'Bathroom.jpg', alt: 'Bathroom'},
            {name: 'Bathroom2.jpg', alt: 'Bathroom'},
            {name: 'Bathroom4.jpg', alt: 'Bathroom'},
            {name: 'Hall.jpg', alt: 'Hall'},
            {name: 'Hall2.jpg', alt: 'Hall'},
            {name: 'Kitchen.png', alt: 'Kitchen'},
            {name: 'Kitchen2.jpg', alt: 'Kitchen'},
            {name: 'Kitchen4.jpg', alt: 'Kitchen'},
            {name: 'Kitchen5.jpg', alt: 'Kitchen'}
        ]
    }
    else if (type === 'blue') {
        return [
            {name: 'BlueRoom.jpg', alt: 'Bedroom N.1'},
            {name: 'BlueRoom1.jpg', alt: 'Bedroom N.1'},
            {name: 'BlueRoom2.jpg', alt: 'Bedroom N.1'},
            {name: 'BlueRoom3.jpg', alt: 'Bedroom N.1'}
        ]
    }
    else if (type === 'red') {
        return [
            {name: 'RedRoom4.jpg', alt: 'Bedroom N.2'},
            {name: 'RedRoom5.jpeg', alt: 'Bedroom N.2'},
            {name: 'RedRoom6.jpeg', alt: 'Bedroom N.2'}
        ]
    }
    else if (type === 'green') {
        return [
            {name: 'Green Room .jpg', alt: 'Bedroom N.3'},
            {name: 'GreenRoom1.jpg', alt: 'Bedroom N.3'},
            {name: 'GreenRoom3.jpg', alt: 'Bedroom N.3'},
            {name: 'GreenRoom4.jpg', alt: 'Bedroom N.3'},
            {name: 'GreenRoom5.jpeg', alt: 'Bedroom N.3'}
        ]
    }
    else if (type === 'out') {
        return [
            {name: 'Out7.png', alt: 'Outside of the house'},
            {name: 'Out10.png', alt: 'Outside of the house'},
            {name: 'Out12.jpeg', alt: 'Outside of the house'},
            {name: 'Out13.jpeg', alt: 'Outside of the house'},
            {name: 'Out14.jpeg', alt: 'Outside of the house'},
            {name: 'Out15.jpeg', alt: 'Outside of the house'}
        ]
    }
    else if (type === 'garden') {
        return [
            {name: 'Jacuzzi.png', alt: 'Jacuzzi'},
            {name: 'Jacuzzi1.png', alt: 'Jacuzzi'},
            {name: 'Out1.jpg', alt: 'Garden'},
            {name: 'Out3.jpg', alt: 'Garden'},
            {name: 'Out4.jpg', alt: 'Garden'},
            {name: 'Out11.jpg', alt: 'Garden'},
            {name: 'Out16.jpeg', alt: 'Garden'},
            {name: 'Out17.jpg', alt: 'Garden'}
        ]
    }
    return []
}