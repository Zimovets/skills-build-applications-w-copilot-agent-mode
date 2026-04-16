import DataView from './DataView';

const columns = [
  {
    header: 'User',
    render: (item) =>
      item?.user?.name || item?.user?.email || item?.user_display || 'N/A',
  },
  {
    header: 'Type',
    render: (item) => item?.type || item?.activity_type || 'N/A',
  },
  {
    header: 'Duration',
    render: (item) =>
      typeof item?.duration === 'number' ? `${item.duration} min` : 'N/A',
  },
  {
    header: 'Date',
    render: (item) => item?.date || 'N/A',
  },
];

function Activities() {
  return (
    <DataView
      title="Activities"
      subtitle="Track recorded activity sessions with duration and date."
      apiPath="/api/activities/"
      emptyMessage="No activities found."
      columns={columns}
      rowLabel={(item) => item?.type || item?.activity_type || 'Activity'}
    />
  );
}

export default Activities;
