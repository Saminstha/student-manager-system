import { useAppSelector } from "../store/hooks";

function BackendStudents() {
  const students = useAppSelector((state) => state.students.backendStudents);

  const loading = useAppSelector((state) => state.students.loading);

  const error = useAppSelector((state) => state.students.error);

  if (loading) {
    return <p>Loading backend students...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h2>Students From Backend</h2>

      {students.map((student) => (
        <div
          key={student._id}
          style={{
            border: "1px solid #ddd",
            padding: "20px",
            marginBottom: "15px",
            borderRadius: "10px",
          }}
        >
          <h3>{student.name}</h3>

          <p>
            <strong>ID:</strong> {student._id}
          </p>

          <p>
            <strong>Age:</strong> {student.age}
          </p>

          <p>
            <strong>Email:</strong> {student.email}
          </p>

          <p>
            <strong>Phone:</strong> {student.phone}
          </p>
        </div>
      ))}
    </div>
  );
}

export default BackendStudents;
