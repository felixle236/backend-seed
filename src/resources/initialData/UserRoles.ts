export default function getUserRoles(): {isRequired: boolean, data: any}[] {
    return [
        {isRequired: true, data: {email: 'admin@gmail.com', roles: ['Administrator']}},
        {isRequired: false, data: {email: 'felix.le.236@gmail.com', roles: ['Product Manager']}},
    ];
}
