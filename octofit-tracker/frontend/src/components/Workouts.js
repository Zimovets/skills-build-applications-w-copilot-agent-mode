import DataView from './DataView';

const columns = [
  {
    header: 'Workout',
    render: (item) => item?.name || 'N/A',
  },
  {
    header: 'Description',
    render: (item) => item?.description || 'N/A',
  },
  {
    header: 'Suggested Teams',
    render: (item) => {
      if (!Array.isArray(item?.suggested_for) || item.suggested_for.length === 0) {
        return 'None';
      }

      return item.suggested_for
        .map((team) => team?.name)
        .filter(Boolean)
        .join(', ');
    },
  },
];

function Workouts() {
  return (
    <DataView
      title="Workouts"
      subtitle="Explore workout definitions and team recommendations."
      apiPath="/api/workouts/"
      emptyMessage="No workouts found."
      columns={columns}
      rowLabel={(item) => item?.name || 'Workout'}
    />
  );
}

export default Workouts;
