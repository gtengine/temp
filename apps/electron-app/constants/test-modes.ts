export const modes = [
  {
    title: "횟수",
    dataSet: [
      { field: "count", name: "1회", value: 1 },
      { field: "count", name: "10회", value: 10 },
      { field: "count", name: "50회", value: 50 },
      { field: "count", name: "100회", value: 100 },
    ],
  },
  {
    title: "시간",
    dataSet: [
      { field: "time", name: "1 min", value: 1 },
      { field: "time", name: "3 min", value: 3 },
      { field: "time", name: "5 min", value: 5 },
    ],
  },
  {
    title: "무한",
    dataSet: [
      {
        field: "infinity",
        name: "Infinity",
        value: Number.POSITIVE_INFINITY,
      },
    ],
  },
];
