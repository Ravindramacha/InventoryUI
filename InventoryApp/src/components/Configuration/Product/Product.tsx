import DataTable from "../../Vendor/DataTable";

// Example usage with mocked data
const exampleRows = [
  { id: 1, name: "Alice Smith", email: "alice@example.com", age: 28 },
  { id: 2, name: "Bob Jones", email: "bob@example.com", age: 35 },
  { id: 3, name: "Carol White", email: "carol@example.com", age: 22 },
];

export default function Product() {
  return <DataTable rows={exampleRows} />;
}