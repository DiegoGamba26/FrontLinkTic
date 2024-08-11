export interface IGetReservation {
    message: string;
    data: Reservation[];
}

export interface Reservation {
    reservationId: number;
    customerId: number;
    serviceId: number;
    reservationDate: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    customer: Customer;
    service: Service;
}

export interface Customer {
    customerId: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    createdAt: string;
    updatedAt: string;
}

export interface Service {
    serviceId: number;
    serviceName: string;
    description: string;
    price: number;
    duration: number;
    createdAt: string;
    updatedAt: string;
}
