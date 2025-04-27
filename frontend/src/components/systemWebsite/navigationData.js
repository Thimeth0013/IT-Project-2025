export const navigationData = [
  {
    id: 'customer',
    label: 'Customer Management',
    icon: 'user',
    roles: ['Customer Manager', 'Admin'], // Allow these roles
    subItems: [
      { id: 'appointments', label: 'Appointments', component: 'BookingList', roles: ['Customer Manager', 'Admin'] },
      { id: 'refunds', label: 'Refunds', component: 'RefundsComponent', roles: ['Customer Manager', 'Admin'] },
      { id: 'messages', label: 'Messages', component: 'MessagesComponent', roles: ['Customer Manager', 'Admin'] },
      { id: 'feedback', label: 'Feedback', component: 'FeedbackComponent', roles: ['Customer Manager', 'Admin'] },
      { id: 'addServices', label: 'Add Services', component: 'AddServiceForm', roles: ['Customer Manager', 'Admin'] },
    ],
  },
  {
    id: 'inventory',
    label: 'Inventory Management',
    icon: 'package',
    roles: ['Inventory Manager', 'Admin'], // Allow these roles
    subItems: [
      { id: 'all-users', label: 'All Users', component: 'AllUsersComponent', roles: ['Inventory Manager', 'Admin'] },
      { id: 'add-user', label: 'Add User', component: 'AddUserForm', roles: ['Inventory Manager', 'Admin'] },
    ],
  },
  {
    id: 'supplierm',
    label: 'Supplier Management',
    icon: 'blocks',
    roles: ['Supplier Manager', 'Admin'], // Allow these roles
    subItems: [
      { id: 'pending-orders', label: 'Pending Orders', component: 'PendingOrdersComponent', roles: ['Supplier Manager', 'Admin'] },
      { id: 'completed-orders', label: 'Completed Orders', component: 'CompletedOrdersComponent', roles: ['Supplier Manager', 'Admin'] },
    ],
  },
  {
    id: 'employee',
    label: 'Employee Management',
    icon: 'briefcase',
    roles: ['Employee Manager', 'Admin'], // Allow these roles
    subItems: [
      { id: 'pending-orders', label: 'Pending Orders', component: 'EmployeePendingOrdersComponent', roles: ['Employee Manager', 'Admin'] },
      { id: 'completed-orders', label: 'Completed Orders', component: 'EmployeeCompletedOrdersComponent', roles: ['Employee Manager', 'Admin'] },
    ],
  },
  {
    id: 'finance',
    label: 'Finance Management',
    icon: 'charts',
    roles: ['Finance Manager', 'Admin'], // Allow these roles
    subItems: [
      { id: 'pending-orders', label: 'Pending Orders', component: 'FinancePendingOrdersComponent', roles: ['Finance Manager', 'Admin'] },
      { id: 'completed-orders', label: 'Completed Orders', component: 'FinanceCompletedOrdersComponent', roles: ['Finance Manager', 'Admin'] },
    ],
  },
  {
    id: 'user',
    label: 'Suppliers',
    icon: 'truck',
    roles: ['Supplier', 'Admin'], // Allow these roles
    subItems: [
      { id: 'pending-orders', label: 'Pending Orders', component: 'SupplierPendingOrdersComponent', roles: ['Supplier', 'Admin'] },
      { id: 'completed-orders', label: 'Completed Orders', component: 'SupplierCompletedOrdersComponent', roles: ['Supplier', 'Admin'] },
    ],
  },
  {
    id: 'admin',
    label: 'User Management',
    icon: 'shield',
    roles: ['Admin'], // Allow only Admin
    subItems: [
      { id: 'add-users', label: 'Add User', component: 'AddUserForm', roles: ['Admin'] },
      { id: 'view-users', label: 'View Users', component: 'DisplayUser', roles: ['Admin'] },
    ],
  },
];