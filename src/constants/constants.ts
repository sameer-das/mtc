import { SelectType } from "../Models/models";

export const TRANSACTION_REMARKS = [
    { label: 'Full Amount Received', value: 1 },
    { label: 'Partial Amount Received', value: 2 },
    { label: 'Landlord not available', value: 3 },
    { label: 'Asked to come later', value: 4 },
    { label: 'Will pay in 1-2 days', value: 5 },
    { label: 'Door locked', value: 6 },
    { label: 'Conflict in tax amount', value: 7 },
    { label: 'Others', value: 8 },
]

export const SALUTATION_OPTIONS: SelectType[] = [
    { label: 'Mr.', value: 'Mr.' },
    { label: 'Mrs.', value: 'Mrs.' },
    { label: 'Miss', value: 'Miss' },
];

export const GENDER_OPTIONS: SelectType[] = [
    { label: 'Male', value: 'M' },
    { label: 'Female', value: 'F' },
    { label: 'Others', value: 'O' },
];

export const CAREOF_OPTIONS: SelectType[] = [
    { label: 'S/O', value: 'S/o' },
    { label: 'W/O', value: 'W/o' },
    { label: 'D/O', value: 'D/o' },
];