import DataView from './DataView';

const columns = [
  {
    header: 'Team Name',
    render: (item) => item?.name || 'N/A',
  },
  {
    header: 'Team ID',
    render: (item) => item?.id || item?._id || 'N/A',
  },
];

function Teams() {
  return (
    <DataView
      title="Teams"
      subtitle="Browse active teams used across workouts and scoring."
      apiPath="/api/teams/"
      emptyMessage="No teams found."
      columns={columns}
      rowLabel={(item) => item?.name || 'Team'}
    />
  );
}

export default Teams;
