import DataView from './DataView';

const columns = [
  {
    header: 'Team',
    render: (item) => item?.team?.name || 'N/A',
  },
  {
    header: 'Points',
    render: (item) => (typeof item?.points === 'number' ? item.points : 'N/A'),
  },
  {
    header: 'Rank',
    render: (item) => {
      if (typeof item?.points !== 'number') {
        return 'N/A';
      }

      if (item.points >= 1000) {
        return 'Elite';
      }

      if (item.points >= 500) {
        return 'Advanced';
      }

      return 'Rising';
    },
  },
];

function Leaderboard() {
  return (
    <DataView
      title="Leaderboard"
      subtitle="Check team standings and current points."
      apiPath="/api/leaderboard/"
      emptyMessage="No leaderboard entries found."
      columns={columns}
      rowLabel={(item) => item?.team?.name || 'Leaderboard entry'}
    />
  );
}

export default Leaderboard;
