import DataView from './DataView';

const columns = [
  {
    header: 'Name',
    render: (item) => item?.name || 'N/A',
  },
  {
    header: 'Email',
    render: (item) => item?.email || 'N/A',
  },
  {
    header: 'Team',
    render: (item) => item?.team?.name || 'Unassigned',
  },
];

function Users() {
  return (
    <DataView
      title="Users"
      subtitle="View all registered users and their assigned teams."
      apiPath="/api/users/"
      emptyMessage="No users found."
      columns={columns}
      rowLabel={(item) => item?.name || item?.email || 'User'}
    />
  );
}

export default Users;
